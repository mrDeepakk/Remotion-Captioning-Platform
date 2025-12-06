import React from 'react';
import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig } from 'remotion';
import { captionStyles, karaokeAnimation } from './CaptionStyles.js';

/**
 * Main Video Composition with Captions
 */
export const VideoComposition = ({ videoPath, captions, stylePreset = 'standard' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Current time in seconds
  const currentTime = frame / fps;

  // Find active caption at current time
  const activeCaption = captions.find(
    caption => currentTime >= caption.start && currentTime < caption.end
  );

  // Get selected style
  const style = captionStyles[stylePreset] || captionStyles.standard;

  return (
    <>
      {/* Inject karaoke animation if needed */}
      {stylePreset === 'karaoke' && (
        <style dangerouslySetInnerHTML={{ __html: karaokeAnimation }} />
      )}
      
      <AbsoluteFill>
        {/* Background Video */}
        <Video
          src={videoPath}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: '#000'
          }}
        />

        {/* Caption Overlay */}
        {activeCaption && (
          <div style={style.container}>
            <p style={style.text}>
              {activeCaption.text}
            </p>
          </div>
        )}
      </AbsoluteFill>
    </>
  );
};
