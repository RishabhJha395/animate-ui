import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
      },
      boxShadow: {
        glow: "0 0 48px rgba(127, 92, 255, 0.22)",
        panel: "0 20px 80px rgba(0, 0, 0, 0.42)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(127,92,255,.26), rgba(0,0,0,0) 34%), radial-gradient(circle at 80% 20%, rgba(94,234,212,.15), rgba(0,0,0,0) 28%)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
