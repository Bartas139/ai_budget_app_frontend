<script setup>
defineProps({
  modelValue: String,
  options: Array, // [{ value, label, activeClass }]
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex gap-2 p-1 bg-surface rounded-xl">
    <button
      v-for="opt in options"
      :key="opt.value"
      :class="[
        modelValue === opt.value
          ? `bg-white shadow-subtle ${opt.activeClass} font-semibold`
          : 'text-ink-secondary hover:text-ink',
        'flex-1 py-2 rounded-lg text-sm transition-all',
      ]"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
