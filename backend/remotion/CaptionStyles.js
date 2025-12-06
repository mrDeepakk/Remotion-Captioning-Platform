/**
 * Caption Style Presets
 * High-contrast, modern, readable on any background.
 */

export const captionStyles = {
    /**
     * 1. Standard Cinematic (Soft Dark Glass)
     * Premium glass + white text (not too bright)
     */
    standard: {
        container: {
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "75%",
            maxWidth: "900px",
            padding: "14px 24px",
            textAlign: "center",

            // Soft dark transparency (not black!)
            backgroundColor: "rgba(20, 20, 20, 0.45)",
            backdropFilter: "blur(8px)",

            borderRadius: "14px",
            border: "1.5px solid rgba(255,255,255,0.22)",
        },

        text: {
            fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
            fontSize: "42px",
            fontWeight: 600,
            color: "#FAFAFA",
            lineHeight: "1.35",
            margin: 0,
            textShadow: "2px 2px 6px rgba(0,0,0,0.85)",
        },
    },

    /**
     * 2. Top Bar (News Style)
     * Classy dark gradient + gold accent
     */
    topBar: {
        container: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "20px 32px",
            textAlign: "center",

            background: "linear-gradient(90deg, #0e1118, #1b2230)",
            borderBottom: "4px solid #f2c200",
        },

        text: {
            fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
            fontSize: "46px",
            fontWeight: 700,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1.4px",
            margin: 0,
            textShadow: "1px 1px 5px rgba(0,0,0,0.6)",
        },
    },

    /**
     * 3. Karaoke (Neon Highlight)
     * Perfect contrast + glowing readable neon
     */
    karaoke: {
        container: {
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            maxWidth: "950px",
            textAlign: "center",
            padding: "22px 32px",

            // Dark translucent for best contrast
            backgroundColor: "rgba(0, 0, 0, 0.40)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",

            border: "2px solid rgba(0, 200, 255, 0.45)",
            boxShadow: "0 6px 22px rgba(0, 200, 255, 0.35)",
        },

        text: {
            fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
            fontSize: "48px",
            fontWeight: 700,

            // Neon gradient text
            background: "linear-gradient(90deg, #00eaff, #ffe600)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",

            textShadow: "0 0 18px rgba(0, 255, 255, 0.8)",
            margin: 0,
            animation: "pulseGlow 1.8s ease-in-out infinite",
        },
    },
};

/**
 * Karaoke Glow Animation
 */
export const captionAnimations = `
@keyframes pulseGlow {
    0%, 100% {
        opacity: 1;
        filter: drop-shadow(0 0 12px rgba(0,255,255,0.8));
    }
    50% {
        opacity: 0.92;
        filter: drop-shadow(0 0 20px rgba(0,255,255,1));
    }
}
`;
