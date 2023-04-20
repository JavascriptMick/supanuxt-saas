export default {
  plugins:[require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["acid", "night"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "night",
  },  
}
