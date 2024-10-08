
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'uploads');
},
filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, 'image-' + uniqueSuffix + '.' + fileExtension);
},
});

const fileFilter = (req, file, cb) => {
if (file.mimetype.startsWith('image/')) {
    cb(null, true);
} else {
    cb(new Error('Invalid file type. Only image files are allowed.'));
}
};

const upload = multer({ storage, fileFilter });

const productstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, 'image-' + uniqueSuffix + '.' + fileExtension);
    },
    });
    
    const productfileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image files are allowed.'));
    }
    };

const productupload = multer({ productstorage, productfileFilter });


const uploadImagesAndGetPaths = async (imagePaths) => {
    try {
      const formData = new FormData();
  
      // Append images to the formData
      imagePaths.forEach((imagePath, index) => {
        formData.append(`image[${index}]`, fs.createReadStream(imagePath));
      });
  
      // Make the POST request to the Laravel API
      const response = await axios.post('https://image.gitdr.com/api/upload-image', formData, {
        headers:{ 'Content-Type': 'multipart/form-data',}
        , // Set appropriate headers
      });
  
      //console.log(response.data);
      return response.data.filePaths; // Return the response data instead of the entire response
    } catch (error) {
      console.error(error.stack); // Handle errors, if any
      throw error; // Rethrow the error to be caught and handled elsewhere if needed
    }
  };
  
  //module.exports = { upload,productupload, uploadImagesAndGetPaths};



module.exports = {upload, uploadImagesAndGetPaths};
