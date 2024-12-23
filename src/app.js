import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { fileURLToPath } from "url";
import config from "./config/index.js";
import { corsOptions } from "./constant/common.constant.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import routes from "./routes/index.js";
import bodyParser from 'body-parser';
import { upload } from "./middleware/multer.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const stripe = new Stripe(config.stripe_secret_key);

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(
  express.json({
    limit: "100mb",
    verify: (req, res, buf) => {
      const url = req.originalUrl;
      if (url.includes("/payment/webhook")) {
        // Preserve the raw body for Stripe verification
        req.rawBody = buf;
      }
    },
  })
);

app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", routes);

app.get("/", async (req, res) => {
  res.send("WELCOME TO WELL TEA PRODUCTION!!");
});

app.post("/upload-file", upload, async (req, res) => {
  const {...payload} = req.file;

  const publicFolder = path.join(__dirname, "public", "uploads");
 
   if (!fs.existsSync(publicFolder)) {
     fs.mkdirSync(publicFolder, { recursive: true });
   }
 
   const newFilePath = path.join(publicFolder, payload.filename);
 
   fs.copyFile(payload.path, newFilePath, (copyErr) => {
     if (copyErr) {
       console.error("Error copying file:", copyErr);
       return;
     }
 
     // Delete the original file after copying
     fs.unlink(payload.path, (unlinkErr) => {
       if (unlinkErr) {
         console.error("Error deleting temp file:", unlinkErr);
         return;
       }
       console.log("File successfully uploaded to:", newFilePath);
     });
   });

   res.send(payload.filename);
});

app.use((req, res) => {
  return res.status(400).json({
    success: false,
    message: "API not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found",
      },
    ],
  });
});

app.use(globalErrorHandler);

export default app;
