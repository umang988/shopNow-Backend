const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, '../images');
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileValidation = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png'){
        cb(null, true);
    } else {
        cb({ message : 'Unsupported media type'}, false)
    }
}

const upload = multer({
    storage : storage,
    fileFilter: fileValidation
})

module.exports = upload;