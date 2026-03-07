export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: "vercel-static", // klíčové pro SPA na Vercelu
  },
  modules: ["@nuxtjs/tailwindcss"],

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        "https://ai-budget-app-theta.vercel.app",
    },
  },

  app: {
    head: {
      title: "Atlantis Budget",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap",
        },
      ],
    },
  },
});
