import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Budget } from "../../types/budget";
import { useEffect, useMemo, useState } from "react";
import { getCategories, Category } from "../../api/categoriesFetch";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  budgets: Budget[];
};

const BudgetCharts = ({ budgets }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const cats = await getCategories();
      setCategories(cats || []);
    };
    load();
  }, []);

  const getCategoryName = (id?: number | null) => {
    if (!id) return "Unknown";
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : `ID ${id}`;
  };

  const { data, options, chartKey } = useMemo(() => {
    const labels = budgets.map((b) => getCategoryName(b.category_id));
    const spentData = budgets.map((b) => b.goal_amount - b.remaining_amount);
    const remainingData = budgets.map((b) => b.remaining_amount);

    const data = {
      labels,
      datasets: [
        {
          label: "Spent",
          data: spentData,
          backgroundColor: "rgba(224, 82, 25, 0.8)",
          hoverBackgroundColor: "rgba(224, 82, 25, 1)",
          borderWidth: 0, // 🚫 remove borders
          borderColor: "transparent", // 🚫 ensure no stroke drawn
          borderRadius: 8,
          barThickness: 40,
        },
        {
          label: "Remaining",
          data: remainingData,
          backgroundColor: "rgba(97, 176, 68, 0.8)",
          hoverBackgroundColor: "rgba(97, 176, 68, 1)",
          borderWidth: 0,
          borderColor: "transparent",
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 16 },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      animation: {
        duration: 250,
        easing: "easeOutCubic",
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            color: "#000000",
            font: { size: 14, weight: 500 },
            padding: 15,
          },
        },
        title: {
          display: true,
          text: "Budget Overview by Category",
          color: "#000000",
          font: { weight: 600 as const, size: 18 },
          padding: { top: 10, bottom: 20 },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          padding: 12,
          titleColor: "#000000",
          bodyColor: "#111111",
          titleFont: { size: 14, weight: 600 as const },
          bodyFont: { size: 13 },
          displayColors: true,
          callbacks: {
            afterTitle: function (context: any) {
              const budgetIndex = context[0].dataIndex;
              const budget = budgets[budgetIndex];
              return `Goal: $${budget.goal_amount.toFixed(2)}`;
            },
            label: function (context: any) {
              const label = context.dataset.label || "";
              const value = context.parsed.y ?? context.parsed;
              return `${label}: $${Number(value).toFixed(2)}`;
            },
          },
        },
      },
      onHover: (event: any, elements: any[]) => {
        const target = event?.native?.target as HTMLElement | undefined;
        if (target)
          target.style.cursor =
            elements && elements.length ? "pointer" : "default";
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#000000", font: { size: 12 } },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#000000",
            font: { size: 12 },
            callback: (value: any) => "$" + value,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
      },
      elements: {
        bar: {
          borderWidth: 0,
          borderSkipped: false,
          hoverBorderWidth: 0, // 🚫 disables hover outline
          hoverBorderColor: "transparent",
          inflateAmount: 0, // 🚫 disables bar “expansion”
        },
      },
    };

    const chartKey = `${budgets
      .map((b) => `${b.id}:${b.goal_amount}:${b.remaining_amount}`)
      .join("|")}-${categories.length}`;

    return { data, options, chartKey };
  }, [budgets, categories]);

  return (
    <div>
      <div style={{ height: "400px" }}>
        <Bar key={chartKey} data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetCharts;
