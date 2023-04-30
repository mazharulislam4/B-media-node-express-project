import Jwt from "jsonwebtoken";
import config from "../../config.js";

export const authenticate = (req, res, next) => {
  let tokenFromCookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies[config.cookie.name].token : null;


    let tokenFromHeader = req.headers.authorization ?  req.headers.authorization.split(' ')[1] : null;

    let token = tokenFromHeader ?? tokenFromCookie;


  if (token) {
    const decode = Jwt.verify(token, config.jwt.key);
    req.user = decode;
    return next();
  }



  return res.status(203).json({
    error: "Authetication failure!",
  });
};



export const  isAdmin = (req , res , next)=>{
 
  const {userRole} = req.user;
  if(userRole.includes('admin')){
    return next();
  }

  return res.status(203).json({error: true , data:null , msg: 'You are not authorized to access this content!'})
}