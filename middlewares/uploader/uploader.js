
import formDataUploader from "../../utils/multer.js";

export const anyUploader = (req , res , next)=>{
 
    const uploader = formDataUploader('uploads' ,  ["image/jpeg", "image/jpg", "image/png"], 'only png , jpg or jpeg allowd!' )

  
    return uploader.any()(req , res , (err)=>{
        if(err) {
            console.log(err);
            res.status(400).json(err.message)
        }else{
             next()
        }
    })

}