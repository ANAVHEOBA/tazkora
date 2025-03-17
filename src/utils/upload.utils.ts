import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import fs from 'fs';

// Function to save base64 image
export const saveBase64Image = (base64String: string): string => {
  // Extract the base64 data and file extension
  const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const extension = matches[1];
  const base64Data = matches[2];
  const fileName = `${uuidv4()}.${extension}`;
  const filePath = path.join('uploads/tasks', fileName);

  // Create directory if it doesn't exist
  if (!fs.existsSync('uploads/tasks')) {
    fs.mkdirSync('uploads/tasks', { recursive: true });
  }

  // Save the file
  fs.writeFileSync(filePath, base64Data, 'base64');
  
  return filePath;
};

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    // Create directory if it doesn't exist
    if (!fs.existsSync('uploads/tasks')) {
      fs.mkdirSync('uploads/tasks', { recursive: true });
    }
    cb(null, 'uploads/tasks');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'));
  }
};

export const uploadTaskImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}); 