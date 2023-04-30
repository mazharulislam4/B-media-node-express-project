import User from "../models/user.model.js";
import { erro } from "../utils/utils.js";

// create user
export function createUser(data) {
  const newUser = new User({ ...data });
  newUser.info = {};
  return newUser.save();
}

// get all users
export function getUsers() {
  return User.find();
}

// find by property
export function getUserByProperty(key, value) {
  if (key === "_id") {
    return User.findById(value);
  }
  return User.findOne({ [key]: value });
}

// update user
export function updateUserById(id, data) {
  if (id && data) {
    if (data?.email) {
      const user = getUserByProperty("email", data.email);
      if (user?.email) throw erro("email already used!", 400);
    } else {
      const updated = User.findByIdAndUpdate(id, { ...data } , {returnDocument: 'after'});
    

      return ({id: id , updated: updated._update});
    //  return( {updated: updated._update , email: updated.email , fullName: updated.fullName ,  id: updated._id});
    }
  } else {
    throw erro("updateUserById function needs two arg ID  and DATA", 500);
  }
}

// set followers and following

export async function sSetFollower(followingId, userId) {
  if (followingId && userId) {
    const followingUser = await User.findById(followingId);
    const user = await User.findById(userId);

    if (!followingUser && !user) throw erro("user no longer!");

    if (followingId === userId) throw erro("you can not follow yourself", 400);

    if (!user.info.followings.includes(followingId)) {
      // following
      const following = await user.updateOne({
        $push: { "info.followings": followingUser._id },
      });
      //  followers
      const follower = await followingUser.updateOne({
        $push: { "info.followers": user._id },
      });

      if (follower.modifiedCount && following.modifiedCount) {
        return followingUser;
      } else {
        throw erro("server error!", 500);
      }
    } else {
      throw erro("already followed!", 400);
    }
  }
  return;
}

// unfollow a user whom you are following currently

export async function sUnfollowing(followingId, userId) {
  if (followingId && userId) {
    const followingUser = await User.findById(followingId);
    const user = await User.findById(userId);

    if (!followingUser && !user) throw erro("user no longer!");

    if (followingId === userId)
      throw erro("you can not unfollow yourself", 400);

    if (user.info.followings.includes(followingId)) {
      // following
      const unfollowing = await user.updateOne({
        $pull: { "info.followings": followingUser._id },
      });

      if (unfollowing.modifiedCount) {
        return followingUser;
      } else {
        throw erro("server error!", 500);
      }
    } else {
      throw erro("you are not following this user!", 400);
    }
  }
  return;
}

// unfollow a user who are following you currently

export async function sUnfollower(followingId, userId) {
  if (followingId && userId) {
    const followingUser = await User.findById(followingId);
    const user = await User.findById(userId);

    if (!followingUser && !user) throw erro("user no longer!");

    if (followingId === userId)
      throw erro("you can not unfollow yourself", 400);

    if (user.info.followers.includes(followingId)) {
      // following
      const unfollower = await user.updateOne({
        $pull: { "info.followers": followingUser._id },
      });

      if (unfollower.modifiedCount) {
        return followingUser;
      } else {
        throw erro("server error!", 500);
      }
    } else {
      throw erro("this user not following you", 400);
    }
  }
  return;
}



// delete user 
// TODO: delete user 

export const sDeleteUser =  (id)=>{
  if(id) return User.findByIdAndDelete(id)
  return erro('id  missing' , 400)
}