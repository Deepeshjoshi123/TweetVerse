import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        dark: {
          ...daisyUIThemes["dark"],
          primary: "#1DA1F2",
          secondary: "#15202B",
          accent: "#FFAD1F",
          neutral: "#192734",
          "base-100": "#15202B",
          info: "#1DA1F2",
          success: "#17BF63",
          warning: "#FFAD1F",
          error: "#E0245E",
        },
      },
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
          secondary: "rgb(24, 24, 24)",
        },
      },
    ],
  },
};
