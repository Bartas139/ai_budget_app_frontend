<script setup>
const props = defineProps({ categories: Array });
const emit = defineEmits(['change']);

const selected = ref(new Set());
const scrollEl = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const isSelected = (id) => selected.value.has(id);
const allActive = computed(() => selected.value.size === 0);

const toggle = (id) => {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
  emit('change', [...next]);
};

const clearAll = () => {
  selected.value = new Set();
  emit('change', []);
};

const scroll = (dir) => {
  scrollEl.value?.scrollBy({ left: dir * 200, behavior: 'smooth' });
};

const updateArrows = () => {
  const el = scrollEl.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 2;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
};

onMounted(() => nextTick(updateArrows));
</script>

<template>
  <div class="bg-white rounded-2xl border border-line px-4 py-3">
    <div class="relative">
      <!-- Left fade + arrow -->
      <Transition name="fade">
        <div
          v-if="canScrollLeft"
          class="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10 flex items-center pointer-events-none"
        >
          <button
            @click="scroll(-1)"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-line text-ink-secondary hover:text-ink shadow-subtle transition-all pointer-events-auto flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </Transition>

      <!-- Scroll container -->
      <div
        ref="scrollEl"
        class="flex gap-2 overflow-x-auto py-0.5"
        style="scrollbar-width: none; -ms-overflow-style: none;"
        @scroll="updateArrows"
      >
        <!-- All tag -->
        <button
          @click="clearAll"
          :class="[
            allActive
              ? 'bg-ink text-white border-ink'
              : 'bg-surface border-line text-ink-secondary hover:border-ink-muted hover:text-ink',
            'flex-shrink-0 flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-lg transition-all',
          ]"
        >
          Vše
        </button>

        <!-- Category tags -->
        <button
          v-for="cat in categories"
          :key="cat._id"
          @click="toggle(cat._id)"
          :class="[
            isSelected(cat._id)
              ? 'bg-ink text-white border-ink'
              : 'bg-surface border-line text-ink-secondary hover:border-ink-muted hover:text-ink',
            'flex-shrink-0 flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-lg transition-all',
          ]"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- Right fade + arrow -->
      <Transition name="fade">
        <div
          v-if="canScrollRight"
          class="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end pointer-events-none"
        >
          <button
            @click="scroll(1)"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-line text-ink-secondary hover:text-ink shadow-subtle transition-all pointer-events-auto flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  display: none;
}
</style>
