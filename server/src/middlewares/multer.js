const multer = require('multer');

// file RAM (buffer) hold for direct pass imagekit
const storage = multer.memoryStorage();

// File (Validation) with type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only image files (JPG, PNG, WebP) are allowed.'), false);
    }
};

// 3. Multer Instance Initialization
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB Limit
    },
});

module.exports = upload;