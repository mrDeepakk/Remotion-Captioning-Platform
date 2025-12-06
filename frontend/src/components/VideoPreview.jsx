import React from 'react';
import { Player } from '@remotion/player';

/**
 * Remotion Composition for Preview
 * This mirrors the backend composition for frontend preview
 */
const RemotionComposition = ({ videoUrl, captions, stylePreset }) => {
  // This is a simplified frontend version - actual rendering happens on backend
  // For now, we'll just show the video. Full Remotion Player integration
  // would require bundling the same composition used on backend.
  
  return (
    <div className="relative w-full h-full bg-black">
      <video
        src={videoUrl}
        className="w-full h-full object-contain"
        controls
      />
      <div className="absolute inset-0 pointer-events-none">
        {/* Caption overlay would go here - simplified for preview */}
      </div>
    </div>
  );
};

/**
 * Video Preview Component
 * Shows uploaded video with Remotion Player
 */
export default function VideoPreview({ videoUrl, captions, stylePreset }) {
  if (!videoUrl) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🎥</div>
          <p>Upload a video to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <h2 className="text-2xl font-bold mb-6 text-primary">Video Preview</h2>
      
      <div className="bg-black rounded-lg overflow-hidden aspect-video">
        {/* Standard HTML5 video player for preview */}
        {/* Note: For full Remotion Player with captions, you'd need to bundle */}
        {/* the same Remotion composition and use @remotion/player */}
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
        />
      </div>

      {captions && captions.length > 0 && (
        <div className="mt-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
          <p className="text-green-300 text-sm">
            ✓ {captions.length} caption segments loaded
            {stylePreset && ` • Style: ${stylePreset}`}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>
          💡 <strong>Note:</strong> Final captions will be rendered on the exported video.
          The preview shows the base video only.
        </p>
      </div>
    </div>
  );
}
