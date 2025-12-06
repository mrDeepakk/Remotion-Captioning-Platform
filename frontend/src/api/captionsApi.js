import apiClient from './apiClient';
import axios from 'axios';

/**
 * API Service Functions for Captions Platform
 */

/**
 * Upload video file
 * @param {File} file - Video file to upload
 * @returns {Promise<Object>} Upload response
 */
export async function uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);

    const response = await axios.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

/**
 * Generate captions from video
 * @param {string} videoPath - Path to uploaded video
 * @returns {Promise<Array>} Array of caption objects
 */
export async function generateCaptions(videoPath) {
    const response = await apiClient.post('/api/captions/generate', {
        videoPath
    });

    return response.data.captions;
}

/**
 * Translate captions
 * @param {Array} captions - Caption array
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Array>} Translated captions
 */
export async function translateCaptions(captions, targetLanguage) {
    const response = await apiClient.post('/api/captions/translate', {
        captions,
        targetLanguage
    });

    return response.data.captions;
}

/**
 * Render video with captions
 * @param {string} videoPath - Path to video
 * @param {Array} captions - Captions array
 * @param {string} stylePreset - Style preset
 * @returns {Promise<Object>} Render result
 */
export async function renderVideo(videoPath, captions, stylePreset) {
    const response = await apiClient.post('/api/render', {
        videoPath,
        captions,
        stylePreset
    });

    return response.data;
}

/**
 * Get available languages
 * @returns {Promise<Object>} Language options
 */
export async function getLanguages() {
    const response = await apiClient.get('/api/captions/languages');
    return response.data.languages;
}
