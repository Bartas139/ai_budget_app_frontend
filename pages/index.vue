<script setup>
definePageMeta({ middleware: "auth" });

const { userId } = useAuth();

const api = useApi();

const transactions = ref([]);
const categories = ref([]);
const loading = ref(true);
const showModal = ref(false);
const deleteTarget = ref({ id: "", description: "" });

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

// Stats
const totalBalance = computed(() =>
  transactions.value.reduce((s, t) => s + t.amount, 0),
);
const totalIncome = computed(() =>
  transactions.value
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0),
);
const totalExpenses = computed(() =>
  transactions.value
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0),
);
const fmt = (n) => n.toLocaleString("cs-CZ") + " Kč";

const recent = computed(() =>
  [...transactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12),
);

// Delete flow
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

const monthName = computed(() => {
  const months = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ];
  return months[new Date().getMonth()];
});
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <!-- Top nav -->
    <nav
      class="border-b border-line bg-white/80 backdrop-blur-sm sticky top-0 z-20"
    >
      <div
        class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-7 h-7 bg-rose-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-sm">💳</span>
          </div>
          <span class="font-display text-ink text-lg">Atlantis Budget</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-ink-muted hidden sm:block"
            >{{ monthName }} {{ new Date().getFullYear() }}</span
          >
          <button
            @click="showModal = true"
            class="flex items-center gap-2 bg-ink text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-ink/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Přidat</span>
          </button>
        </div>
        <UserButton />
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-40">
        <div class="text-center">
          <div
            class="w-10 h-10 rounded-full border-2 border-rose-200 border-t-rose-400 animate-spin mx-auto mb-4"
          />
          <p class="text-sm text-ink-muted">Načítám data...</p>
        </div>
      </div>

      <template v-else>
        <!-- Page title -->
        <div class="mb-8 animate-fade-up">
          <h1 class="font-display text-3xl text-ink mb-1">Přehled financí</h1>
          <p class="text-sm text-ink-secondary">
            {{ transactions.length }} transakcí celkem
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            class="animate-fade-up"
            style="animation-delay: 0.05s; opacity: 0"
          >
            <StatCard
              label="Celkový zůstatek"
              :value="fmt(totalBalance)"
              icon="◈"
              variant="sky"
              :sub="totalBalance >= 0 ? 'Kladné saldo' : 'Záporné saldo'"
            />
          </div>
          <div
            class="animate-fade-up"
            style="animation-delay: 0.1s; opacity: 0"
          >
            <StatCard
              label="Příjmy"
              :value="fmt(totalIncome)"
              icon="↑"
              variant="sage"
              sub="Celkem přijato"
            />
          </div>
          <div
            class="animate-fade-up"
            style="animation-delay: 0.15s; opacity: 0"
          >
            <StatCard
              label="Výdaje"
              :value="fmt(totalExpenses)"
              icon="↓"
              variant="rose"
              sub="Celkem utraceno"
            />
          </div>
        </div>

        <!-- Content grid -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Transactions -->
          <div
            class="lg:col-span-3 animate-fade-up"
            style="animation-delay: 0.2s; opacity: 0"
          >
            <div
              class="bg-white rounded-2xl shadow-subtle border border-line overflow-hidden"
            >
              <div
                class="px-6 py-5 border-b border-line flex items-center justify-between"
              >
                <h2 class="font-display text-lg text-ink">
                  Poslední transakce
                </h2>
                <span
                  class="text-xs text-ink-muted bg-surface px-2.5 py-1 rounded-lg"
                >
                  {{ recent.length }} z {{ transactions.length }}
                </span>
              </div>

              <div
                v-if="recent.length === 0"
                class="flex flex-col items-center justify-center py-16 px-6 text-center"
              >
                <div
                  class="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center mb-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-ink-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p class="font-medium text-ink text-sm mb-1">
                  Zatím žádné transakce
                </p>
                <p class="text-xs text-ink-muted">
                  Přidej první kliknutím na tlačítko výše
                </p>
              </div>

              <div
                v-else
                class="divide-y divide-line/50 px-2 py-2 max-h-[480px] overflow-y-auto"
              >
                <TransactionItem
                  v-for="tx in recent"
                  :key="tx._id"
                  :transaction="tx"
                  @delete="(id) => requestDelete(id, tx.description)"
                />
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Chart -->
            <div
              class="bg-white rounded-2xl shadow-subtle border border-line p-6 animate-fade-up"
              style="animation-delay: 0.25s; opacity: 0"
            >
              <h2 class="font-display text-lg text-ink mb-5">
                Výdaje dle kategorií
              </h2>
              <SpendingChart :transactions="transactions" />
            </div>

            <!-- Categories -->
            <div
              class="bg-white rounded-2xl shadow-subtle border border-line p-6 animate-fade-up"
              style="animation-delay: 0.3s; opacity: 0"
            >
              <h2 class="font-display text-lg text-ink mb-4">Kategorie</h2>
              <div
                v-if="categories.length === 0"
                class="text-xs text-ink-muted text-center py-4"
              >
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
          </div>
        </div>
      </template>
    </main>
  </div>

  <!-- Modals -->
  <AddTransactionModal
    v-if="showModal"
    @close="showModal = false"
    @saved="fetchData"
  />
  <ConfirmDeleteModal
    v-if="deleteTarget !== null"
    :description="deleteTarget.description"
    @confirm="confirmDelete"
    @cancel="deleteTarget = null"
  />
</template>
