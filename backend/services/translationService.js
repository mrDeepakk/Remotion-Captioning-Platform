import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

/* ---------------------------------------------
   Gemini API Client (NEW SDK)
----------------------------------------------*/

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/* ---------------------------------------------
   Supported Languages
----------------------------------------------*/

export const SUPPORTED_LANGUAGES = [
    "English",        // English
    "Hindi",        // Hindi
    "Hinglish",  // Hinglish (special mode)
    "Spanish",        // Spanish
    "French",        // French
    "German",        // German
    "Japanese",        // Japanese
    "Korean"         // Korean
];

/* ---------------------------------------------
   Translate text with Gemini
----------------------------------------------*/

async function translateWithGemini(text, targetLanguage) {

    // Special Hinglish conversion mode
    if (targetLanguage === "hinglish") {
        const prompt = `
Convert the following text into natural Hinglish (Roman Hindi).

Rules:
- Hindi → Roman Hinglish
- English → Hinglish sound (Indian accent)
- DO NOT translate meaning
- Output must be readable & casual

Examples:
"Hurry up guys" → "Hari up gais"
"जल्दी करो guys" → "Jaldi karo gais"
"Please listen carefully" → "Plij lisan kerfeli"

Convert:
${text}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text();
    }

    // Normal language translation
    const prompt = `
Translate the following text into ${targetLanguage}.
Only return the translated text.

Text:
${text}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text();
}

/* ---------------------------------------------
   Batch translation
----------------------------------------------*/

async function translateBatch(textArray, targetLanguage) {
    const output = [];

    for (const text of textArray) {
        const translated = await translateWithGemini(text, targetLanguage);
        output.push(translated);
    }

    return output;
}

/* ---------------------------------------------
   Translate Captions (Array of Objects)
----------------------------------------------*/

export async function translateCaptions(captions, targetLanguage) {
    if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
        throw new Error(
            `Unsupported language: ${targetLanguage}. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`
        );
    }

    const texts = captions.map(c => c.text);

    const translatedTexts = await translateBatch(texts, targetLanguage);

    return captions.map((cap, i) => ({
        ...cap,
        text: translatedTexts[i]
    }));
}
