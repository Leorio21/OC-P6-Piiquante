const multer = require('multer');

const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'images');
        },
        filename: (req, file, callback) => {
            const name = file.originalname.split(' ').join('_');
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + Date.now() + '.' + extension);
        }
});

const upload = multer ({
    storage: storage,
    limits: {fileSize :1 * 1024 * 1024},
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
})

    module.exports = multer(upload).single('image');
