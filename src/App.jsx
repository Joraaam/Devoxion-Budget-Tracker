import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import Schedules from "./pages/Schedules";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import ProfitLoss from "./pages/ProfitLoss";
import logo from "./assets/logo.png";
import { supabase } from "./lib/supabase";
import Login from "./pages/Login";

export default function App() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    async function setupAuth() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }

    setupAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setMenuOpen(false);
  }

  if (!session) {
    return <Login setSession={setSession} />;
  }

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div style={profileWrapper}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={profileButton}
        >
          👤
        </button>

        {menuOpen && (
          <div style={dropdownMenu}>
            <button style={menuItem}>Profile</button>
            <button style={menuItem}>Settings</button>
            <button style={menuItemDanger} onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <div
        className="app-layout"
        style={{ display: "flex", minHeight: "100vh" }}
      >
        <Sidebar setPage={changePage} page={page} sidebarOpen={sidebarOpen} />

        <main style={mainStyle}>
          <div style={topBar}>
            <img src={logo} alt="logo" style={topLogo} />
          </div>

          <div style={pageContainer}>
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

            {page === "profit-loss" && (
              <ProfitLoss transactions={transactions} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

const mainStyle = {
  flex: 1,
  width: "100%",
  minWidth: 0,
  padding: "100px 40px 40px",
  background: "#111217",
  color: "white",
  overflowX: "hidden",
};

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

const profileWrapper = {
  position: "fixed",
  top: "14px",
  right: "14px",
  zIndex: 1200,
};

const profileButton = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
};

const dropdownMenu = {
  position: "absolute",
  top: "50px",
  right: "0",
  background: "rgba(20,20,25,0.95)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  padding: "8px",
  minWidth: "150px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const menuItem = {
  padding: "10px",
  border: "none",
  background: "transparent",
  color: "white",
  textAlign: "left",
  cursor: "pointer",
  borderRadius: "6px",
};

const menuItemDanger = {
  ...menuItem,
  color: "#f87171",
};