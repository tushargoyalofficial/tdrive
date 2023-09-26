const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const DIR = "./uploads";
const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, DIR);
  },
  filename: (_req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg & pdf format allowed!"));
    }
  },
});

app.get("/ping", (_req, res) => {
  res.status(200).json({ message: "pong" });
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  res.status(200).json({
    message: "upload successful",
    file: url + "/uploads/" + req.file.filename,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("server is running on port ", PORT);
});
