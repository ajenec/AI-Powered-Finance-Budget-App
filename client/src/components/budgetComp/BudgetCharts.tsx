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

  // Memoize chart data so it recalculates when budgets or categories change
  const { data, options, chartKey } = useMemo(() => {
    const labels = budgets.map((b) => getCategoryName(b.category_id));
    const spentData = budgets.map((b) => b.goal_amount - b.remaining_amount);
    const remainingData = budgets.map((b) => b.remaining_amount);
    const goalData = budgets.map((b) => b.goal_amount);

    console.log("[BudgetCharts] Chart data:", {
      labels,
      spent: spentData,
      remaining: remainingData,
      goals: goalData,
    });

    const data = {
      labels,
      datasets: [
        {
          label: "Spent",
          data: spentData,
          backgroundColor: "rgba(224, 82, 25, 0.7)", // Burnt Orange
          stack: "stack0",
        },
        {
          label: "Remaining",
          data: remainingData,
          backgroundColor: "rgba(97, 176, 68, 0.7)", // Vibrant Green
          stack: "stack0",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom" as const,
        },
        title: {
          display: true,
          text: "Budget Overview by Category",
        },
        tooltip: {
          callbacks: {
            afterTitle: function (context: any) {
              const budgetIndex = context[0].dataIndex;
              const budget = budgets[budgetIndex];
              return `Goal: $${budget.goal_amount.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: 500,
            callback: function (value: any) {
              return "$" + value;
            },
          },
        },
      },
    };

    // Changing key forces Bar to remount when underlying series actually change
    const chartKey = `${budgets
      .map((b) => `${b.id}:${b.goal_amount}:${b.remaining_amount}`)
      .join("|")}-${categories.length}`;

    return { data, options, chartKey };
  }, [budgets, categories]);

  return (
    <div className="card shadow-sm border-0 p-3 mb-4">
      <div
        style={{
          position: "relative",
          height: "300px", // fixed height
          width: "100%",
          maxWidth: "600px", // optional for narrower chart
          margin: "0 auto",
        }}
      >
        <Bar key={chartKey} data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetCharts;
