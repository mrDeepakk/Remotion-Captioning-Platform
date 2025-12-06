# 🎬 Remotion Auto-Captioning Platform

A powerful full-stack platform that automatically generates captions from uploaded videos, converts them to Hinglish using Google Gemini, and overlays them using Remotion with beautiful subtitle styles. Users can preview and export the final captioned video as MP4.

## 🌐 Live Demo

[Frontend](https://remotion-caption-platform.netlify.app/)

[Backend](https://remotion-captioning-platform.onrender.com)

📸 UI Screenshots

![Demo App](https://i.ibb.co/Z6yffS4n/Screenshot-2025-12-06-212412.png)

## ✨ Features

- 🎞️ Upload any .mp4 video

- 🧠 Automatic caption generation using AssemblyAI

- 🌐 Multi-language translation support

- 🎨 Multiple beautiful caption styles

- 🎥 Real-time video preview using Remotion Player

- 📤 Export final captioned video as .mp4

- 📱 Fully responsive and modern UI


## 🚀 Local Development Setup
```bash
git clone https://github.com/mrDeepakk/Remotion-Captioning-Platform.git
```

### Setup .env file
```js
PORT=5000
ASSEMBLYAI_API_KEY=your_ASSEMBLYAI_API_KEY
GEMINI_API_KEY=your_GEMINI_API_KEY
FRONTEND_URL=http://localhost:5173
```
## 🖥️ Backend Setup & Start backend server
```bash

cd backend
npm install
npm run dev
```

## 💻 Frontend Setup & Start the development server
```bash
cd frontend
npm install
npm run dev
```


Frontend runs at:

http://localhost:5173
