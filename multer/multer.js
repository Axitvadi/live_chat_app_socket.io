const multer = require('multer');
const path = require('path')
const fs = require('fs')


const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {

        const uploadPath = path.join(__dirname, '../public/upload/images')
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const filename =
            Date.now() + Math.floor(Math.random() * 100) + file.originalname;
        callback(null, filename);
    },
});


const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const upload = multer({storage: fileStorage, fileFilter: fileFilter})

module.exports = upload
