import express from "express";
import { cGetResetPassword, cLogin, cPostResetPassword, cRegister, cUpdatePassword } from '../controller/authController.js';
import { anyUploader } from "../middlewares/uploader/uploader.js";
import loginUserValidation from "../middlewares/validation/loginUserValidation.js";
import userValidation from "../middlewares/validation/userValidation.js";


const authRouter = express.Router()

authRouter.post('/register' , anyUploader , userValidation,  cRegister);

authRouter.post('/login' ,anyUploader , loginUserValidation , cLogin)

// reset password 
authRouter.get('/reset_password/:token' , cGetResetPassword)

authRouter.post('/reset_password' , cPostResetPassword)
// TODO: validation needed
authRouter.post('/update_password' , anyUploader ,  cUpdatePassword)

export default authRouter;
