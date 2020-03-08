const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error('upload img of type jpj,jpeg and png only'))
        }

        cb(undefined, true)
    }
})
module.exports = upload;