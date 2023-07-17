import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { erro } from "../utils/utils.js";

export const sCreatePost = async (data) => {
  const { title, description, tags, image, user } = data;

  const post = await new Post({
    title: title,
    description: description,
    tags: tags,
    image: image,
    user: user,
  }).save();

  await User.findByIdAndUpdate(user, { $push: { posts: post._id } });

  return post;
};

// get all posts

export const sGetAllPost = (query) => {
  if (query) {
    const limit = parseInt(query?._limit) || 5;
    const page = parseInt(query?._page) || 1;
    const sort = query?._sort || "created_at";
    const order = parseInt(query?._order) || 1;

    return Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sort]: order })
      .populate("user", "_id , email , fullName, avatar , firstName , roles , active_status");
  }
  return Post.find().populate("user", "_id , email , fullname , roles");
};

// update post by id

export const sUpdatePostById = async (id, data) => {
  if ((id, data)) {
    const { title, description, tags } = data;
    const post = await Post.findById({ _id: id });

    if (!post) return erro("the content does not exist!", 200);

    const update = await post.updateOne({ title, description, tags });
    if(update?.modifiedCount > 0) return await Post.findById(id)
    return update;
  }
};


// delete post 

export const sDeletePost =  (id)=>{
if(id) return Post.findByIdAndDelete(id);
return erro('id  missing' , 400)
}