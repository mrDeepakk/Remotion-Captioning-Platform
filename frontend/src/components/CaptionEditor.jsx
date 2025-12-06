import React, { useState } from 'react';
import { generateCaptions } from '../api/captionsApi';
import Loader from './Loader';

/**
 * Caption Editor Component
 * Displays and allows editing of caption segments
 */
export default function CaptionEditor({ videoPath, captions, setCaptions }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateCaptions = async () => {
    if (!videoPath) {
      setError('Please upload a video first');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const generatedCaptions = await generateCaptions(videoPath);
      console.log('Captions generated:', generatedCaptions);
      setCaptions(generatedCaptions);
    } catch (err) {
      console.error('Caption generation error:', err);
      setError(err.message || 'Failed to generate captions');
    } finally {
      setGenerating(false);
    }
  };

  const handleCaptionEdit = (id, newText) => {
    setCaptions(
      captions.map((caption) =>
        caption.id === id ? { ...caption, text: newText } : caption
      )
    );
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Captions</h2>

      {/* Generate Button */}
      {captions.length === 0 && (
        <button
          onClick={handleGenerateCaptions}
          disabled={!videoPath || generating}
          className={`w-full btn mb-4 ${
            !videoPath || generating ? 'btn-disabled' : 'btn-primary'
          }`}
        >
          {generating ? 'Generating Captions...' : '✨ Auto-Generate Captions'}
        </button>
      )}

      {/* Loading State */}
      {generating && (
        <Loader message="Generating captions... This may take 30-60 seconds." />
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Caption List */}
      {captions.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {captions.map((caption) => (
            <div
              key={caption.id}
              className="bg-gray-700 p-4 rounded-lg border border-gray-600"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">
                  {caption.start.toFixed(2)}s - {caption.end.toFixed(2)}s
                </span>
                <span className="text-xs text-gray-500">ID: {caption.id}</span>
              </div>
              <textarea
                value={caption.text}
                onChange={(e) => handleCaptionEdit(caption.id, e.target.value)}
                className="input resize-none"
                rows={2}
                placeholder="Caption text..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!generating && captions.length === 0 && videoPath && (
        <div className="text-center py-8 text-gray-500">
          Click "Auto-Generate Captions" to start
        </div>
      )}
    </div>
  );
}
