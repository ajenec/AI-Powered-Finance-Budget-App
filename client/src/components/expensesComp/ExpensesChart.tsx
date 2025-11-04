import React, { useEffect, useState, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import type { Expense } from "../../types/expense";
import { getCategories, Category } from "../../api/categoriesFetch";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  expenses: Expense[];
};

const ExpensesChart: React.FC<Props> = ({ expenses }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getCategoryName = (id?: number | null) => {
    if (!id) return "Unknown";
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : `ID ${id}`;
  };

  // Calculate expenses by category
  const { chartData, options, chartKey } = useMemo(() => {
    if (!expenses || expenses.length === 0 || categories.length === 0) {
      return { chartData: null, options: {}, chartKey: "empty" };
    }

    // Group expenses by category
    const categoryTotals = new Map<number, number>();

    expenses.forEach((expense) => {
      const categoryId = expense.category_id || 0; // Use 0 for uncategorized
      const currentTotal = categoryTotals.get(categoryId) || 0;
      categoryTotals.set(categoryId, currentTotal + expense.amount);
    });

    // Prepare data for the chart
    const labels: string[] = [];
    const data: number[] = [];

    // Generate vibrant colors matching BudgetPieChart
    const backgroundColors = [
      "rgba(224, 82, 25, 0.8)", // Burnt Orange
      "rgba(97, 176, 68, 0.8)", // Vibrant Green
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(168, 85, 247, 0.8)", // Purple
      "rgba(236, 72, 153, 0.8)", // Pink
      "rgba(251, 146, 60, 0.8)", // Orange
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

    categoryTotals.forEach((total, categoryId) => {
      labels.push(getCategoryName(categoryId === 0 ? null : categoryId));
      data.push(total);
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: "Expense Distribution",
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 2,
        },
      ],
    };

    const options: ChartOptions<"pie"> = {
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
          text: "Expense Distribution",
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

    const chartKey = `expense-pie-${expenses
      .map((e) => `${e.id}:${e.amount}`)
      .join("|")}-${categories.length}`;

    return { chartData, options, chartKey };
  }, [expenses, categories]);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p>Loading chart...</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div>
        <div>
          <p>No expenses to display</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div>
        <div>
          <p>Unable to generate chart data.</p>
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
        <Pie key={chartKey} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpensesChart;
