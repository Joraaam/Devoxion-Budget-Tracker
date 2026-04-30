import { useState } from "react";

const categories = {
  personal: ["Housing", "Food", "Salary", "Shopping", "Transport", "Other"],
  business: [
    "Services",
    "Marketing",
    "Software",
    "Supplies",
    "Consulting",
    "Other",
  ],
};

export default function Transactions({ transactions = [], addTransaction }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    wallet: "personal",
    category: "Housing",
    paymentMethod: "cash",
  });

  function submit(e) {
    e.preventDefault();

    if (!form.description || !form.amount) {
      alert("Please fill in description and amount.");
      return;
    }

    addTransaction({
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      ...form,
    });

    setForm({
      description: "",
      amount: "",
      type: "expense",
      wallet: "personal",
      category: "Housing",
      paymentMethod: "cash",
    });
  }

  function updateWallet(wallet) {
    setForm({
      ...form,
      wallet,
      category: categories[wallet][0],
    });
  }

  return (
    <div style={{ maxWidth: "1050px" }}>
      <form onSubmit={submit} style={panel}>
        <h3 style={sectionTitle}>Add transaction</h3>

        <div className="responsive-grid-3">
          <input
            style={input}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Amount (€)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <select
            style={input}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="responsive-grid-2">
          <select
            style={input}
            value={form.wallet}
            onChange={(e) => updateWallet(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>

          <select
            style={input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories[form.wallet].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <select
          style={input}
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
        >
          <option value="cash">Cash</option>
          <option value="bank transfer">Bank transfer</option>
        </select>

        <button type="submit" style={addButton}>
          Add transaction
        </button>
      </form>

      <div style={panel}>
        <h3 style={sectionTitle}>Recent transactions</h3>

        {transactions.length === 0 ? (
          <p style={{ color: "#aaa" }}>No transactions yet.</p>
        ) : (
          transactions.map((item) => {
            const isIncome = item.type === "income";

            return (
              <div key={item.id} style={transactionRow}>
                <div
                  style={{
                    ...dot,
                    background: isIncome ? "#10b981" : "#f97316",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <strong>
                    {item.description ||
                      item.client ||
                      item.service ||
                      "Transaction"}
                  </strong>

                  <div style={metaRow}>
                    <span>{item.category || item.service || "Other"}</span>
                    <span>·</span>
                    <span style={walletBadge}>{item.wallet || "business"}</span>
                    <span style={paymentBadge}>
                      {item.paymentMethod === "cash" ? "Cash" : "Bank transfer"}
                    </span>
                  </div>
                </div>

                <strong
                  style={{
                    color: isIncome ? "#10b981" : "#f97316",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isIncome ? "+" : "-"}€{Number(item.amount).toFixed(2)}
                </strong>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const panel = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "14px",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "14px",
  textTransform: "uppercase",
  fontSize: "13px",
  color: "#b8b8b8",
};

const formGridTop = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "8px",
};

const formGridBottom = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "8px",
  padding: "11px 14px",
  borderRadius: "7px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
};

const addButton = {
  width: "100%",
  padding: "10px",
  borderRadius: "7px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

const transactionRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const dot = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
};

const metaRow = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "5px",
  color: "#aaa",
  fontSize: "12px",
  marginTop: "3px",
};

const walletBadge = {
  background: "#a7f3d0",
  color: "#065f46",
  borderRadius: "999px",
  padding: "2px 7px",
  fontSize: "11px",
  fontWeight: "700",
};

const paymentBadge = {
  background: "#e0e7ff",
  color: "#3730a3",
  borderRadius: "999px",
  padding: "2px 7px",
  fontSize: "11px",
  fontWeight: "700",
};
