export default defineNuxtConfig({
  ssr: false,

  components: [{ path: "~/components", pathPrefix: false }],

  modules: ["@nuxtjs/tailwindcss", "@clerk/nuxt"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  clerk: {
    afterSignOutUrl: "/sign-in",
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    signInFallbackRedirectUrl: "/",
    signUpFallbackRedirectUrl: "/",
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
