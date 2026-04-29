export default function Sidebar({ setPage }) {
  return (
    <div style={{ width: "200px", background: "#eee", padding: "20px" }}>
      <button onClick={() => setPage("overview")}>Overview</button>
      <button onClick={() => setPage("schedules")}>Schedules</button>
    </div>
  );
}