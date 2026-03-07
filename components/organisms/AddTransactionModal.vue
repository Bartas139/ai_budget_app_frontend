<script setup>
const emit = defineEmits(['close', 'saved']);
const api = useApi();
const { userId } = useAuth();

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
const confirmMode = ref("ai");

const typeOptions = [
  { value: "expense", label: "Výdaj",  activeClass: "text-rose-500" },
  { value: "income",  label: "Příjem", activeClass: "text-sage-600" },
];

const confirmOptions = [
  { value: "ai",       label: "AI návrh",   activeClass: "text-lavender-600" },
  { value: "existing", label: "Existující", activeClass: "text-sky-600" },
  { value: "new",      label: "Vlastní",    activeClass: "text-ink" },
];

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
      userId: userId.value,
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
      confirmMode.value = "ai";
      if (result.suggestion.type === "existing_category") {
        selectedCategoryId.value = result.suggestion.categoryId;
      }
      step.value = "confirm";
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

    if (confirmMode.value === "ai") {
      if (suggestion.value?.type === "new_category") {
        payload.newCategory = {
          name: suggestion.value.category.name,
          description: suggestion.value.category.description || "",
          icon: suggestion.value.category.icon || "📦",
          color: suggestion.value.category.color || "#ffffff",
        };
      } else {
        payload.categoryId = suggestion.value.categoryId;
      }
    } else if (confirmMode.value === "new") {
      payload.newCategory = {
        name: newCategoryName.value,
        description: "",
        icon: "📦",
        color: "#ffffff",
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

const confirmButtonLabel = computed(() => {
  if (loading.value) return "Ukládám...";
  return confirmMode.value === "ai" ? "Použít AI kategorii" : "Potvrdit a uložit";
});
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink/10 backdrop-blur-sm" @click="emit('close')" />

      <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-md animate-slide-up overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 class="font-display text-xl text-ink">
            {{ step === 'form' ? 'Nová transakce' : 'Zvolit kategorii' }}
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
          <TypeToggle v-model="form.type" :options="typeOptions" />

          <AppInput v-model="form.amount" label="Částka (Kč)" type="number" placeholder="0" :large="true" />
          <AppInput v-model="form.description" label="Popis" placeholder="Např. Oběd v restauraci..." />

          <div class="grid grid-cols-2 gap-3">
            <AppInput v-model="form.date" label="Datum" type="date" />
            <AppInput v-model="form.note" label="Poznámka" placeholder="Volitelně" />
          </div>

          <p v-if="error" class="text-rose-500 text-xs font-medium">{{ error }}</p>

          <AppButton
            :variant="form.type === 'income' ? 'sage' : 'rose'"
            :loading="loading"
            full
            class="py-3 hover:-translate-y-0.5"
            @click="submit"
          >
            {{ loading ? 'AI kategorizuje...' : 'Uložit transakci' }}
          </AppButton>
        </div>

        <!-- STEP 2: Confirm -->
        <div v-else class="p-6 space-y-5">
          <TypeToggle v-model="confirmMode" :options="confirmOptions" />

          <!-- TAB: AI návrh -->
          <div v-if="confirmMode === 'ai'" class="flex flex-col items-center py-4 gap-3">
            <div
              class="flex items-center gap-4 px-6 py-4 rounded-2xl border-2 w-full"
              :style="{
                backgroundColor: (suggestion?.category?.color ?? '#9B7DD8') + '18',
                borderColor: (suggestion?.category?.color ?? '#9B7DD8') + '55',
              }"
            >
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                :style="{ backgroundColor: (suggestion?.category?.color ?? '#9B7DD8') + '30' }"
              >
                {{ suggestion?.category?.icon ?? '📦' }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <p class="font-semibold text-ink text-base">{{ suggestion?.category?.name ?? 'Nová kategorie' }}</p>
                  <span class="text-[10px] font-semibold bg-lavender-100 text-lavender-600 px-1.5 py-0.5 rounded-md flex-shrink-0">AI</span>
                </div>
                <p class="text-xs text-ink-secondary">{{ suggestion?.category?.description }}</p>
              </div>
            </div>
          </div>

          <!-- TAB: Existující -->
          <div v-else-if="confirmMode === 'existing'">
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

          <!-- TAB: Vlastní -->
          <AppInput
            v-else
            v-model="newCategoryName"
            label="Název nové kategorie"
            placeholder="Např. Elektronika, Sport..."
          />

          <p v-if="error" class="text-rose-500 text-xs font-medium">{{ error }}</p>

          <div class="flex gap-3">
            <AppButton variant="ghost" class="px-5 py-2.5" @click="step = 'form'">Zpět</AppButton>
            <AppButton variant="lavender" :loading="loading" full class="py-2.5" @click="confirm">
              {{ confirmButtonLabel }}
            </AppButton>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>
