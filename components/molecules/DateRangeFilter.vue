<script setup>
import dayjs from 'dayjs';

const emit = defineEmits(['change']);

const mode = ref('month');
const monthCursor = ref(dayjs().startOf('month'));
const customFrom = ref(dayjs().startOf('month').format('YYYY-MM-DD'));
const customTo = ref(dayjs().format('YYYY-MM-DD'));

const monthNames = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
const monthLabel = computed(() => `${monthNames[monthCursor.value.month()]} ${monthCursor.value.year()}`);
const isFutureMonth = computed(() => monthCursor.value.isAfter(dayjs().startOf('month')));

const prevMonth = () => {
  mode.value = 'month';
  monthCursor.value = monthCursor.value.subtract(1, 'month');
};

const nextMonth = () => {
  if (isFutureMonth.value) return;
  mode.value = 'month';
  monthCursor.value = monthCursor.value.add(1, 'month');
};

const presets = [
  { value: 'quarter', label: 'Čtvrtletí' },
  { value: 'all',     label: 'Vše' },
  { value: 'custom',  label: 'Vlastní' },
];

const range = computed(() => {
  if (mode.value === 'month') {
    return {
      from: monthCursor.value.toDate(),
      to: monthCursor.value.endOf('month').toDate(),
    };
  }
  if (mode.value === 'quarter') {
    return {
      from: dayjs().subtract(3, 'month').startOf('day').toDate(),
      to: dayjs().endOf('day').toDate(),
    };
  }
  if (mode.value === 'all') {
    return { from: null, to: null };
  }
  if (mode.value === 'custom' && customFrom.value && customTo.value) {
    return {
      from: dayjs(customFrom.value).startOf('day').toDate(),
      to: dayjs(customTo.value).endOf('day').toDate(),
    };
  }
  return { from: null, to: null };
});

watch(range, (r) => emit('change', r), { immediate: true });
</script>

<template>
  <div class="bg-white rounded-2xl border border-line p-4">
    <div class="flex flex-wrap items-center gap-2">

      <!-- Month navigator -->
      <div :class="['flex items-center rounded-xl border transition-colors', mode === 'month' ? 'border-ink/20 bg-ink/5' : 'border-line']">
        <button
          @click="prevMonth"
          class="w-8 h-8 flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface rounded-l-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>

        <button
          @click="mode = 'month'"
          :class="['px-3 py-1.5 text-sm min-w-[136px] text-center transition-colors', mode === 'month' ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink']"
        >
          {{ monthLabel }}
        </button>

        <button
          @click="nextMonth"
          :disabled="isFutureMonth"
          class="w-8 h-8 flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface rounded-r-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-line hidden sm:block" />

      <!-- Preset pills -->
      <button
        v-for="preset in presets"
        :key="preset.value"
        @click="mode = preset.value"
        :class="[
          mode === preset.value
            ? 'bg-ink text-white'
            : 'bg-surface text-ink-secondary hover:bg-line',
          'px-4 py-2 rounded-xl text-sm font-medium transition-all',
        ]"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Custom range inputs -->
    <div v-if="mode === 'custom'" class="mt-4 grid grid-cols-2 gap-3">
      <AppInput v-model="customFrom" label="Od" type="date" />
      <AppInput v-model="customTo" label="Do" type="date" />
    </div>
  </div>
</template>
