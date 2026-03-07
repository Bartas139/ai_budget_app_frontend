<script setup>
import dayjs from "dayjs";

const props = defineProps({ transaction: Object });

const emit = defineEmits(['delete']);

const isIncome = computed(() => props.transaction.amount > 0);

const formattedAmount = computed(() => {
  const abs = Math.abs(props.transaction.amount);
  return `${isIncome.value ? "+" : "−"}${abs.toLocaleString("cs-CZ")} Kč`;
});

const formattedDate = computed(() =>
  dayjs(props.transaction.date).format("D. M. YYYY")
);

const categoryName = computed(() => {
  if (!props.transaction.categoryId) return "Nezařazeno";
  if (typeof props.transaction.categoryId === "object")
    return props.transaction.categoryId.name;
  return props.transaction.categoryId;
});

const categoryIcon = computed(() => {
  if (typeof props.transaction.categoryId === "object")
    return props.transaction.categoryId.icon ?? "📦";
  return "📦";
});
</script>

<template>
  <div class="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-surface transition-all duration-150 group">
    <!-- Icon -->
    <div :class="[isIncome ? 'bg-sage-100 text-sage-600' : 'bg-rose-100 text-rose-500', 'w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0']">
      {{ categoryIcon }}
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="font-medium text-ink text-sm truncate">{{ transaction.description }}</p>
        <span v-if="transaction.aiCategorized"
          class="text-[10px] font-semibold bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded-md flex-shrink-0">
          AI
        </span>
      </div>
      <div class="flex items-center gap-1.5 mt-0.5">
        <span class="text-xs text-ink-muted">{{ categoryName }}</span>
        <span class="text-ink-muted text-xs">·</span>
        <span class="text-xs text-ink-muted">{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Amount + delete -->
    <div class="flex items-center gap-3 flex-shrink-0">
      <p :class="[isIncome ? 'text-sage-600' : 'text-rose-500', 'font-semibold text-sm tabular-nums']">
        {{ formattedAmount }}
      </p>
      <button
        @click="emit('delete', transaction._id)"
        class="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted opacity-0 group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-500 transition-all"
        title="Smazat transakci"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  </div>
</template>
