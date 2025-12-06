/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00D9FF',
                secondary: '#FFD700',
                dark: '#1a1a1a'
            },
            fontFamily: {
                sans: ['Noto Sans', 'Noto Sans Devanagari', 'sans-serif']
            }
        }
    },
    plugins: []
}
