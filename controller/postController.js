import {
  sCreatePost,
  sDeletePost,
  sGetAllPost,
  sUpdatePostById,
} from "../services/sPost.js";

// create posts

// TODO: validation needed
export const cCreatePost = async (req, res, next) => {
  try {
    const { title, description, image, tags } = req.body;
    const tagsString = tags.trim().split(",");
    const userId = req.user ? req.user._id : null;

    if (!title || !description || !userId)
      return res
        .status(400)
        .json({ error: true, data: null, msg: "Invalid Data" });

    const post = await sCreatePost({
      title,
      description,
      image,
      tags: tagsString,
      user: userId,
    });

    return res
      .status(201)
      .json({ error: null, data: post, msg: "post created successfilly!" });
  } catch (err) {
    next(err);
  }
};

// update post

export const cUpdatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const tagsString = tags.trim().split(",");

    if (!id)
      return res
        .status(400)
        .json({ error: true, data: null, msg: "data is missing!" });

    const updated = await sUpdatePostById(id, {
      title,
      description,
      tags: tagsString,
    });

    res
      .status(200)
      .json({ error: null, data: updated, msg: "post updated successfully!" });
  } catch (err) {
    next(err);
  }
};

// detele a post

export const cDeletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletePost = await sDeletePost(id);
    if (!deletePost)
      return res
        .status(500)
        .json({
          error: true,
          data: null,
          msg: "content may be deleted or Internal Server Error",
        });

    return res
      .status(200)
      .json({
        error: null,
        data: deletePost,
        msg: "post deleted successfully",
      });
  } catch (err) {
    next(err);
  }
};

// get all users

export const cGetAllPost = async (req, res, next) => {
  try {
    const posts = await sGetAllPost(req.query);
    if (!posts)
      return res
        .status(400)
        .json({ error: true, data: null, msg: "Not found!" });

    return res.status(200).json({ error: null, data: posts, msg: "success" });
  } catch (err) {
    next(err);
  }
};
