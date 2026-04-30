export default function Sidebar({ setPage, page, sidebarOpen }) {
  const buttonStyle = (active) => ({
    textAlign: "left",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
    color: "white",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    width: "100%",
  });

  return (
    <aside
      className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1f2937, #111827)",
        padding: "24px",
      }}
    >
      <h2 style={{ marginTop: "45px", marginBottom: "30px", color: "white" }}>
        Budget Tracker
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={() => setPage("overview")}
          style={buttonStyle(page === "overview")}
        >
          Overview
        </button>

        <button
          onClick={() => setPage("schedules")}
          style={buttonStyle(page === "schedules")}
        >
          Schedules
        </button>

        <button
          onClick={() => setPage("transactions")}
          style={buttonStyle(page === "transactions")}
        >
          Transactions
        </button>

        <button
          onClick={() => setPage("goals")}
          style={buttonStyle(page === "goals")}
        >
          Goals
        </button>

        <button
          onClick={() => setPage("profit-loss")}
          style={buttonStyle(page === "profit-loss")}
        >
          Profit & Loss
        </button>
      </nav>
    </aside>
  );
}
