import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function getCategoryTotals(transactions, type) {
  const totals = {};

  transactions
    .filter((item) => item.type === type)
    .forEach((item) => {
      const category = item.category || item.service || "Other";
      totals[category] = (totals[category] || 0) + Number(item.amount);
    });

  return {
    labels: Object.keys(totals),
    values: Object.values(totals),
  };
}

export default function Overview({ transactions = [] }) {
  const [filter, setFilter] = useState("all");

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((item) => item.wallet === filter);

  const income = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const netBalance = income - expenses;

  const incomeCategories = getCategoryTotals(filteredTransactions, "income");
  const expenseCategories = getCategoryTotals(filteredTransactions, "expense");

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={topRow}>
        <h2>This month</h2>

        <div style={filterGroup}>
          <FilterButton label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterButton label="Personal" active={filter === "personal"} onClick={() => setFilter("personal")} />
          <FilterButton label="Business" active={filter === "business"} onClick={() => setFilter("business")} />
        </div>
      </div>

      <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
        <StatCard title="Income" value={`€${income.toFixed(2)}`} green />
        <StatCard title="Expenses" value={`€${expenses.toFixed(2)}`} orange />
        <StatCard
          title="Net balance"
          value={`€${netBalance.toFixed(2)}`}
          green={netBalance >= 0}
          orange={netBalance < 0}
        />
        <StatCard title="Transactions" value={filteredTransactions.length} />
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: "20px" }}>
        <div style={panel}>
          <h3 style={panelTitle}>Income by category</h3>

          {incomeCategories.values.length === 0 ? (
            <p style={{ color: "#aaa" }}>No income yet.</p>
          ) : (
            <div style={chartBox}>
              <Doughnut
                data={{
                  labels: incomeCategories.labels,
                  datasets: [
                    {
                      data: incomeCategories.values,
                      backgroundColor: [
                        "#10b981",
                        "#34d399",
                        "#6ee7b7",
                        "#a7f3d0",
                        "#d1fae5",
                      ],
                      borderColor: "#ffffff",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          )}
        </div>

        <div style={panel}>
          <h3 style={panelTitle}>Expenses by category</h3>

          {expenseCategories.values.length === 0 ? (
            <p style={{ color: "#aaa" }}>No expenses yet.</p>
          ) : (
            <div style={chartBox}>
              <Doughnut
                data={{
                  labels: expenseCategories.labels,
                  datasets: [
                    {
                      data: expenseCategories.values,
                      backgroundColor: [
                        "#f97316",
                        "#fb923c",
                        "#fdba74",
                        "#fed7aa",
                        "#ffedd5",
                      ],
                      borderColor: "#ffffff",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          )}
        </div>
      </div>

      <div style={panel}>
        <h3 style={panelTitle}>
          Showing: {filter === "all" ? "All transactions" : `${filter} transactions`}
        </h3>

        {filteredTransactions.length === 0 ? (
          <p style={{ color: "#aaa" }}>No transactions yet.</p>
        ) : (
          filteredTransactions.map((item) => (
            <div key={item.id} style={transactionRow}>
              <div>
                <strong>{item.description || item.client || item.service || "Transaction"}</strong>
                <p style={{ margin: "6px 0", color: "#aaa" }}>
                  {item.category || item.service || "Other"} · {item.wallet || "business"}
                </p>
              </div>

              <strong
                style={{
                  color: item.type === "income" ? "#10b981" : "#f97316",
                }}
              >
                {item.type === "income" ? "+" : "-"}€
                {Number(item.amount).toFixed(2)}
              </strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...filterBtn,
        background: active ? "white" : "rgba(255,255,255,0.05)",
        color: active ? "#111217" : "white",
      }}
    >
      {label}
    </button>
  );
}

function StatCard({ title, value, green, orange }) {
  return (
    <div style={statCard}>
      <p style={statTitle}>{title}</p>
      <h2
        style={{
          margin: 0,
          color: green ? "#10b981" : orange ? "#f97316" : "white",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

const chartOptions = {
  cutout: "62%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#111217",
      titleColor: "white",
      bodyColor: "white",
      callbacks: {
        label: (context) => {
          return `${context.label}: €${Number(context.raw).toFixed(2)}`;
        },
      },
    },
  },
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
};

const filterGroup = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const filterBtn = {
  padding: "9px 18px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.25)",
  cursor: "pointer",
  fontWeight: "700",
};

const statCard = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "10px",
  padding: "16px",
};

const statTitle = {
  margin: "0 0 8px",
  textTransform: "uppercase",
  fontSize: "12px",
  fontWeight: "700",
  color: "#aaa",
};

const panel = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "20px",
};

const panelTitle = {
  marginTop: 0,
  textTransform: "uppercase",
  fontSize: "13px",
  color: "#b8b8b8",
};

const chartBox = {
  width: "220px",
  height: "220px",
  margin: "20px auto",
};

const transactionRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "14px 0",
};