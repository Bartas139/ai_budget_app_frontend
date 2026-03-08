<script setup>
defineProps({ monthName: String });
const emit = defineEmits(["add"]);
</script>

<template>
  <nav
    class="border-b border-line bg-white/80 backdrop-blur-sm sticky top-0 z-20"
  >
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div
          class="w-7 h-7 bg-rose-100 rounded-lg flex items-center justify-center"
        >
          <span class="text-sm">💳</span>
        </div>
        <span class="font-display text-ink text-lg">Atlantis Budget</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-ink-muted hidden sm:block"
          >{{ monthName }} {{ new Date().getFullYear() }}</span
        >
        <button
          @click="emit('add')"
          class="flex items-center gap-2 bg-ink text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-ink/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Přidat</span>
        </button>
        <UserButton />
      </div>
    </div>
  </nav>
</template>
