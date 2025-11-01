import React, { useEffect, useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import type { Income } from "../../types/income";
import { getCategoriesByType, type Category } from "../../api/categoriesFetch";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  incomes: Income[];
};

const IncomeChart: React.FC<Props> = ({ incomes }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getCategoriesByType("income");
        setCategories(cats || []);
      } catch (err) {
        console.error("Failed to load income categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    if (!incomes || incomes.length === 0) return null;

    // Group by category_id (0 = Uncategorized)
    const totals = new Map<number, number>();
    incomes.forEach((inc) => {
      const key = inc.category_id ?? 0;
      totals.set(key, (totals.get(key) || 0) + inc.amount);
    });

    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    const palette = [
      "#4BC0C0",
      "#36A2EB",
      "#9966FF",
      "#FFCE56",
      "#2ecc71",
      "#e67e22",
      "#e74c3c",
      "#1abc9c",
      "#9b59b6",
      "#f1c40f",
    ];

    let i = 0;
    totals.forEach((total, catId) => {
      if (catId === 0) {
        labels.push("Uncategorized");
      } else {
        const cat = categories.find((c) => c.id === catId);
        labels.push(cat ? cat.name : `Category ${catId}`);
      }
      data.push(total);
      backgroundColor.push(palette[i % palette.length]);
      i++;
    });

    return {
      labels,
      datasets: [
        {
          label: "Income by Category",
          data,
          backgroundColor,
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  }, [incomes, categories]);

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const value = (ctx.parsed as number) || 0;
            const total = (ctx.dataset.data as number[]).reduce(
              (acc, v) => acc + (v || 0),
              0
            );
            const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${label}: $${value.toFixed(2)} (${pct}%)`;
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

  if (!incomes || incomes.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <p className="mb-0">
          No income to display. Add some income records to see the chart!
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
        <h5 className="card-title text-center mb-4">Income by Category</h5>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default IncomeChart;
