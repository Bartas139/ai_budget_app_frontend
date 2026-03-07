<script setup>
defineProps({
  label: String,
  value: String,
  icon: String,
  variant: String,
  sub: String,
});

const variantMap = {
  sage:     { dot: "bg-sage-400",     bg: "bg-sage-50" },
  rose:     { dot: "bg-rose-400",     bg: "bg-rose-50" },
  sky:      { dot: "bg-sky-400",      bg: "bg-sky-50" },
  gold:     { dot: "bg-gold-400",     bg: "bg-gold-50" },
  lavender: { dot: "bg-lavender-400", bg: "bg-lavender-50" },
};
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-subtle border border-line hover:shadow-card transition-all duration-300">
    <div class="flex items-center justify-between mb-5">
      <div :class="[variantMap[variant].bg, 'w-10 h-10 rounded-xl flex items-center justify-center text-xl']">
        {{ icon }}
      </div>
      <span :class="[variantMap[variant].dot, 'w-2 h-2 rounded-full']" />
    </div>
    <p class="text-sm text-ink-secondary font-medium mb-1">{{ label }}</p>
    <p class="text-2xl font-semibold text-ink tracking-tight">{{ value }}</p>
    <p v-if="sub" class="text-xs text-ink-muted mt-1">{{ sub }}</p>
  </div>
</template>
