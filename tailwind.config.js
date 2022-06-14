module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    screens: {
      xs: "640px",
      sm: "768px",
      md: "1024px",
      lg: "1152px",
    },
    extend: {
      colors: {
        background: "#0B0B0B",
        black: "#000000",
        green: "#4ECE3D",
        red: "#CA3737",
        white: "#E9E9E9",
        offWhite: "#C4C4C4",
        yellow: "#FACA00",
        gray: {
          300: "#9A9A9A",
          400: "#888293",
          500: "#29262F",
          600: "#0C0C0C",
          900: "#060706",
        },
      },
      width: {
        // @todo make sizes consistent
        // @todo remove button specific naming
        128: "32rem", // 512 px
        112: "28rem", // 448 px
        104: "26rem", // 416 px
        27.5: "6.875rem", // 110 px
        "button-default": "12.75rem",
        "button-full": "100%",
      },
      height: {
        "button-small": "1.25rem",
        "button-medium": "2.625rem",
        "button-large": "2.65rem",
      },
      lineHeight: {
        medium: "1.625rem",
      },
      maxWidth: {
        128: "32rem", // 512 px
        104: "26rem", // 416 px
      },
      minWidth: {
        128: "32rem", // 512 px
        104: "26rem", // 416 px
      },
      fontFamily: {
        sans: ["Roboto Mono"],
      },
      fontSize: {
        "3xs": "0.5rem", // 8px
        "2xs": "0.625rem", // 10px
        sm: "0.8125rem", // 13px
        md: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.25rem", // 20px
      },
      backgroundSize: {
        icon: "1.5rem",
      },
    },
  },
  variants: {
    extend: {
      scale: ["active"],
    },
  },
  plugins: [],
};
