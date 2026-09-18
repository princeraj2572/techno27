import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#050816",
          900: "#09111f",
          800: "#10203a"
        },
        aurora: {
          300: "#8ee7ff",
          400: "#4fd2ff",
          500: "#1f9ed9"
        },
        ember: {
          300: "#ffd08a",
          400: "#ffb85b",
          500: "#ff9b1f"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(142, 231, 255, 0.16), 0 24px 60px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "festival-radial": "radial-gradient(circle at top, rgba(79, 210, 255, 0.22), transparent 42%), linear-gradient(180deg, #050816 0%, #09111f 100%)"
      }
    }
  },
  plugins: []
};

export default config;