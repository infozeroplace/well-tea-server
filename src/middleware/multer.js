import multer from "multer";
import path from "path";
import generateUniqueImageName from "../utils/generateUniqueImageName.js";

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "src/public");
  // },
  filename: (req, file, cb) => {
    const uniqueSuffix = generateUniqueImageName(file.originalname);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedImage = /png|jpg|jpeg|pdf/;
    const extension = path.extname(file.originalname);
    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not supported"));
    }
  },
}).single("image");

export { upload };
