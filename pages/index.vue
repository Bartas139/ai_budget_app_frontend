<script setup>
definePageMeta({ middleware: "auth" });

const { userId } = useAuth();
const api = useApi();

const transactions = ref([]);
const categories = ref([]);
const loading = ref(true);
const showModal = ref(false);
const deleteTarget = ref(null);
const dateRange = ref({ from: null, to: null });
const selectedCategoryIds = ref([]);

const fetchData = async () => {
  loading.value = true;
  try {
    const [txRes, catRes] = await Promise.allSettled([
      api.getTransactions(userId.value),
      api.getCategories(),
    ]);
    if (txRes.status === "fulfilled") transactions.value = txRes.value || [];
    if (catRes.status === "fulfilled") categories.value = catRes.value || [];
  } catch {}
  loading.value = false;
};

onMounted(fetchData);

const filteredTransactions = computed(() => {
  let result = transactions.value;

  const { from, to } = dateRange.value;
  if (from || to) {
    result = result.filter((t) => {
      const d = new Date(t.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  if (selectedCategoryIds.value.length > 0) {
    result = result.filter((t) => {
      const id = typeof t.categoryId === "object" ? t.categoryId?._id : t.categoryId;
      return selectedCategoryIds.value.includes(id);
    });
  }

  return result;
});

const totalBalance  = computed(() => filteredTransactions.value.reduce((s, t) => s + t.amount, 0));
const totalIncome   = computed(() => filteredTransactions.value.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0));
const totalExpenses = computed(() => filteredTransactions.value.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0));
const fmt = (n) => n.toLocaleString("cs-CZ") + " Kč";

const recent = computed(() =>
  [...filteredTransactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12)
);

const monthName = computed(() => {
  const months = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
  return months[new Date().getMonth()];
});

const requestDelete = (id, description) => {
  deleteTarget.value = { id, description };
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  try {
    await api.deleteTransaction(deleteTarget.value.id);
    await fetchData();
  } catch {}
  deleteTarget.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <AppNav :monthName="monthName" @add="showModal = true" />

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-40">
        <div class="text-center">
          <div class="w-10 h-10 rounded-full border-2 border-rose-200 border-t-rose-400 animate-spin mx-auto mb-4" />
          <p class="text-sm text-ink-muted">Načítám data...</p>
        </div>
      </div>

      <template v-else>
        <!-- Page title -->
        <div class="mb-4 animate-fade-up">
          <h1 class="font-display text-3xl text-ink mb-1">Přehled financí</h1>
          <p class="text-sm text-ink-secondary">{{ filteredTransactions.length }} transakcí v daném období</p>
        </div>

        <!-- Filters -->
        <div class="space-y-2 mb-8 animate-fade-up" style="animation-delay: 0.03s; opacity: 0">
          <DateRangeFilter @change="dateRange = $event" />
          <CategoryFilter :categories="categories" @change="selectedCategoryIds = $event" />
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="animate-fade-up" style="animation-delay: 0.05s; opacity: 0">
            <StatCard label="Celkový zůstatek" :value="fmt(totalBalance)" icon="◈" variant="sky" :sub="totalBalance >= 0 ? 'Kladné saldo' : 'Záporné saldo'" />
          </div>
          <div class="animate-fade-up" style="animation-delay: 0.1s; opacity: 0">
            <StatCard label="Příjmy" :value="fmt(totalIncome)" icon="↑" variant="sage" sub="Celkem přijato" />
          </div>
          <div class="animate-fade-up" style="animation-delay: 0.15s; opacity: 0">
            <StatCard label="Výdaje" :value="fmt(totalExpenses)" icon="↓" variant="rose" sub="Celkem utraceno" />
          </div>
        </div>

        <!-- Content grid -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div class="lg:col-span-3">
            <TransactionList :transactions="filteredTransactions" :recent="recent" @delete="requestDelete" />
          </div>
          <div class="lg:col-span-2">
            <SpendingChart :transactions="filteredTransactions" />
          </div>
        </div>
      </template>
    </main>
  </div>

  <AddTransactionModal v-if="showModal" @close="showModal = false" @saved="fetchData" />
  <ConfirmDeleteModal
    v-if="deleteTarget !== null"
    :description="deleteTarget.description"
    @confirm="confirmDelete"
    @cancel="deleteTarget = null"
  />
</template>
