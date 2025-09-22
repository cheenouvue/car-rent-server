import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(morgan('dev'));

const corsOptions = {
    origin:["http://localhost:5173","http://localhost:5174"], // URL ของ frontend
    credentials: true,  // อนุญาตให้ส่ง cookies ไปกับคำขอ
  };
app.use(cors(corsOptions));

const uploadDir = path.join(process.cwd(), "src/uploads/images");
const uploadDirIcon = path.join(process.cwd(), "src/uploads/icons");

app.use("/images", express.static(uploadDir));
app.use("/icons", express.static(uploadDirIcon));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});
