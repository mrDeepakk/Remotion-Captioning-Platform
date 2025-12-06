import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderVideo, generateOutputFilename } from '../services/remotionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();



/**
 * POST /api/render
 * Render final video with captions
 */
router.post('/', async (req, res) => {
    try {
        const { videoPath, captions, stylePreset = 'standard' } = req.body;

        console.log("======= RENDER INPUT =======");
        console.log("Video Path:", videoPath);
        console.log("Captions Count:", captions);
        console.log("Style Preset:", stylePreset);
        console.log("============================");

        // Validation
        if (!videoPath || typeof videoPath !== "string") {
            return res.status(400).json({
                success: false,
                error: { message: 'videoPath is required and must be a string' }
            });
        }

        if (!Array.isArray(captions) || captions.length === 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'captions must be a non-empty array' }
            });
        }

        const validStyles = ['standard', 'topBar', 'karaoke'];
        if (!validStyles.includes(stylePreset)) {
            return res.status(400).json({
                success: false,
                error: { message: `Invalid stylePreset. Must be: ${validStyles.join(', ')}` }
            });
        }

        console.log('🎬 Starting render job...');

        // Generate output file
        const videoId = path.parse(videoPath).name;
        const outputFilename = generateOutputFilename(videoId);
        const outputDir = path.join(__dirname, '../outputs');

        const outputPath = path.join(outputDir, outputFilename);

        // Ensure outputs folder exists
        // (optional improvement if needed)
        // fs.mkdirSync(outputDir, { recursive: true });

        // Render the video
        const resultPath = await renderVideo(videoPath, captions, stylePreset, outputPath);

        const outputUrl = `/outputs/${outputFilename}`;
        const downloadUrl = `${req.protocol}://${req.get('host')}${outputUrl}`;

        return res.json({
            success: true,
            data: {
                message: 'Video rendered successfully',
                outputPath: resultPath,
                outputUrl,
                downloadUrl
            }
        });

    } catch (error) {
        console.error('❌ Render error:', error);

        return res.status(500).json({
            success: false,
            error: {
                message: 'Failed to render video',
                details: error.message
            }
        });
    }
});

/**
 * GET /api/render/status/:jobId
 * Check render status (for future async implementation)
 */
router.get('/status/:jobId', (req, res) => {
    res.json({
        success: true,
        message: 'Async rendering not yet implemented. Use synchronous POST /api/render',
        jobId: req.params.jobId
    });
});

export default router;
