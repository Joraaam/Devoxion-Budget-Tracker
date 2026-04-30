import { useState } from "react";

export default function ProfitLoss({ transactions = [] }) {
  const [filter, setFilter] = useState("business");

  const filtered =
    filter === "combined"
      ? transactions
      : transactions.filter((item) => item.wallet === filter);

  const incomeItems = filtered.filter((item) => item.type === "income");
  const expenseItems = filtered.filter((item) => item.type === "expense");

  const income = incomeItems.reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
  const netBalance = income - expenses;

  const incomeByCategory = groupByCategory(incomeItems);
  const expensesByCategory = groupByCategory(expenseItems);

  return (
    <div style={{ maxWidth: "1050px" }}>
      <div style={topRow}>
        <h2>Profit & Loss</h2>

        <div style={filterGroup}>
          <FilterButton label="Business" active={filter === "business"} onClick={() => setFilter("business")} />
          <FilterButton label="Personal" active={filter === "personal"} onClick={() => setFilter("personal")} />
          <FilterButton label="Combined" active={filter === "combined"} onClick={() => setFilter("combined")} />
        </div>
      </div>

      <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
        <StatCard title="Income" value={`€${income.toFixed(2)}`} green />
        <StatCard title="Expenses" value={`€${expenses.toFixed(2)}`} orange />
        <StatCard title="Net Balance" value={`€${netBalance.toFixed(2)}`} green={netBalance >= 0} orange={netBalance < 0} />
        <StatCard title="Transactions" value={filtered.length} />
      </div>

      <div style={panel}>
        <h3 style={sectionTitle}>Statement</h3>

        <h4 style={subTitle}>Income</h4>
        {incomeByCategory.length === 0 ? (
          <p style={{ color: "#aaa" }}>No income yet.</p>
        ) : (
          incomeByCategory.map((item) => (
            <Row key={item.category} label={item.category} value={`+€${item.total.toFixed(2)}`} green />
          ))
        )}

        <Row label="Total income" value={`+€${income.toFixed(2)}`} green bold />

        <h4 style={subTitle}>Expenses</h4>
        {expensesByCategory.length === 0 ? (
          <p style={{ color: "#aaa" }}>No expenses yet.</p>
        ) : (
          expensesByCategory.map((item) => (
            <Row key={item.category} label={item.category} value={`-€${item.total.toFixed(2)}`} orange />
          ))
        )}

        <Row label="Total expenses" value={`-€${expenses.toFixed(2)}`} orange bold />

        <hr style={divider} />

        <div style={netRow}>
          <strong>Net Profit</strong>
          <strong style={{ color: netBalance >= 0 ? "#10b981" : "#f97316" }}>
            €{netBalance.toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}

function groupByCategory(items) {
  const totals = {};

  items.forEach((item) => {
    const category = item.category || item.service || "Other";
    totals[category] = (totals[category] || 0) + Number(item.amount);
  });

  return Object.keys(totals).map((category) => ({
    category,
    total: totals[category],
  }));
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
      <h2 style={{ margin: 0, color: green ? "#10b981" : orange ? "#f97316" : "white" }}>
        {value}
      </h2>
    </div>
  );
}

function Row({ label, value, green, orange, bold }) {
  return (
    <div style={statementRow}>
      <strong style={{ fontWeight: bold ? "800" : "600" }}>{label}</strong>
      <span style={{ color: green ? "#10b981" : orange ? "#f97316" : "white" }}>
        {value}
      </span>
    </div>
  );
}

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const filterGroup = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const filterBtn = {
  padding: "10px 18px",
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
};

const sectionTitle = {
  marginTop: 0,
  textTransform: "uppercase",
  fontSize: "13px",
  color: "#b8b8b8",
};

const subTitle = {
  marginTop: "22px",
  marginBottom: "8px",
  textTransform: "uppercase",
  color: "#b8b8b8",
  fontSize: "13px",
};

const statementRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "11px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const divider = {
  margin: "20px 0",
  borderColor: "rgba(255,255,255,0.25)",
};

const netRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "18px",
};