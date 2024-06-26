import {v2} from "cloudinary"
import fs from  "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLODINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadResult =async(localFilePath) =>{
    try{
      if(!localFilePath) return null
      const response=await cloudinary.uploade.upload(localFilePath,{
        resource_type:"auto"
      })
        console.log('file is uploaded on cloudinary',respose.url);   
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath)// remove the local saved temporary file as the upload operation failed
        return null;
    }
}

export {uploadResult}