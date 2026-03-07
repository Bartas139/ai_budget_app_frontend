<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{ transactions: any[] }>();

const chartData = computed(() => {
  const byCategory: Record<string, number> = {};
  props.transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      const name =
        typeof t.categoryId === "object"
          ? t.categoryId?.name ?? "Ostatní"
          : "Ostatní";
      byCategory[name] = (byCategory[name] || 0) + Math.abs(t.amount);
    });

  const labels = Object.keys(byCategory);
  const data = Object.values(byCategory);
  const palette = ["#E87A8D","#7AB87F","#7AA0E0","#E8A84A","#9B7DD8","#F5BAC3","#B8D9BC","#B8CCF0","#F5D099","#C9B5F0"];

  return {
    labels,
    datasets: [{ data, backgroundColor: palette.slice(0, labels.length), borderWidth: 0, hoverOffset: 6 }],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        font: { family: "DM Sans", size: 12 },
        color: "#6B6B80",
        padding: 12,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      callbacks: { label: (ctx: any) => ` ${ctx.parsed.toLocaleString("cs-CZ")} Kč` },
    },
  },
  cutout: "68%",
};
</script>

<template>
  <div class="h-52">
    <Doughnut v-if="chartData.labels.length > 0" :data="chartData" :options="options" />
    <div v-else class="h-full flex flex-col items-center justify-center text-ink-muted gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
      </svg>
      <p class="text-xs">Zatím žádné výdaje</p>
    </div>
  </div>
</template>
