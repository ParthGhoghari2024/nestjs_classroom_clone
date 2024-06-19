import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
  dest: process.env.UPLOAD_LOCATION_ASSIGNMENT,
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 10 * 1024 * 1024, //10MB
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    // if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    //   // Allow storage of file
    //   cb(null, true);
    // } else {
    //   // Reject file
    //   cb(
    //     new HttpException(
    //       `Unsupported file type ${extname(file.originalname)}`,
    //       HttpStatus.BAD_REQUEST,
    //     ),
    //     false,
    //   );
    // }
    cb(null, true);
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${new Date()}_${extname(file.originalname)}`);
    },
  }),
};
