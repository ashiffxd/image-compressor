const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());


const uploadDir = "./uploads";

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, 
    files: 1, 
  },
}).single("image");


app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (!req.file) {
      return res.status(400).json({ error: "Please send a file" });
    }
   

    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      
    });
  });

});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
