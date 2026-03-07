<script setup>
defineProps({ categories: Array });
</script>

<template>
  <div class="bg-white rounded-2xl shadow-subtle border border-line p-6 animate-fade-up" style="animation-delay: 0.3s; opacity: 0">
    <h2 class="font-display text-lg text-ink mb-4">Kategorie</h2>
    <div v-if="categories.length === 0" class="text-xs text-ink-muted text-center py-4">
      Žádné kategorie
    </div>
    <div v-else class="flex flex-wrap gap-2">
      <span
        v-for="cat in categories"
        :key="cat._id"
        class="flex items-center gap-1.5 text-xs font-medium text-ink-secondary bg-surface border border-line px-3 py-1.5 rounded-lg"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.name }}</span>
      </span>
    </div>
  </div>
</template>
