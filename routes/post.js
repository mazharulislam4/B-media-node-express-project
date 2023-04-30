import express from 'express';
import { cCreatePost, cDeletePost, cGetAllPost, cUpdatePost } from "../controller/postController.js";
import { authenticate, isAdmin } from '../middlewares/common/authorization.js';
const postRouter = express.Router();



postRouter.post('/' , authenticate , isAdmin   , cCreatePost)

// update post 
postRouter.patch('/:id' ,authenticate ,  cUpdatePost)

// delete post 
postRouter.delete('/:id' , authenticate , cDeletePost )

// get posts 
postRouter.get('/'  , cGetAllPost )


export default postRouter;