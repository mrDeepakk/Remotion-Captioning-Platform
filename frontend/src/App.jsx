import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import CaptionEditor from "./components/CaptionEditor";
import CaptionStyleSelector from "./components/CaptionStyleSelector";
import VideoPreview from "./components/VideoPreview";
import TranslationControls from "./components/TranslationControls";
import RenderControls from "./components/RenderControls";
import "./styles/index.css";

/**
 * Main App Component
 * Orchestrates the entire captioning platform workflow
 */
function App() {
  // Video state
  const [videoData, setVideoData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPath, setVideoPath] = useState("");

  // Caption state
  const [captions, setCaptions] = useState([]);

  // Style state
  const [stylePreset, setStylePreset] = useState("standard");

  const handleUploadSuccess = (data) => {
    console.log("Video uploaded:", data);
    setVideoData(data);
    setVideoUrl(data.videoUrl);
    setVideoPath(data.videoPath);
    setCaptions([]); // Reset captions on new upload
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Remotion</span> Captioning Platform
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Upload videos, generate captions, and export with style
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            {/* Upload Form */}
            <UploadForm onUploadSuccess={handleUploadSuccess} />

            {/* Caption Editor */}
            {videoPath && (
              <CaptionEditor
                videoPath={videoPath}
                captions={captions}
                setCaptions={setCaptions}
              />
            )}

            {/* Caption Style Selector */}
            {captions.length > 0 && (
              <CaptionStyleSelector
                stylePreset={stylePreset}
                setStylePreset={setStylePreset}
              />
            )}

            {/* Translation Controls */}
            {captions.length > 0 && (
              <TranslationControls
                captions={captions}
                setCaptions={setCaptions}
              />
            )}

            {/* Render Controls */}
            {captions.length > 0 && (
              <RenderControls
                videoPath={videoPath}
                captions={captions}
                stylePreset={stylePreset}
              />
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <VideoPreview
              videoUrl={videoUrl}
              captions={captions}
              stylePreset={stylePreset}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p>Made with ❤️ by Deepak Kumar | © 2025 Crafted with Care</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
