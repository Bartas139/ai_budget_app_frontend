<script setup>
const emit = defineEmits(['close', 'saved']);
const api = useApi();

const form = reactive({
  description: "",
  amount: "",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
  note: "",
  currency: "CZK",
});

const step = ref("form");
const loading = ref(false);
const error = ref("");
const pendingData = ref(null);
const suggestion = ref(null);
const categories = ref([]);
const selectedCategoryId = ref("");
const newCategoryName = ref("");
const confirmMode = ref("existing");

onMounted(async () => {
  try {
    categories.value = await api.getCategories();
  } catch {}
});

const submit = async () => {
  if (!form.description || !form.amount) {
    error.value = "Vyplň popis a částku.";
    return;
  }
  error.value = "";
  loading.value = true;
  try {
    const amount =
      form.type === "expense"
        ? -Math.abs(Number(form.amount))
        : Math.abs(Number(form.amount));

    const result = await api.createTransaction({
      userId: "user_demo",
      amount,
      description: form.description,
      date: form.date,
      note: form.note || null,
      currency: form.currency,
    });

    if (result.status === "saved") {
      emit("saved");
      emit("close");
    } else if (result.status === "pending_confirmation") {
      pendingData.value = result.transactionDraft;
      suggestion.value = result.suggestion;
      step.value = "confirm";
      if (result.suggestion.type === "existing_category") {
        selectedCategoryId.value = result.suggestion.categoryId;
      }
    }
  } catch {
    error.value = "Chyba při ukládání. Zkus to znovu.";
  } finally {
    loading.value = false;
  }
};

const confirm = async () => {
  loading.value = true;
  error.value = "";
  try {
    const payload = { transactionDraft: pendingData.value };
    if (confirmMode.value === "new") {
      payload.newCategory = {
        name: newCategoryName.value || suggestion.value?.category?.name,
        description: suggestion.value?.category?.description || "",
        icon: suggestion.value?.category?.icon || "📦",
        color: suggestion.value?.category?.color || "#ffffff",
      };
    } else {
      payload.categoryId = selectedCategoryId.value;
    }
    await api.confirmTransaction(payload);
    emit("saved");
    emit("close");
  } catch {
    error.value = "Chyba při potvrzování.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink/10 backdrop-blur-sm" @click="emit('close')" />

      <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-md animate-slide-up overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 class="font-display text-xl text-ink">
            {{ step === 'form' ? 'Nová transakce' : 'Potvrdit kategorii' }}
          </h2>
          <button
            @click="emit('close')"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- STEP 1: Form -->
        <div v-if="step === 'form'" class="p-6 space-y-5">
          <!-- Type toggle -->
          <div class="flex gap-2 p-1 bg-surface rounded-xl">
            <button
              @click="form.type = 'expense'"
              :class="[form.type === 'expense' ? 'bg-white shadow-subtle text-rose-500 font-semibold' : 'text-ink-secondary hover:text-ink', 'flex-1 py-2 rounded-lg text-sm transition-all']"
            >
              Výdaj
            </button>
            <button
              @click="form.type = 'income'"
              :class="[form.type === 'income' ? 'bg-white shadow-subtle text-sage-600 font-semibold' : 'text-ink-secondary hover:text-ink', 'flex-1 py-2 rounded-lg text-sm transition-all']"
            >
              Příjem
            </button>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Částka (Kč)</label>
            <input
              v-model="form.amount"
              type="number"
              placeholder="0"
              class="w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-2xl font-semibold text-ink placeholder-ink-muted focus:outline-none focus:border-rose-200 focus:bg-white transition-all"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Popis</label>
            <input
              v-model="form.description"
              type="text"
              placeholder="Např. Oběd v restauraci..."
              class="w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-rose-200 focus:bg-white transition-all"
            />
          </div>

          <!-- Date + Note -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Datum</label>
              <input
                v-model="form.date"
                type="date"
                class="w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-rose-200 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Poznámka</label>
              <input
                v-model="form.note"
                type="text"
                placeholder="Volitelně"
                class="w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-rose-200 focus:bg-white transition-all"
              />
            </div>
          </div>

          <p v-if="error" class="text-rose-500 text-xs font-medium">{{ error }}</p>

          <button
            @click="submit"
            :disabled="loading"
            :class="[form.type === 'income' ? 'bg-sage-400 hover:bg-sage-600 shadow-sage-glow' : 'bg-rose-400 hover:bg-rose-500 shadow-rose-glow', 'w-full text-white font-medium py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0']"
          >
            {{ loading ? 'AI kategorizuje...' : 'Uložit transakci' }}
          </button>
        </div>

        <!-- STEP 2: Confirm -->
        <div v-else class="p-6 space-y-5">
          <p class="text-sm text-ink-secondary">AI si není jistá kategorizací. Zvolte způsob zařazení:</p>

          <!-- AI suggestion box -->
          <div v-if="suggestion?.type === 'new_category'" class="bg-lavender-50 border border-lavender-100 rounded-xl p-4">
            <p class="text-xs font-medium text-lavender-600 uppercase tracking-wider mb-2">Návrh AI</p>
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ suggestion.category?.icon ?? '📦' }}</span>
              <div>
                <p class="font-medium text-ink text-sm">{{ suggestion.category?.name }}</p>
                <p class="text-xs text-ink-secondary mt-0.5">{{ suggestion.category?.description }}</p>
              </div>
            </div>
          </div>

          <!-- Mode toggle -->
          <div class="flex gap-2 p-1 bg-surface rounded-xl">
            <button
              @click="confirmMode = 'existing'"
              :class="[confirmMode === 'existing' ? 'bg-white shadow-subtle text-sky-600 font-semibold' : 'text-ink-secondary', 'flex-1 py-2 rounded-lg text-sm transition-all']"
            >
              Existující
            </button>
            <button
              @click="confirmMode = 'new'"
              :class="[confirmMode === 'new' ? 'bg-white shadow-subtle text-lavender-600 font-semibold' : 'text-ink-secondary', 'flex-1 py-2 rounded-lg text-sm transition-all']"
            >
              Nová kategorie
            </button>
          </div>

          <div v-if="confirmMode === 'existing'">
            <label class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Kategorie</label>
            <select
              v-model="selectedCategoryId"
              class="w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-sky-200 focus:bg-white transition-all"
            >
              <option value="" disabled>Vyber kategorii...</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <div v-else>
            <label class="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">Název kategorie</label>
            <input
              v-model="newCategoryName"
              :placeholder="suggestion?.category?.name ?? 'Název kategorie'"
              class="w-full bg-surface border border-transparent rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-lavender-200 focus:bg-white transition-all"
            />
          </div>

          <p v-if="error" class="text-rose-500 text-xs font-medium">{{ error }}</p>

          <div class="flex gap-3">
            <button
              @click="step = 'form'"
              class="px-5 py-2.5 bg-surface border border-line text-ink-secondary text-sm font-medium rounded-xl hover:bg-line transition-colors"
            >
              Zpět
            </button>
            <button
              @click="confirm"
              :disabled="loading"
              class="flex-1 bg-lavender-400 hover:bg-lavender-600 text-white font-medium py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {{ loading ? 'Ukládám...' : 'Potvrdit a uložit' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
