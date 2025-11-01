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

  // Calculate expenses by category
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0 || categories.length === 0) {
      return null;
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
    const backgroundColor: string[] = [];

    // Color palette for the pie chart
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
      "#4BC0C0",
      "#FF6384",
    ];

    let colorIndex = 0;
    categoryTotals.forEach((total, categoryId) => {
      if (categoryId === 0) {
        labels.push("Uncategorized");
      } else {
        const category = categories.find((c) => c.id === categoryId);
        labels.push(category ? category.name : `Category ${categoryId}`);
      }
      data.push(total);
      backgroundColor.push(colors[colorIndex % colors.length]);
      colorIndex++;
    });

    return {
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data,
          backgroundColor,
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  }, [expenses, categories]);

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <p className="mb-0">
          No expenses to display. Add some expenses to see the chart!
        </p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="alert alert-warning text-center">
        <p className="mb-0">Unable to generate chart data.</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Expenses by Category</h5>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ExpensesChart;
