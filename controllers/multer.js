const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define the destination folders
const uploadFolder = 'uploads';
const uploadCopyFolder = 'uploadsCopy';

// Ensure directories exist (or create them)
const ensureDirectoriesExist = () => {
  [uploadFolder, uploadCopyFolder].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectoriesExist();

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `image-${uniqueSuffix}.${fileExtension}`);
  },
});

// // Multer file filter
// const fileFilter = (req, file, cb) => {
//   console.log('MIME type:', file.mimetype); // Debugging line
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only image files are allowed.'), false);
//   }
// };

// Multer upload instance
const upload = multer({ storage });

// Middleware function to copy uploaded files to another folder
const copyFileToUploadCopyFolder = (req, res, next) => {
  if (req.files.length >0) {
  

  req.files.forEach(file => {
    const sourceFilePath = file.path;
    const destinationFilePath = path.join(uploadCopyFolder, file.filename);
    fs.copyFileSync(sourceFilePath, destinationFilePath);

    // Update file.path to reflect the new location
    file.path = destinationFilePath;
  });
  }
  next();
};

module.exports = { upload, copyFileToUploadCopyFolder };
