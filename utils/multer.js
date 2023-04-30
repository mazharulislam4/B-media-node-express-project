import createHttpError from "http-errors";
import multer from "multer";

import path from "node:path";


const formDataUploader = (folder, mime_types , mime_type_err , max_size = 500000) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,  folder);
    },
    filename: (req, file, cb) => {
       const extension = path.extname(file.originalname)
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    }
  });


  const fileter = (req , file , cb)=>{
    if(!mime_types.includes(file.mimetype))  {
        cb(createHttpError(400 ,  mime_type_err ) , false)
    }else{
        cb(null , true)
      }
  }

  return multer({ storage: storage , fileFilter: fileter , limits: max_size});
};


export default  formDataUploader;