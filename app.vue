<template>
  <div class="min-h-screen bg-canvas font-sans text-ink">
    <ClerkProvider afterSignOutUrl="/sign-in">
      <NuxtPage />
    </ClerkProvider>
  </div>
</template>
