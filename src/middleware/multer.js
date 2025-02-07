import multer from "multer";
import path from "path";
import sharp from "sharp";
import generateUniqueImageName from "../utils/generateUniqueImageName.js";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = generateUniqueImageName(file.originalname);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const singlePhotoUploader = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedImage = /png|jpg|jpeg|webp|svg|gif|svg+xml/;

    const extension = path.extname(file.originalname);

    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not supported"));
    }
  },
}).single("image");

const multipleImageMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedImage = /png|jpg|jpeg|webp|svg|gif|svg+xml/;

    const extension = path.extname(file.originalname);

    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not supported"));
    }
  },
}).array("images");

const imageDimensionMiddleware = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    req.formattedFiles = [];

    await Promise.all(
      req.files.map(async (file) => {
        const metadata = await sharp(file.path).metadata();

        req.formattedFiles.push({
          originalname: file.originalname,
          filename: file.filename,
          filetype: file.mimetype.split("/")[1],
          filesize: +(file.size / 1024).toFixed(2),
          filepath: `/public/image/upload/${file.filename}`,
          dimensions: `${metadata.width} by ${metadata.height} pixels`,
          media: "image",
          alternateText: "",
          path: file.path,
        });
      })
    );

    next();
  } catch (error) {
    next(error);
  }
};

export {
  imageDimensionMiddleware,
  multipleImageMiddleware,
  singlePhotoUploader,
};
