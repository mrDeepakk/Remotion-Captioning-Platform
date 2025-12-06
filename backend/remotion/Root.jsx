import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition.jsx';

/**
 * Remotion Root Component
 * Register compositions for rendering
 */
export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={VideoComposition}
        durationInFrames={300} // Default 10 seconds at 30fps, will be overridden
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoPath: '',
          captions: [],
          stylePreset: 'standard'
        }}
      />
    </>
  );
};
