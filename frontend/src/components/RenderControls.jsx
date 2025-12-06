import React, { useState } from 'react';
import { renderVideo } from '../api/captionsApi';
import Loader from './Loader';

/**
 * Render Controls Component
 * Handles video rendering and export
 */
export default function RenderControls({
  videoPath,
  captions,
  stylePreset
}) {
  const [rendering, setRendering] = useState(false);
  const [renderResult, setRenderResult] = useState(null);
  const [error, setError] = useState('');

  const handleRender = async () => {
    if (!videoPath) {
      setError('Please upload a video first');
      return;
    }

    if (!captions || captions.length === 0) {
      setError('Please generate captions first');
      return;
    }

    setRendering(true);
    setError('');
    setRenderResult(null);

    try {
      const result = await renderVideo(videoPath, captions, stylePreset);
      console.log('Render complete:', result);
      setRenderResult(result);
    } catch (err) {
      console.error('Render error:', err);
      setError(err.message || 'Failed to render video');
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Render & Export</h2>

      {/* Render Info */}
      <div className="mb-6 p-4 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg text-blue-300 text-sm">
        <p className="font-semibold mb-2">📹 Rendering Settings:</p>
        <ul className="space-y-1 ml-4">
          <li>• Video: {videoPath ? '✓ Ready' : '✗ Not uploaded'}</li>
          <li>• Captions: {captions?.length || 0} segments</li>
          <li>• Style: {stylePreset || 'standard'}</li>
        </ul>
      </div>

      {/* Render Button */}
      <button
        onClick={handleRender}
        disabled={!videoPath || !captions || captions.length === 0 || rendering}
        className={`w-full btn mb-4 ${
          !videoPath || !captions || captions.length === 0 || rendering
            ? 'btn-disabled'
            : 'btn-primary'
        }`}
      >
        {rendering ? '⏳ Rendering...' : '🎬 Render & Export Video'}
      </button>

      {/* Loading State */}
      {rendering && (
        <div className="mb-4">
          <Loader message="Rendering video with captions... This may take several minutes." />
          <p className="text-center text-sm text-yellow-400 mt-4">
            ⚠️ Please keep this tab open during rendering
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Render Success */}
      {renderResult && (
        <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
          <p className="text-green-300 font-semibold mb-3">
            ✅ Video rendered successfully!
          </p>
          <a
            href={renderResult.downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center btn btn-primary"
          >
            ⬇️ Download Captioned Video
          </a>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Output: {renderResult.outputUrl}
          </p>
        </div>
      )}
    </div>
  );
}
