<script setup>
defineProps({ transactions: Array, recent: Array });
const emit = defineEmits(['delete']);
</script>

<template>
  <div class="bg-white rounded-2xl shadow-subtle border border-line overflow-hidden animate-fade-up" style="animation-delay: 0.2s; opacity: 0">
    <div class="px-6 py-5 border-b border-line flex items-center justify-between">
      <h2 class="font-display text-lg text-ink">Poslední transakce</h2>
      <span class="text-xs text-ink-muted bg-surface px-2.5 py-1 rounded-lg">
        {{ recent.length }} z {{ transactions.length }}
      </span>
    </div>

    <div v-if="recent.length === 0" class="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div class="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <p class="font-medium text-ink text-sm mb-1">Zatím žádné transakce</p>
      <p class="text-xs text-ink-muted">Přidej první kliknutím na tlačítko výše</p>
    </div>

    <div v-else class="divide-y divide-line/50 px-2 py-2 max-h-[480px] overflow-y-auto">
      <TransactionItem
        v-for="tx in recent"
        :key="tx._id"
        :transaction="tx"
        @delete="(id) => emit('delete', id, tx.description)"
      />
    </div>
  </div>
</template>
