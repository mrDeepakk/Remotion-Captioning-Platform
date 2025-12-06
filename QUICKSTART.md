# Quick Start Guide - Remotion Captioning Platform

## ⚠️ Important: API Keys Required

The application requires API keys to function. Follow these steps:

### Step 1: Get API Keys

#### AssemblyAI (for Speech-to-Text)
1. Go to https://www.assemblyai.com/
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

#### OpenAI (for Translation)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key and copy it

### Step 2: Configure Backend

Open `d:\backend\caption-platform\backend\.env` in a text editor and replace the placeholder values:

```env
PORT=5000
ASSEMBLYAI_API_KEY=paste_your_actual_assemblyai_key_here
OPENAI_API_KEY=paste_your_actual_openai_key_here
FRONTEND_URL=http://localhost:5173
```

**Important**: Remove the placeholder text and paste your actual API keys!

### Step 3: Start Servers

Open **two separate terminal windows**:

**Terminal 1 - Backend:**
```powershell
cd d:\backend\caption-platform\backend
npm run dev
```

Wait for: `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```powershell
cd d:\backend\caption-platform\frontend
npm run dev
```

Wait for: `➜  Local:   http://localhost:5173/`

### Step 4: Test the Application

1. Open your browser to: http://localhost:5173
2. You should see the **Remotion Captioning Platform** interface
3. Upload a small MP4 video (test with 10-30 seconds)
4. Click "Auto-generate captions"
5. Wait for captions to appear (30-60 seconds)

## 🧪 Testing Without Video

If you don't have API keys yet, you can still:
- See the UI by accessing http://localhost:5173 (frontend only)
- Test the upload form (file validation)
- Explore the interface

But you'll need API keys for:
- Caption generation (requires AssemblyAI)
- Translation (requires OpenAI)
- Full end-to-end testing

## 💡 Free Tier Limits

- **AssemblyAI**: Free tier includes hours of transcription per month
- **OpenAI**: Pay-as-you-go, very affordable for testing

## 🆘 Troubleshooting

### Backend won't start
- Error: `ASSEMBLYAI_API_KEY not set` → You haven't configured .env file
- Check that `.env` file exists in `backend/` directory
- Verify API keys are correct (no extra spaces)

### Frontend shows "Network Error"
- Make sure backend is running first
- Check backend console for errors
- Verify backend is on port 5000

### Caption generation fails
- Check AssemblyAI API key is valid
- Try with a smaller video first (< 1 minute)
- Check backend console for detailed error messages

---

**Ready to go?** Just add your API keys to the .env file and start the servers!
