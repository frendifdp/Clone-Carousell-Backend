const cloudinary = require('cloudinary');

// const cloudinaryConfig = () => config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const cloudinaryConfig = (req, res, next) => {
    cloudinary.config({
        cloud_name: 'clonecarousell',
		api_key: '495172599284796',
		api_secret: 't7QPu3LkoS4YJpQGB2ERYQM9zqo'
    });
    next();
}

module.exports = cloudinaryConfig;