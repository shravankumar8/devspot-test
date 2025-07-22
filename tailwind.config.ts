import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  safelist: ["dark"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xl2: "1500px",
        "2xl": "1400px",
      },
      fontFamily: {
        // roboto: ["Roboto", "sans-serif"],
        roboto: ["var(--font-roboto)"],
        robotoFlex: ["var(--font-roboto-flex)"],
        inter: ["Inter", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      fontSize: {
        heading: "1.75rem",
      },
      backgroundImage: {
        "dark-stepper":
          "linear-gradient(to right, black 0%, black 50%, rgb(35 35 42) 50%, rgb(35 35 42) 100%)",
        "light-stepper":
          "linear-gradient(to right, rgb(229 229 229), rgb(229 229 229),  white 50%, white 100%)",
      },
      colors: {
        "black-secondary": "#303037",
        "black-terciary": "#35353b",
        "button-primary": "#49494f",
        "secondary-text": "#89898C",
        "main-primary": "#4E52F5",
        "main-secondary": "#A076FF",
        "tertiary-text": "#424248",
        "primary-bg": "#13131A",
        "tertiary-bg": "#2B2B31",
        "secondary-bg": "#1B1B22",
        "dark-connect": "#1A1B1F",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        schedule: {
          bg: "hsl(var(--schedule-bg))",
          sidebar: "hsl(var(--schedule-sidebar))",
          timeline: "hsl(var(--schedule-timeline))",
          "event-blue": "hsl(var(--schedule-event-blue))",
          "event-purple": "hsl(var(--schedule-event-purple))",
          "event-green": "hsl(var(--schedule-event-green))",
          text: "hsl(var(--schedule-text))",
          "text-muted": "hsl(var(--schedule-text-muted))",
          border: "hsl(var(--schedule-border))",
        },
        blackest: {
          "50": "#313137",
          "100": "#282830",
          "200": "#1f1f28",
          "300": "#161621",
          "400": "#141419",
          "500": "#13131A",
          "600": "#0f0f16",
          "700": "#0b0b11",
          "800": "#08080d",
          "900": "#040408",
        },
        slate: {
          "50": "#3a3a42",
          "100": "#33333c",
          "200": "#2d2d36",
          "300": "#282830",
          "400": "#23232a",
          "500": "#1C1C24",
          "600": "#19191e",
          "700": "#141418",
          "800": "#0f0f12",
          "900": "#0a0a0c",
        },
        primary: {
          "400": "#7D80F7",
          "300": "#ADAFFA",
          "900": "#000375",
        },
        secondary: {
          "400": "#C3A8FF",
          "900": "#3400A8",
        },
        "devspot-gray-100": "rgba(27, 27, 34, 1)",
        "devspot-gray-200": "rgba(43, 43, 49, 1)",
        "devspot-gray-300": "rgba(66, 66, 72, 1)",
        "devspot-gray-400": "rgba(137, 137, 140, 1)",
      },
      boxShadow: {
        "card-img": "0 0 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
