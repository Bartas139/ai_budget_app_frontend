<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  loading: Boolean,
  full: Boolean,
});

const variants = {
  default:  'bg-ink text-white hover:bg-ink/80',
  rose:     'bg-rose-400 hover:bg-rose-500 shadow-rose-glow text-white',
  'rose-solid': 'bg-rose-500 hover:bg-rose-600 shadow-rose-glow text-white',
  sage:     'bg-sage-400 hover:bg-sage-600 shadow-sage-glow text-white',
  lavender: 'bg-lavender-400 hover:bg-lavender-600 text-white',
  ghost:    'bg-surface border border-line text-ink-secondary hover:bg-line',
};
</script>

<template>
  <button
    :disabled="loading"
    :class="[
      variants[variant],
      full ? 'w-full' : '',
      'font-medium rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed',
    ]"
  >
    <slot />
  </button>
</template>
