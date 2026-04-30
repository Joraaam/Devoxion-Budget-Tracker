import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import Schedules from "./pages/Schedules";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import ProfitLoss from "./pages/ProfitLoss";

export default function App() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  function addTransaction(transaction) {
    const updated = [
      {
        ...transaction,
        wallet: transaction.wallet || "business",
      },
      ...transactions,
    ];

    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  }

  function changePage(newPage) {
    setPage(newPage);
  }

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div
        className="app-layout"
        style={{ display: "flex", minHeight: "100vh" }}
      >
        <Sidebar setPage={changePage} page={page} sidebarOpen={sidebarOpen} />

        <main
          style={{
            flex: 1,
            padding: "40px",
            background: "#111217",
            color: "white",
          }}
        >
          {page === "profit-loss" && <ProfitLoss transactions={transactions} />}
          {page === "overview" && <Overview transactions={transactions} />}
          {page === "schedules" && (
            <Schedules addTransaction={addTransaction} />
          )}
          {page === "transactions" && (
            <Transactions
              transactions={transactions}
              addTransaction={addTransaction}
            />
          )}
          {page === "goals" && <Goals />}
        </main>
      </div>
    </>
  );
}
