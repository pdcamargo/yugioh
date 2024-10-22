const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "32px",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1180px",
        "2xl": "1300px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities, theme, e }) {
      const colors = theme("colors");
      const innerGlowUtilities = {};

      // Generate default sizes
      const sizes = {
        "": "0.5rem 0.25rem",
        "-sm": "0.25rem 0.125rem",
        "-lg": "1rem 0.5rem",
      };

      // Generate utilities for each size
      Object.keys(sizes).forEach((sizeKey) => {
        const boxShadowSize = sizes[sizeKey];

        // Add default white glow for each size
        innerGlowUtilities[`.inner-glow${sizeKey}`] = {
          "box-shadow": `inset 0 0 ${boxShadowSize} rgba(255, 255, 255, 0.5)`,
        };

        // Generate utilities for each color
        Object.keys(colors).forEach((colorName) => {
          if (typeof colors[colorName] === "string") {
            innerGlowUtilities[`.inner-glow${sizeKey}-${e(colorName)}`] = {
              "box-shadow": `inset 0 0 ${boxShadowSize} ${colors[colorName]}`,
            };
          } else {
            Object.keys(colors[colorName]).forEach((shade) => {
              innerGlowUtilities[
                `.inner-glow${sizeKey}-${e(colorName)}-${shade}`
              ] = {
                "box-shadow": `inset 0 0 ${boxShadowSize} ${colors[colorName][shade]}`,
              };
            });
          }
        });
      });

      addUtilities(innerGlowUtilities, ["responsive", "hover"]);
    }),
  ],
};
