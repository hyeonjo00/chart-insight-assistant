import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        foreground: "#F6F7FB",
        border: "#1E293B",
        panel: "#0B1120",
        muted: "#94A3B8",
        accent: "#38BDF8",
        accentSoft: "#0F172A",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 189, 248, 0.18), 0 24px 80px rgba(15, 23, 42, 0.45)",
      },
      backgroundImage: {
        spotlight:
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 30%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 28%)",
      },
    },
  },
  plugins: [],
};

export default config;
