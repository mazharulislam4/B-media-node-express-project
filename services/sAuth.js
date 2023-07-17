import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import config from "../config.js";
import UserTokenModel from "../models/userTokens.model.js";
import { getResetPasswordTemplate } from "../template/email.js";
import { sendEmail } from "../utils/email.js";
import { erro } from "../utils/utils.js";
import { createUser, getUserByProperty } from "./sUser.js";
// global salt
const SALT = await genSalt(10);

export async function sRegisterUser(data, isAdmin) {
  const { firstName, lastName, email, password, roles, avatar } = data;

  const hashed = await hash(password, SALT);

  if (!isAdmin) {
    data.roles = "user";
  }

  return createUser({
    firstName: firstName,
    lastName: lastName,
    email: email,
    roles: roles,
    password: hashed,
    avatar: avatar,
  });
}

export async function sLogin({ email, password }) {
  const user = await getUserByProperty("email", email);

  if (!user) {
    throw erro("you don't have an account! please singup", 400);
  }

  const hashed = await compare(password, user.password);
  if (!hashed) {
    throw erro("email or password dont match", 400);
  }

  const payload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userRole: user.roles,
    avatar: user.avatar,
  };
  
  const token =  jwt.sign(payload, config.jwt.key, { expiresIn: config.jwt.expiresIn });

  return {
    token, 
    user: payload
  }
}

// reset password

export const sResetPasswordToken = async (email) => {
  const user = await getUserByProperty("email", email);

  if (!user) throw erro("user not found !", 404);

  let userToken = await UserTokenModel.findById(user._id);

  if (userToken) {
    await UserTokenModel.deleteOne();
  }

  let token = crypto.randomBytes(32).toString("hex");

  userToken = await new UserTokenModel({
    id: user._id,
    fullName: user.fullName,
    token: token,
  });

  await userToken.save();

  const link = `${config.global.baseURL}/api/v1/auth/reset_password/${userToken.token}?id=${userToken._id}`;

  const info = await sendEmail(
    user.email,
    "B-Media reset password",
    "",
    getResetPasswordTemplate(link)
  );

  return info;
};

// update password

export const sUpdatePassword = async (token, id, password) => {
  if (!token && !id) throw erro("missing data or internal server error", 500);

  const tokenUser = await UserTokenModel.findById(id);

  if (!tokenUser) throw erro("your link has expired!", 400);

  if(tokenUser.token !== token) throw erro("your link has expired!", 400);
  
  const user = await getUserByProperty("_id", tokenUser.id);

  if (!user) throw erro("internal sever error", 400);

  password = await hash(password, SALT);

  const update = await user.updateOne({ $set: { password: password } });

  return update.acknowledged;
};

