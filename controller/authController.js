import createHttpError from "http-errors";
import fs from "node:fs";
import { uploadToCloud } from "../cloudirany.js";
import config from "../config.js";
import {
  sLogin,
  sRegisterUser,
  sResetPasswordToken,
  sUpdatePassword
} from "../services/sAuth.js";
import { getUserByProperty } from "../services/sUser.js";

// signup or resiter
export async function cRegister(req, res, next) {
  try {
    const { firstName, lastName, email, password, roles } = req.body;

    const existsUser = await getUserByProperty("email", email);

    const isAdmin = req.isAdmin ? req.isAdmin : false;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ error: true, data: null, msg: "Invalid Data" });
    }

    if (!existsUser) {
      let user;

      const files = req?.files ? req.files : null;

      const { filename, path: filepath } = files ? files[0] : {};

      if (!filename || !filepath) {
        user = await sRegisterUser(
          { firstName, lastName, email, password, roles },
          isAdmin
        );
      } else {
        const { url, publicId } = await uploadToCloud(
          filepath,
          "practice1/avatars"
        );

        fs.unlink(filepath, (err) => {
          if (err) {
            return next(createHttpError(500, "server error!"));
          }
        });

        user = await sRegisterUser(
          {
            firstName,
            lastName,
            email,
            password,
            roles,
            avatar: { url: url, id: publicId },
          },
          isAdmin
        );
      }

      delete user._doc.password;
      return res
        .status(201)
        .json({ error: null, data: user, msg: "successfully registered!" });
    } else {
      return res
        .status(400)
        .json({ error: true, data: null, msg: "The email already exists!" });
    }
  } catch (err) {
    next(err);
  }
}

// login

export async function cLogin(req, res, next) {
  const { email, password } = req.body;
  try {
    const token = await sLogin({ email, password });
    if (token) {
      res.cookie(
        config.cookie.name,
        { token },
        {
          maxAge: config.cookie.expiresIn,
          httpOnly: true,
          signed: true,
        }
      );

      return res.status(200).json({
        error: false,
        data: { token },
        msg: "User loged In successfully!",
      });
    }
    return res.status(200).json({
      error: true,
      data: null ,
      msg: "email or password don't match!",
    });;
  } catch (err) {
    next(err);
  }
}

// reset pasword
export async function cPostResetPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ error: true, data: null, msg: "Invalid Data" });

    const sentEmail = await sResetPasswordToken(email);
    if (sentEmail)
      return res
        .status(200)
        .json({ error: null, data: sentEmail, msg: "Email sent" });
  } catch (err) {
    next(err);
  }
}

// get new pasword

export function cGetResetPassword(req, res, next) {
  const { token } = req.params;
  const { id } = req.query;
  res.render("resetPasswordForm", {
    title: "Reset Password",
    token: token,
    id: id,
  });
}

// update password

export async function cUpdatePassword(req, res, next) {
  try {
    const { token, id, password, confirmPassword } = req.body;

    if (!password || !id || !confirmPassword || !token)
      return res
        .status(400)
        .json({ error: true, data: null, msg: "Invalid data!" });

    if (confirmPassword !== password)
      return res
        .status(400)
        .json({ error: true, data: null, msg: "Password dont matchs!" });

     const update = await sUpdatePassword(token , id , password) 
     if(!update)  return res
     .status(400)
     .json({ error: true, data: null, msg: "Not update may internal sever error" });

     return res
     .status(200)
     .json({ error: null, data: update, msg: "New password updated!" });

  } catch (err) {
    next(err);
  }
}
