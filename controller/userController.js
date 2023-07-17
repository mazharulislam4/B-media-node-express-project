import fs from "node:fs";
import { uploadToCloud } from "../cloudirany.js";
import {
  getUserByProperty,
  getUsers,
  sDeleteUser,
  sSetFollower,
  sUnfollower,
  sUnfollowing,
  updateUserById
} from "../services/sUser.js";
// get all users

export const cGetAllUser = async (req, res, next) => {

  try {
    const users = await getUsers();
    if (!users) {
      return res
        .status(200)
        .json({ error: null, data: null, msg: "not found!" });
    }

    return res.status(200).json({ error: null, data: users, msg: "success" });
  } catch (err) {
    next(err);
  }
};

// get user by id

export const cGetUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const users = await getUserByProperty("_id", id);
    if (!users) {
      return res
        .status(200)
        .json({ error: null, data: null, msg: "not found!" });
    }

    return res.status(200).json({ error: null, data: users, msg: "success" });
  } catch (err) {
    next(err);
  }
};

// put user

export const cPutUser = async (req, res, next) => {
  const { firstName, lastName, email, roles } = req.body;
  const { id } = req.params;
  const isAdmin = req.isAdmin ? req.isAdmin : false;
  const files = req?.files ? req.files : null;
  const { filename, path: filepath } = files ? files[0] : {};
  const PUBLIC_ID = req.user ? req.user.avatar.id : false;
  try {
    let updated;

    if (filename && path) {
      const { url, publicId } = await uploadToCloud(
        filepath,
        "practice1/avatars",
        PUBLIC_ID
      );

      fs.unlink(filepath, (err) => {
        if (err) {
          return next(createHttpError(500, "server error!"));
        }
      });

      if (isAdmin) {
        updated = await updateUserById(id, {
          firstName,
          lastName,
          email,
          avatar: { url: url, id: publicId },
          roles,
        });
      } else {
        updated = await updateUserById(id, {
          firstName,
          lastName,
          email,
          avatar: { url: url, id: publicId },
        });
      }
    } else {
      if (isAdmin) {
        updated = await updateUserById(id, {
          firstName,
          lastName,
          email,
          roles,
        });
      } else {
        updated = await updateUserById(id, {
          firstName,
          lastName,
          email,
        });
      }
    }

    if (!updated)
      return res
        .status(404)
        .json({ error: true, data: null, msg: "Not found" });


    return res.status(203).json({
      error: null,
      data: updated,
      msg: "updated user successfully!",
    });
  } catch (err) {
    next(err);
  }
};


// delete user 

export const cDeleteUser = async (req , res ,next)=>{
  try{
const {id} =req.params ; 

const deletedUser = await sDeleteUser(id) 
if (!deletedUser)
return res
  .status(500)
  .json({
    error: true,
    data: null,
    msg: "the user may be deleted or Internal Server Error",
  });

return res
.status(200)
.json({
  error: null,
  data: {id: deletedUser._id, email: deletedUser.email},
  msg: "user deleted successfully",
});
  }catch(err){
    next(err)
  }
}

// follower set 
export const cSetFollowers = async (req , res , next)=>{
const userId = req.body.userId;
const followingId = req.params.id;

try{

  if(userId && followingId){
    const follower = await sSetFollower(followingId , userId);
    return res
    .status(200)
    .json({ error: null, data: {id: follower._id , email: follower.email, name: follower.fullName} , msg: "you have been followed" });
  }else{
    return  res
    .status(400)
    .json({ error: true, data: null, msg: "missing data" });
  }

}catch(err){
next(err)
}

}


// unfollowing a user 

export const cUnfollowing = async (req , res , next)=>{
  const userId = req.body.userId;
  const followingId = req.params.id;
  
  try{
  
    if(userId && followingId){
      const unfollowing = await   sUnfollowing(followingId , userId);
      return res
      .status(200)
      .json({ error: null, data: {id: unfollowing._id , email: unfollowing.email, name: unfollowing.fullName} , msg: "you have been unfollowed" });
    }else{
      return  res
      .status(400)
      .json({ error: true, data: null, msg: "missing data" });
    }
  
  }catch(err){
  next(err)
  }
  
  }


  // unfollow user  who following you

export const cUnfollower= async (req , res , next)=>{
  const userId = req.body.userId;
  const followingId = req.params.id;
  
  try{
  
    if(userId && followingId){
      const unfollower = await   sUnfollower(followingId , userId);
      return res
      .status(200)
      .json({ error: null, data: {id: unfollower._id , email: unfollower.email, name: unfollower.fullName} , msg: "you have been unfollowed" });
    }else{
      return  res
      .status(400)
      .json({ error: true, data: null, msg: "missing data" });
    }
  
  }catch(err){
  next(err)
  }
  
  }