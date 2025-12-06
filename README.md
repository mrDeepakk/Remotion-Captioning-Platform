# Remotion Captioning Platform

A production-ready full-stack web application for video captioning with Remotion. Upload MP4 videos, auto-generate Hinglish captions using AI, customize caption styles, translate captions, and export professional captioned videos.

## 🎯 Features

- **Video Upload**: Drag-and-drop MP4 video upload (up to 500MB)
- **Auto-Caption Generation**: AI-powered speech-to-text with Hinglish support (mixed Hindi/English)
- **3 Caption Styles**: Standard, Top Bar, and Karaoke presets
- **Caption Editing**: Edit generated captions in real-time
- **Translation**: Translate captions to multiple languages
- **Video Export**: Render final captioned videos using Remotion
- **Responsive UI**: Modern, clean interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** (18.x) - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@remotion/player** - Video preview with captions
- **Axios** - HTTP client

### Backend
- **Node.js** (18.x) + **Express.js** - Server framework
- **Remotion** - Server-side video rendering
- **AssemblyAI** - Speech-to-text API (Hinglish support)
- **OpenAI GPT-4** - Caption translation
- **Multer** - File upload handling

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **API Keys**:
  - AssemblyAI API Key ([Get one here](https://www.assemblyai.com/))
  - OpenAI API Key ([Get one here](https://platform.openai.com/))

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
cd d:/backend/caption-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:

```env
PORT=5000
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in the `frontend` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 💻 Running Locally

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: **http://localhost:5000**

### Start Frontend Server

In a **new terminal window**:

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 📚 API Documentation

### Upload Video

**POST** `/api/upload`

Upload an MP4 video file.

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "video=@path/to/video.mp4"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "unique-id",
    "videoUrl": "/uploads/video.mp4",
    "videoPath": "/absolute/path/to/video.mp4",
    "originalFilename": "video.mp4",
    "size": 12345678,
    "mimetype": "video/mp4"
  }
}
```

### Generate Captions

**POST** `/api/captions/generate`

Generate captions using AssemblyAI STT.

```bash
curl -X POST http://localhost:5000/api/captions/generate \
  -H "Content-Type: application/json" \
  -d '{"videoPath": "/path/to/uploaded/video.mp4"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "captions": [
      {
        "id": "1",
        "start": 0.54,
        "end": 3.72,
        "text": "hey guys, आज हम सीखेंगे"
      }
    ],
    "count": 10
  }
}
```

### Translate Captions

**POST** `/api/captions/translate`

Translate captions to another language.

```bash
curl -X POST http://localhost:5000/api/captions/translate \
  -H "Content-Type: application/json" \
  -d '{
    "captions": [...],
    "targetLanguage": "hi"
  }'
```

**Supported Languages:** `en` (English), `hi` (Hindi), `es` (Spanish), `fr` (French), `de` (German), `ja` (Japanese), `ko` (Korean)

### Render Video

**POST** `/api/render`

Render final video with captions.

```bash
curl -X POST http://localhost:5000/api/render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "captions": [...],
    "stylePreset": "standard"
  }'
```

**Style Presets:** `standard`, `topBar`, `karaoke`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Video rendered successfully",
    "outputPath": "/path/to/output.mp4",
    "outputUrl": "/outputs/video_captioned_123.mp4",
    "downloadUrl": "http://localhost:5000/outputs/video_captioned_123.mp4"
  }
}
```

## 🤖 STT Integration (AssemblyAI)

### How It Works

1. Video file is uploaded to AssemblyAI's servers
2. AssemblyAI processes the audio and transcribes speech
3. Transcription supports **language auto-detection** (Hinglish compatible)
4. Word-level timestamps are converted to caption segments
5. Captions are returned in normalized format

### Configuration

Set your API key in `backend/.env`:
```env
ASSEMBLYAI_API_KEY=your_key_here
```

**Docs**: [AssemblyAI Documentation](https://www.assemblyai.com/docs)

## 🌐 Translation Integration (OpenAI)

### How It Works

1. Captions are sent to OpenAI GPT-4 API
2. Each caption text is translated while preserving meaning
3. Timing information (start/end) remains unchanged
4. Batch processing for efficiency

### Configuration

Set your API key in `backend/.env`:
```env
OPENAI_API_KEY=your_key_here
```

**Docs**: [OpenAI API Documentation](https://platform.openai.com/docs)

## 🎨 Caption Style Presets

### 1. Standard
- **Position**: Bottom-centered
- **Style**: White text on black semi-transparent background
- **Use Case**: Traditional subtitles

### 2. Top Bar
- **Position**: Full-width top bar
- **Style**: Bold uppercase text with gold accent
- **Use Case**: News-style captions

### 3. Karaoke
- **Position**: Bottom-centered
- **Style**: Gradient text with glow effect and animation
- **Use Case**: Engaging social media content

## 🎥 Remotion Rendering

### How Rendering Works

1. Backend bundles the Remotion composition
2. Video is rendered frame-by-frame with caption overlays
3. Output is saved as MP4 in the `outputs/` directory
4. Download URL is provided to frontend

### CLI Rendering (Alternative)

You can also render videos via CLI:

```bash
cd backend
node -e "
const { renderVideo } = require('./services/remotionService.js');
renderVideo(
  '/path/to/video.mp4',
  [{id:'1',start:0,end:5,text:'Hello'}],
  'standard',
  './outputs/output.mp4'
);
"
```

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend-url.com`

### Backend Deployment (Render)

1. Create new Web Service on Render
2. Connect repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `PORT=5000`
   - `ASSEMBLYAI_API_KEY=your_key`
   - `OPENAI_API_KEY=your_key`
   - `FRONTEND_URL=https://your-frontend-url.vercel.app`

**Note**: Ensure CORS is properly configured with your frontend URL.

## 🐛 Troubleshooting

### Video Upload Fails
- Check file size (max 500MB)
- Ensure file is .mp4 format
- Verify backend is running

### Caption Generation Slow
- AssemblyAI processing typically takes 30-60 seconds
- Time depends on video length
- Check API key is valid

### Font Rendering Issues (Hindi Characters)
- Ensure Google Fonts are loading (`Noto Sans Devanagari`)
- Check browser console for font errors
- Verify internet connection for CDN access

### Rendering Takes Too Long
- Rendering is CPU-intensive
- Time depends on video length and server resources
- For production, consider async job queue

## 📁 Project Structure

```
caption-platform/
├── backend/
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic (STT, Translation, Remotion)
│   ├── remotion/         # Remotion composition files
│   ├── uploads/          # Uploaded videos
│   ├── outputs/          # Rendered videos
│   ├── server.js         # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API client & services
│   │   ├── styles/       # Global CSS
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🎯 Sample Workflow

1. **Upload**: Click or drag-drop an MP4 video
2. **Generate**: Click "Auto-generate captions" (wait 30-60s)
3. **Edit**: Modify caption text if needed
4. **Style**: Select a caption style preset
5. **Translate** (optional): Choose target language and translate
6. **Render**: Click "Render & Export" (wait 2-5 minutes)
7. **Download**: Download the final captioned video

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or pull request.

## 📧 Support

For issues or questions, please open a GitHub issue or contact the maintainer.

---

**Built with ❤️ using React, Remotion, AssemblyAI, and OpenAI**
