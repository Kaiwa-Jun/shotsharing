module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        "1/3": "33.333333%",
      },
      colors: {
        twitter: "#1da1f2",
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: (theme) => ({
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-linear": "linear-gradient(150deg, #1d9cf2c9, #cf3ff84a)",
      }),
    },
  },
  plugins: [require("daisyui")],
};
