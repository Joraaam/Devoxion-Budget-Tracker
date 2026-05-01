import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import Schedules from "./pages/Schedules";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import ProfitLoss from "./pages/ProfitLoss";
import logo from "./assets/logo.png";

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
    width: "100%",
    minWidth: 0,
    padding: "100px 40px 40px",
    background: "#111217",
    color: "white",
    overflowX: "hidden",
  }}
>
          <div style={topBar}>
            <img src={logo} alt="logo" style={topLogo} />
          </div>

<div style={pageContainer}>
  {page === "overview" && <Overview transactions={transactions} />}
  {page === "schedules" && <Schedules addTransaction={addTransaction} />}
  {page === "transactions" && (
    <Transactions transactions={transactions} addTransaction={addTransaction} />
  )}
  {page === "goals" && <Goals />}
  {page === "profit-loss" && <ProfitLoss transactions={transactions} />}
</div>
        </main>
      </div>
    </>
  );
}

const topBar = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "5px",
  marginTop: "-70px",
};

const topLogo = {
  height: "70px",
  maxWidth: "180px",
  objectFit: "contain",
};

const pageContainer = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
};