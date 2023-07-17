import express from "express";
import { cGetResetPassword, cLogin, cLogout, cPostResetPassword, cRegister, cUpdatePassword } from '../controller/authController.js';
import { anyUploader } from "../middlewares/uploader/uploader.js";
import loginUserValidation from "../middlewares/validation/loginUserValidation.js";
import userValidation from "../middlewares/validation/userValidation.js";

const authRouter = express.Router()

authRouter.post('/register' , anyUploader , userValidation,  cRegister);

authRouter.post('/login' ,anyUploader , loginUserValidation , cLogin)

// reset password 
authRouter.get('/reset_password/:token' , cGetResetPassword)

// logout 
authRouter.post('/logout' , cLogout)




authRouter.post('/reset_password' , cPostResetPassword)
// TODO: validation needed
// update password from given form when reset_password api called 
authRouter.post('/update_password' , anyUploader ,  cUpdatePassword)

export default authRouter;
