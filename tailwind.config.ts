import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#0A0A0D",
                secondary: "#111114",
                gold: {
                    DEFAULT: "#D4AF37",
                    hover: "#b38e3a",
                    light: "rgba(212, 175, 55, 0.1)",
                },
                rosegold: "#E0BFB8",
                silver: "#D8D8D8",
                text: {
                    dark: "#0A0A0D",
                    light: "#FFFFFF",
                    muted: "#CFCFCF",
                },
                champagne: {
                    bg: "#F8F5F0",
                    accent: "#C6A96B",
                    text: "#1A1A1A",
                },
                emerald: {
                    bg: "#0F1F1C",
                    accent: "#2F8F83",
                    text: "#F4F4F4",
                },
                burgundy: {
                    bg: "#2B0F14",
                    accent: "#B76E79",
                    text: "#F5F2F2",
                },
                diamond: {
                    bg: "#FFFFFF",
                    accent: "#A8A8A8",
                    text: "#111111",
                }
            },
            fontFamily: {
                heading: ["var(--font-playfair)", "serif"],
                body: ["var(--font-lato)", "sans-serif"],
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            },
        },
    },
    plugins: [],
};
export default config;
