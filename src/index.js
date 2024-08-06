import dotenv from 'dotenv';
import express from 'express';
import routers from './routes';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

dotenv.config();

// Start the server
const PORT = process.env.APP_PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Hoặc engine khác nếu bạn không dùng EJS
app.set('views', './src/views'); // Đường dẫn đến thư mục chứa views

app.use(express.urlencoded());
app.use(express.json());
app.use('/', routers);
//Error Handle

app.use(express.static(path.join(__dirname, '/public')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/public/uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const uploadStorage = multer({ storage: storage })

// Single file
app.post("/single", uploadStorage.single("file"), (req, res) => {
  console.log(req.file)
  return res.send("Single file")
})

//Multiple files
app.post("/multiple", uploadStorage.array("file", 10), (req, res) => {
  console.log(req.files)
  return res.send("Multiple files")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
