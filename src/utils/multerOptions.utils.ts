import { existsSync, mkdirSync } from 'fs';
import { Multer, diskStorage } from 'multer';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
// Multer configuration
export const multerConfig = {
  assignementDest: process.env.UPLOAD_LOCATION_ASSIGNMENT,
  submissionDest: process.env.UPLOAD_LOCATION_SUBMISSION,
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 10 * 1024 * 1024, //10MB
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|csv|pdf)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    cb(null, true);
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      const reqUrl: string[] = req.url.split('/');

      const isSubmission: boolean =
        reqUrl.filter((urlPart) => urlPart === 'submissions').length != 0
          ? true
          : false;

      let uploadPath: string = multerConfig.assignementDest;

      if (isSubmission) uploadPath = multerConfig.submissionDest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
};
