import express from "express";
import { cRegister } from "../controller/authController.js";
import { cDeleteUser, cGetAllUser, cGetUserById, cPutUser, cSetFollowers, cUnfollower, cUnfollowing } from "../controller/userController.js";
import { authenticate, isAdmin } from "../middlewares/common/authorization.js";
import { anyUploader } from "../middlewares/uploader/uploader.js";


const userRouter = express.Router()

// get all users 
userRouter.get('/' , authenticate   , cGetAllUser )

// get by id 
userRouter.get('/:id' , authenticate , cGetUserById)


// delete user 
userRouter.delete('/:id' , authenticate  ,isAdmin  ,cDeleteUser);

// create user 
userRouter.post('/create' , authenticate  ,isAdmin , cRegister)


// put a user by id 
userRouter.put('/:id' , anyUploader , authenticate , cPutUser )

// followrs 
userRouter.patch('/:id/follower' , cSetFollowers)

// unfollowing 
userRouter.patch('/:id/unfollowing' , cUnfollowing)

// unfollower 
userRouter.patch('/:id/unfollower' , cUnfollower);




export default userRouter;
