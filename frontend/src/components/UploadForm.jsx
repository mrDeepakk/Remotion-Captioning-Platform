import React, { useState, useRef } from 'react';
import { uploadVideo } from '../api/captionsApi';

/**
 * Upload Form Component
 * Handles video file upload with drag-and-drop
 */
export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setError('');
    
    // Validate file type
    if (!selectedFile.type.includes('video/mp4') && !selectedFile.name.endsWith('.mp4')) {
      setError('Please upload an MP4 video file');
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 500MB');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadVideo(file);
      console.log('Upload successful:', result);
      onUploadSuccess(result.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Upload Video</h2>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-primary bg-primary bg-opacity-10'
            : 'border-gray-600 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4"
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          className="hidden"
        />
        
        <div className="text-6xl mb-4">🎬</div>
        
        {fileName ? (
          <div className="text-green-400 font-semibold mb-2">{fileName}</div>
        ) : (
          <p className="text-gray-400 mb-2">
            Drag and drop your MP4 video here, or click to browse
          </p>
        )}
        
        {file && (
          <p className="text-sm text-gray-500">
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-6 w-full btn ${
          !file || uploading ? 'btn-disabled' : 'btn-primary'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
}
