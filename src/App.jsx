import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Overview from "./pages/Overview";
import Schedules from "./pages/Schedules";

export default function App () {
  const [page, setPage] = useState("overview");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage}  />

      <div style={{ padding: "20px", flex: 1 }}>
        {page === "overview" && <Overview />}
        {page === "schedules" && <Schedules />}
      </div>
    </div>
  );
}