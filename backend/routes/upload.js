import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    }
});

// File filter to accept only MP4 videos
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/mpeg'];

    if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.mp4')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4 videos are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB max file size
    }
});

/**
 * POST /api/upload
 * Upload an MP4 video file
 */
router.post('/', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: { message: 'No video file provided' }
            });
        }

        const videoId = path.parse(req.file.filename).name;
        const videoUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                videoId,
                videoUrl,
                videoPath: req.file.path,
                originalFilename: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: { message: 'Failed to upload video', details: error.message }
        });
    }
});

export default router;
