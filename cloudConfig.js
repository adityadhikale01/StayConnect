import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECREAT
});


const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"StayConnect",
        allowedFormats:["jpg","png","jpeg"]
    }
});



export {cloudinary,storage};
