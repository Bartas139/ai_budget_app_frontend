<script setup>
defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  large: Boolean,
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label v-if="label" class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :class="[
        large ? 'text-2xl font-semibold' : 'text-sm',
        'w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-ink placeholder-ink-muted focus:outline-none focus:border-rose-200 focus:bg-white transition-all',
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
