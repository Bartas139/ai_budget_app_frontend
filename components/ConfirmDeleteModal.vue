<script setup lang="ts">
defineProps<{ description: string }>();
const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink/10 backdrop-blur-sm" @click="emit('cancel')" />
      <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-sm p-6 animate-slide-up">
        <div class="w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="font-display text-lg text-ink mb-1">Smazat transakci?</h3>
        <p class="text-sm text-ink-secondary mb-6">
          <span class="font-medium text-ink">„{{ description }}"</span> bude trvale odstraněna. Tuto akci nelze vzít zpět.
        </p>
        <div class="flex gap-3">
          <button
            @click="emit('cancel')"
            class="flex-1 bg-surface border border-line text-ink-secondary font-medium py-2.5 rounded-xl text-sm hover:bg-line transition-colors"
          >
            Zrušit
          </button>
          <button
            @click="emit('confirm')"
            class="flex-1 bg-rose-500 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-rose-600 transition-colors shadow-rose-glow"
          >
            Smazat
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
