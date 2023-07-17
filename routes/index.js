import express from 'express';
import authRouter from "./auth.js";
import chatRouter from './chat/chat.js';
import postRouter from './post.js';
import profileRouter from './profile,.js';
import userRouter from './user.js';

const Router = express.Router();

Router.use('/api/v1/auth' ,  authRouter)
Router.use('/api/v1/user' ,  userRouter)
Router.use('/api/v1/user/profile' ,  profileRouter)
Router.use('/api/v1/post', postRouter )
Router.use('/api/v1/chat' , chatRouter)



export default Router;