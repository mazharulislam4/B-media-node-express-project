import cloudinary from "cloudinary";
import { config } from "dotenv";
import { erro } from "./utils/utils.js";

// env
config();
// Configuration

export const cloudConfig = cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadToCloud = async (file, folder , publicId) => {
  if (file && folder) {
    try {
      const result = await cloudinary.v2.uploader.upload(file, {
        folder: folder,
        resource_type: "auto",
      } , {public_id: publicId ? publicId : false });
     
      return {url: result.secure_url , publicId: result.public_id}
    } catch (err) {
      throw erro(500 , err);
    }
  } else {
    throw erro(500 , 'internal server error!');
  }
};
