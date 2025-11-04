import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { Budget } from "../../types/budget";
import { useEffect, useMemo, useState } from "react";
import { getCategories, Category } from "../../api/categoriesFetch";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  budgets: Budget[];
};

const BudgetPieChart = ({ budgets }: Props) => {
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
    const goalData = budgets.map((b) => b.goal_amount);

    // Generate vibrant colors for each category
    const backgroundColors = [
      "rgba(224, 82, 25, 0.8)", // Burnt Orange
      "rgba(97, 176, 68, 0.8)", // Vibrant Green
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(168, 85, 247, 0.8)", // Purple

      "rgba(14, 165, 233, 0.8)", // Sky Blue
      "rgba(234, 179, 8, 0.8)", // Yellow
    ];

    const borderColors = [
      "rgba(224, 82, 25, 1)",
      "rgba(97, 176, 68, 1)",
      "rgba(59, 130, 246, 1)",
      "rgba(168, 85, 247, 1)",
      "rgba(236, 72, 153, 1)",
      "rgba(251, 146, 60, 1)",
      "rgba(14, 165, 233, 1)",
      "rgba(234, 179, 8, 1)",
    ];

    const data = {
      labels,
      datasets: [
        {
          label: "Budget Allocation",
          data: goalData,
          backgroundColor: backgroundColors.slice(0, budgets.length),
          borderColor: borderColors.slice(0, budgets.length),
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            color: "#495057",
            padding: 12,
          },
        },
        title: {
          display: true,
          text: "Budget Distribution",
          color: "#212529",
          font: { weight: 600, size: 16 },
        },
        tooltip: {
          backgroundColor: "rgba(33,37,41,0.9)",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.parsed ?? 0;
              const total = context.dataset.data.reduce(
                (sum: number, val: number) => sum + val,
                0
              );
              const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: $${value.toFixed(2)} (${percentage}%)`;
            },
          },
        },
      },
    };

    const chartKey = `pie-${budgets
      .map((b) => `${b.id}:${b.goal_amount}`)
      .join("|")}-${categories.length}`;

    return { data, options, chartKey };
  }, [budgets, categories]);

  if (!budgets || budgets.length === 0) {
    return (
      <div>
        <div>
          <p>No budgets to display</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "350px",
          height: "350px",
          minHeight: "350px",
          minWidth: "350px",
        }}
      >
        <Pie key={chartKey} data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetPieChart;
