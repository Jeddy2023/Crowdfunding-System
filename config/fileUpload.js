import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinaryPackage from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const cloudinary = cloudinaryPackage.v2;

//cloudinary configure
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "farmunity-backend",
    transformation: [{ width: 400, height: 400, crop: "limit" }]
  },
}); //initialise multer with storage
const upload = multer({
  storage,
});

export default upload;
