import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with sanitized filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

// File filter: strict PDF MIME and extension validation
const fileFilter = (req, file, cb) => {
  const allowedMime = 'application/pdf';
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === allowedMime && fileExt === '.pdf') {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only PDF documents are allowed.');
    error.statusCode = 400;
    cb(error, false);
  }
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB strict max size
    files: 1,
  },
});
