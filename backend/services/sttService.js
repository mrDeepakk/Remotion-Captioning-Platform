import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

/* ----------------------------------------------------
   CONFIG: AssemblyAI + Gemini Keys
-----------------------------------------------------*/

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!ASSEMBLYAI_API_KEY) console.warn("⚠️ Missing ASSEMBLYAI_API_KEY");
if (!GEMINI_API_KEY) console.warn("⚠️ Missing GEMINI_API_KEY");

const ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com/v2";

/* ----------------------------------------------------
   Gemini (NEW SDK)
-----------------------------------------------------*/

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
});

/**
 * Convert ANY text → Hinglish using Gemini 3 Flash
 */
export async function convertToHinglish(text) {
    try {
        const prompt = `
Convert the following text into pure Hinglish (Roman Hindi).

RULES:
- Hindi → Roman Hinglish (spoken style)
- English → Hinglish pronunciation (Indian accent)
- Do NOT change meaning
- Keep tone casual + natural
- Output must sound like real spoken Hinglish

Examples:
"Hurry up guys" → "Hari up gais"
"Please listen carefully" → "Plij lisan kerfeli"
"जल्दी करो guys" → "Jaldi karo gais"

Convert:
${text}
`;

        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return res.text.trim();

    } catch (err) {
        console.error("❌ Hinglish conversion failed:", err);
        return text;
    }
}

/* ----------------------------------------------------
   Upload to Assembly AI
-----------------------------------------------------*/

export async function uploadToAssemblyAI(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileStream = fs.createReadStream(filePath);

        const response = await axios.post(
            `${ASSEMBLYAI_BASE_URL}/upload`,
            fileStream,
            {
                headers: {
                    authorization: ASSEMBLYAI_API_KEY,
                    "content-type": "application/octet-stream",
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        );

        return response.data.upload_url;

    } catch (error) {
        console.error("❌ AssemblyAI Upload Error:", error.response?.data || error);
        throw new Error("Upload failed");
    }
}

/* ----------------------------------------------------
   Create Transcription Job
-----------------------------------------------------*/

export async function createTranscription(audioUrl) {
    try {
        const response = await axios.post(
            `${ASSEMBLYAI_BASE_URL}/transcript`,
            {
                audio_url: audioUrl,
                language_detection: true,
                punctuate: true,
                format_text: true,
            },
            {
                headers: {
                    authorization: ASSEMBLYAI_API_KEY,
                    "content-type": "application/json",
                },
            }
        );

        return response.data.id;

    } catch (error) {
        console.error("❌ Transcription Job Error:", error.response?.data || error);
        throw new Error("Failed to create transcription job");
    }
}

/* ----------------------------------------------------
   Poll Transcription Job
-----------------------------------------------------*/

export async function pollTranscription(transcriptId) {
    const maxAttempts = 120;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const response = await axios.get(
            `${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`,
            { headers: { authorization: ASSEMBLYAI_API_KEY } }
        );

        const { status, error } = response.data;

        if (status === "completed") return response.data;
        if (status === "error") throw new Error(error);

        console.log(`⏳ Waiting (${attempt + 1}/${maxAttempts}) - Status: ${status}`);
        await new Promise((resolve) => setTimeout(resolve, 4000));
    }

    throw new Error("Transcription timeout");
}

/* ----------------------------------------------------
   Convert Words → Caption Segments
-----------------------------------------------------*/

function wordsToCaption(words) {
    const captions = [];
    const wordsPerCaption = 10;

    for (let i = 0; i < words.length; i += wordsPerCaption) {
        const section = words.slice(i, i + wordsPerCaption);

        captions.push({
            id: String(captions.length + 1),
            start: section[0].start / 1000,
            end: section[section.length - 1].end / 1000,
            text: section.map((w) => w.text).join(" "),
        });
    }

    return captions;
}

/* ----------------------------------------------------
   MAIN FUNCTION — STT + Hinglish Conversion
-----------------------------------------------------*/

export async function generateCaptions(videoPath) {
    try {
        console.log("🎯 Starting caption process:", videoPath);

        const uploadUrl = await uploadToAssemblyAI(videoPath);
        const transcriptId = await createTranscription(uploadUrl);
        const result = await pollTranscription(transcriptId);

        let captions = [];

        if (result.words?.length) {
            captions = wordsToCaption(result.words);
        } else if (result.text) {
            captions = [{ id: "1", start: 0, end: 10, text: result.text }];
        }

        console.log(`📝 Captions generated: ${captions.length}`);
        console.log("🔄 Converting captions → Hinglish...");

        const hinglish = await Promise.all(
            captions.map(async (cap) => ({
                ...cap,
                text: await convertToHinglish(cap.text)
            }))
        );

        console.log("✅ Hinglish captions READY!");
        return hinglish;

    } catch (error) {
        console.error("❌ Caption Generation Error:", error);
        throw error;
    }
}
