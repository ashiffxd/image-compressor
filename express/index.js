const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

const app = express();
app.use(cors());
app.use(express.json());
ffmpeg.setFfmpegPath(ffmpegPath);

const uploadDir = "./uploads";
const downloadsDir = "./downloads";

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png) are allowed!"));
    }
  },
});

const upload = multer({
  storage: storage,
}).single("image");


async function compressImage(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .outputOptions([
        "-frames:v 1",
        "-q:v 2",
        "-vf scale=1280:-1",
      ])
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .run();
  });
}

// Upload route
app.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const inputPath = req.file.path;
      const outputPath = path.join(downloadsDir, `compressed-${Date.now()}.jpg`);

      await compressImage(inputPath, outputPath);

      res.status(200).json({
        message: "Image uploaded and compressed successfully!",
        compressedImageUrl: `http://localhost:${process.env.PORT || 8000}/downloads/${path.basename(outputPath)}`,
      });

      fs.unlinkSync(inputPath);
    } catch (compressionError) {
      console.error("Error compressing image:", compressionError);
      res.status(500).json({ error: "Error compressing image" });
    }
  });
});

// Serve downloads directory
app.use("/downloads", express.static(downloadsDir));

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
