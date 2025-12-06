import express from "express";
import { generateCaptions } from "../services/sttService.js";
import { translateCaptions, SUPPORTED_LANGUAGES } from "../services/translationService.js";

const router = express.Router();

/* ---------------------------------------------
   POST /api/captions/generate
   Generate Hinglish Captions
----------------------------------------------*/

router.post("/generate", async (req, res) => {
    try {
        const { videoPath } = req.body;

        if (!videoPath || typeof videoPath !== "string") {
            return res.status(400).json({
                success: false,
                error: "videoPath (string) is required",
            });
        }

        const captions = await generateCaptions(videoPath);

        return res.json({
            success: true,
            data: {
                captions,
                count: captions.length,
            },
        });

    } catch (error) {
        console.error("❌ Caption Generation Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to generate captions",
        });
    }
});

/* ---------------------------------------------
   POST /api/captions/translate
----------------------------------------------*/

router.post("/translate", async (req, res) => {
    try {
        const { captions, targetLanguage } = req.body;

        if (!Array.isArray(captions) || captions.length === 0) {
            return res.status(400).json({
                success: false,
                error: "captions array required",
            });
        }

        if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
            return res.status(400).json({
                success: false,
                error: `Unsupported language. Available: ${SUPPORTED_LANGUAGES.join(", ")}`,
            });
        }

        const translated = await translateCaptions(captions, targetLanguage);

        return res.json({
            success: true,
            data: {
                captions: translated,
                count: translated.length,
            },
        });

    } catch (error) {
        console.error("❌ Translation Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/* ---------------------------------------------
   GET /api/captions/languages
----------------------------------------------*/

router.get("/languages", (req, res) => {
    return res.json({
        success: true,
        data: { languages: SUPPORTED_LANGUAGES },
    });
});

export default router;
