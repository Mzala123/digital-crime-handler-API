const multer = require("multer")

multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

module.exports = multer();

// module.exports = multer({
//     dest:'../../public/uploads/',
//     // storage: multer.diskStorage({destination:'../../public/uploads/'}),
//     // filename: (req, file, callback) => {
//     //     console.log(file);
//     //     callback(null, `${file.fieldname}-${file.originalname}-${Date.now()}-${path.extname(file.originalname)}`);
//     //   }
    
// })

 