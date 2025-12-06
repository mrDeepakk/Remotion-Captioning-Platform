import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Remotion Video Rendering Service
 * Handles server-side video rendering with captions
 */

/**
 * Convert absolute file path to HTTP URL
 * @param {string} filePath - Absolute file path
 * @returns {string} HTTP URL
 */
function convertFilePathToUrl(filePath) {
    const PORT = process.env.PORT || 5000;
    const filename = path.basename(filePath);

    // Determine which directory (uploads or outputs)
    const isUploads = filePath.includes('uploads');
    const directory = isUploads ? 'uploads' : 'outputs';

    const url = `http://localhost:${PORT}/${directory}/${filename}`;
    console.log(`🔗 Converting path to URL: ${filePath} → ${url}`);

    return url;
}

/**
 * Get video duration using Remotion's getVideoMetadata
 * @param {string} videoPath - Path to video file
 * @returns {Promise<number>} Duration in seconds
 */
async function getVideoDuration(videoPath) {
    try {
        // Use a simple approach: default to 30 seconds, can be enhanced with ffprobe
        // For production, consider using ffprobe or similar
        return 30; // Default duration
    } catch (error) {
        console.error('Error getting video duration:', error);
        return 30;
    }
}

/**
 * Render video with captions using Remotion
 * @param {string} videoPath - Absolute path to source video
 * @param {Array} captions - Array of caption objects
 * @param {string} stylePreset - Caption style ('standard', 'topBar', 'karaoke')
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to rendered video
 */
export async function renderVideo(videoPath, captions, stylePreset, outputPath) {
    console.log('🎬 Starting Remotion render...');
    console.log(`   Video: ${videoPath}`);
    console.log(`   Captions: ${captions.length} segments`);
    console.log(`   Style: ${stylePreset}`);

    try {
        // Convert file path to HTTP URL for browser access
        const videoUrl = convertFilePathToUrl(videoPath);

        // Step 1: Bundle Remotion project
        console.log('📦 Bundling Remotion project...');
        const bundleLocation = await bundle({
            entryPoint: path.join(__dirname, '../remotion/index.js'),
            webpackOverride: (config) => config,
        });
        console.log('✅ Bundle created:', bundleLocation);

        // Step 2: Get composition
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: 'CaptionedVideo',
            inputProps: {
                videoPath: videoUrl, // Use URL instead of file path
                captions,
                stylePreset
            }
        });

        console.log('✅ Composition selected:', composition.id);

        // Calculate duration based on last caption or video duration
        const lastCaption = captions[captions.length - 1];
        const durationInSeconds = lastCaption
            ? Math.ceil(lastCaption.end) + 2 // Add 2 seconds buffer
            : await getVideoDuration(videoPath);

        const durationInFrames = Math.ceil(durationInSeconds * composition.fps);

        // Step 3: Render video
        console.log(`🎥 Rendering video (${durationInSeconds}s, ${durationInFrames} frames)...`);
        console.log('   This may take a few minutes...');

        await renderMedia({
            composition: {
                ...composition,
                durationInFrames
            },
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps: {
                videoPath: videoUrl, // Use URL instead of file path
                captions,
                stylePreset
            },
            onProgress: ({ progress }) => {
                const percent = (progress * 100).toFixed(1);
                if (percent % 10 === 0) { // Log every 10%
                    console.log(`   Progress: ${percent}%`);
                }
            }
        });

        console.log('✅ Render complete!');
        console.log(`   Output: ${outputPath}`);

        return outputPath;
    } catch (error) {
        console.error('❌ Render error:', error);
        throw new Error(`Remotion render failed: ${error.message}`);
    }
}

/**
 * Generate output filename
 * @param {string} videoId - Original video ID
 * @returns {string} Output filename
 */
export function generateOutputFilename(videoId) {
    const timestamp = Date.now();
    return `${videoId}_captioned_${timestamp}.mp4`;
}
