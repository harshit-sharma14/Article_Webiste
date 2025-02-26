const cloudinary = require('cloudinary').v2;
const path = require('path');   
const crypto = require('crypto');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
});
const uploadFile = async (file) => {    
    try {
        const fileName = crypto.randomBytes(20).toString('hex') + path.extname(file.name);
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: `uploads/${fileName}`,
            tags: 'uploads',
        });
        return result.secure_url;
    } catch (error) {
        console.log(error);
    }
}