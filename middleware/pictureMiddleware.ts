const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req:any, file:any, cb:any) => {
    cb(null, "./public/images");
  },
  filename: (req:any, file:any, cb:any) => {
    console.log(file);
    cb(null, Date.now()+file.fieldname+'.png');
  },
});

var upload = multer({ storage: storage });
module.exports = upload;
