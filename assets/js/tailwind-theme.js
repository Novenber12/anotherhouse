// Tailwind CDN config — Another House theme
// Must be loaded BEFORE `https://cdn.tailwindcss.com`
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#1E1E1E",
        cream: "#F5F1E6",
        olive: "#636B2F",
        gold: "#D4A373",
        snow: "#F5F5F5"
      },
      fontFamily: {
        display: ["Playfair Display", "ui-serif", "Georgia", "serif"],
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(30,30,30,0.08)"
      }
    }
  }
};

