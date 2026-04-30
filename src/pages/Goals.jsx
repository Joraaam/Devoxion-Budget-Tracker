import { useEffect, useState } from "react";

export default function Goals() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    name: "",
    target: "",
    saved: "",
  });

  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  function addGoal(e) {
    e.preventDefault();

    if (!form.name || !form.target) {
      alert("Please fill in goal name and target.");
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: form.name,
      target: Number(form.target),
      saved: Number(form.saved || 0),
    };

    setGoals([newGoal, ...goals]);
    setForm({ name: "", target: "", saved: "" });
  }

  function deleteGoal(id) {
    setGoals(goals.filter((goal) => goal.id !== id));
  }

  function addProgress(id, amount) {
    if (!amount || Number(amount) <= 0) return;

    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              saved: Math.min(goal.target, goal.saved + Number(amount)),
            }
          : goal,
      ),
    );
  }

  function editGoalName(id, name) {
    if (!name) return;

    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, name } : goal)));
  }

  function openGoalMenu(e, goal) {
    e.preventDefault();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      goal,
    });
  }

  return (
    <div
      style={{ maxWidth: "1050px", position: "relative" }}
      onClick={() => setContextMenu(null)}
    >
      <form onSubmit={addGoal} style={panel}>
        <h3 style={sectionTitle}>Add shared goal</h3>

        <div className="responsive-grid-3">
          <input
            style={input}
            placeholder="Goal name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Target (€)"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Saved so far (€)"
            value={form.saved}
            onChange={(e) => setForm({ ...form, saved: e.target.value })}
          />
        </div>

        <button type="submit" style={addButton}>
          Add goal
        </button>
      </form>

      <div style={panel}>
        <h3 style={sectionTitle}>Savings goals</h3>

        {goals.length === 0 ? (
          <p style={{ color: "#aaa" }}>No goals yet.</p>
        ) : (
          goals.map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.saved / goal.target) * 100),
            );

            return (
              <div
                key={goal.id}
                style={goalRow}
                onContextMenu={(e) => openGoalMenu(e, goal)}
                onTouchStart={(e) => {
                  const touch = e.touches[0];

                  const timer = setTimeout(() => {
                    openGoalMenu(
                      {
                        preventDefault: () => {},
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                      },
                      goal,
                    );
                  }, 500); // hold 500ms

                  e.currentTarget.touchTimer = timer;
                }}
                onTouchEnd={(e) => {
                  clearTimeout(e.currentTarget.touchTimer);
                }}
              >
                <div style={goalHeader}>
                  <strong>{goal.name}</strong>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <strong>{percent}%</strong>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={deleteBtn}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div style={progressTrack}>
                  <div style={{ ...progressFill, width: `${percent}%` }} />
                </div>

                <p style={goalAmount}>
                  €{goal.saved.toFixed(2)} of €{goal.target.toFixed(2)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {contextMenu && (
        <div
          style={{
            ...menu,
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            style={menuItem}
            onClick={() => {
              const amount = prompt("How much € do you want to add?");
              addProgress(contextMenu.goal.id, amount);
              setContextMenu(null);
            }}
          >
            Add progress
          </button>

          <button
            style={menuItem}
            onClick={() => {
              const name = prompt("New goal name:", contextMenu.goal.name);
              editGoalName(contextMenu.goal.id, name);
              setContextMenu(null);
            }}
          >
            Edit goal name
          </button>
        </div>
      )}
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

const input = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "12px",
  padding: "12px 14px",
  borderRadius: "7px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
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

const goalRow = {
  padding: "16px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  cursor: "context-menu",
};

const goalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const progressTrack = {
  width: "100%",
  height: "5px",
  background: "rgba(255,255,255,0.14)",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#10b981",
  borderRadius: "999px",
};

const goalAmount = {
  margin: "7px 0 0",
  color: "#b8b8b8",
  fontSize: "13px",
};

const deleteBtn = {
  width: "24px",
  height: "24px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "white",
  cursor: "pointer",
};

const menu = {
  position: "fixed",
  background: "#1f2024",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  padding: "6px",
  zIndex: 9999,
  minWidth: "170px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const menuItem = {
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: "8px",
  background: "transparent",
  color: "white",
  textAlign: "left",
  cursor: "pointer",
};
