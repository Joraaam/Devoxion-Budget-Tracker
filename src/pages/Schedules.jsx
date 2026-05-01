import { useEffect, useState } from "react";

const services = ["Haircut", "Fade", "Haircut + Beard", "Beard trim"];

function formatDateTitle(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

export default function Schedules({ addTransaction }) {
  const today = new Date();

  const [monthDate, setMonthDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().slice(0, 10),
  );

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem("schedules");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    client: "",
    service: "Haircut",
    time: "10:00",
    amount: "",
    paymentMethod: "cash",
    paid: false,
  });

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const selectedAppointments = schedules
    .filter((item) => item.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  function previousMonth() {
    setMonthDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setMonthDate(new Date(year, month + 1, 1));
  }

  function addSchedule(e) {
    e.preventDefault();

    if (!form.client || !form.time || !form.amount) {
      alert("Please fill in client name, time, and price.");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      date: selectedDate,
      ...form,
      paid: false,
    };

    if (form.paid) {
      if (addTransaction) {
        addTransaction({
          id: Date.now(),
          date: selectedDate,
          client: form.client,
          service: form.service,
          amount: form.amount,
          paymentMethod: form.paymentMethod,
          type: "income",
        });
      }
    } else {
      setSchedules([...schedules, newSchedule]);
    }

    setForm({
      client: "",
      service: "Haircut",
      time: "10:00",
      amount: "",
      paymentMethod: "cash",
      paid: false,
    });
  }

  function deleteSchedule(id) {
    setSchedules(schedules.filter((item) => item.id !== id));
  }

  function markPaid(item) {
    if (addTransaction) {
      addTransaction({
        id: Date.now(),
        date: item.date,
        client: item.client,
        service: item.service,
        amount: item.amount,
        paymentMethod: item.paymentMethod,
        type: "income",
        wallet: "business",
      });
    }

    setSchedules(schedules.filter((schedule) => schedule.id !== item.id));
  }

  return (
    <div style={{ maxWidth: "1050px" }}>
      <div style={topLine}>
        <div style={headerRow}>
          <h2 style={{ margin: 0 }}>Client schedules</h2>
          <strong style={{ color: "#b8b8b8" }}>
            {schedules.length} appointments total
          </strong>
        </div>

        <div style={calendarContainer}>
          <div style={calendarHeader}>
            <button onClick={previousMonth} style={navButton}>
              ‹
            </button>

            <h3 style={{ margin: 0 }}>
              {monthDate.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <button onClick={nextMonth} style={navButton}>
              ›
            </button>

            
          </div>

          <div style={weekGrid}>
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
              <div key={day} style={weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div style={calendarGrid}>
            {calendarDays.map((day, index) => {
              if (!day) return <div key={index} style={calendarCell}></div>;

              const dateKey = getDateKey(year, month, day);
              const appointments = schedules.filter(
                (item) => item.date === dateKey,
              );
              const isSelected = selectedDate === dateKey;

              return (
                <button
                  className="calendar-cell"
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  style={{
  ...calendarCell,
  border: isSelected ? "1px solid white" : undefined,
  color: "white",
  cursor: "pointer",
}}
                >
                  <strong>{day}</strong>

                  <div style={{ marginTop: "6px" }}>
                    {appointments.slice(0, 2).map((item) => (
                      <div key={item.id} style={appointmentPill}>
                        {item.time} {item.client}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="responsive-grid-2" style={{ marginTop: "24px" }}>
          <div style={panel}>
            <h3 style={panelTitle}>{formatDateTitle(selectedDate)}</h3>

            {selectedAppointments.length === 0 ? (
              <p style={{ color: "#aaa" }}>No appointments for this day.</p>
            ) : (
              selectedAppointments.map((item) => (
                <div
                  key={item.id}
                  className="appointment-row"
                  style={appointmentRow}
                >
                  <strong style={{ color: "#b8b8b8" }}>{item.time}</strong>

                  <div>
                    <strong>{item.client}</strong>
                    <div style={{ marginTop: "6px" }}>
                      <span style={badge}>{item.service}</span>
                      <span style={{ marginLeft: "6px" }}>€{item.amount}</span>
                    </div>

                    <div style={badgeRow}>
                      <span style={paymentBadge}>
                        {item.paymentMethod === "cash"
                          ? "Cash"
                          : "Bank transfer"}
                      </span>
                      <span style={unpaidBadge}>Unpaid</span>
                    </div>
                  </div>

                  <button onClick={() => markPaid(item)} style={markPaidBtn}>
                    Mark paid
                  </button>

                  <button
                    onClick={() => deleteSchedule(item.id)}
                    style={deleteBtn}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={addSchedule} style={panel}>
            <h3 style={{ ...panelTitle, textAlign: "center" }}>
              Add appointment
            </h3>

            <input
              style={input}
              placeholder="Client name"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />

            <select
              style={input}
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <input
              style={input}
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />

            <input
              style={input}
              type="number"
              placeholder="Price (€)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <p style={smallLabel}>Payment method</p>

            <div style={radioGrid}>
              <label
                style={{
                  ...radioBox,
                  border:
                    form.paymentMethod === "cash"
                      ? "1px solid white"
                      : "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={form.paymentMethod === "cash"}
                  onChange={(e) =>
                    setForm({ ...form, paymentMethod: e.target.value })
                  }
                />
                Cash
              </label>

              <label
                style={{
                  ...radioBox,
                  border:
                    form.paymentMethod === "bank transfer"
                      ? "1px solid white"
                      : "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank transfer"
                  checked={form.paymentMethod === "bank transfer"}
                  onChange={(e) =>
                    setForm({ ...form, paymentMethod: e.target.value })
                  }
                />
                Bank transfer
              </label>
            </div>

            <label style={checkLabel}>
              <input
                type="checkbox"
                checked={form.paid}
                onChange={(e) => setForm({ ...form, paid: e.target.checked })}
              />
              Already paid
            </label>

            <button type="submit" style={bookBtn}>
              Book appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const topLine = {
  borderTop: "1px solid rgba(255,255,255,0.12)",
  paddingTop: "22px",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "14px",
};

const calendarContainer = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "18px",
};

const calendarHeader = {
  display: "grid",
  gridTemplateColumns: "44px 1fr 44px",
  alignItems: "center",
  marginBottom: "18px",
  textAlign: "center",
};

const navButton = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
};

const weekGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  marginBottom: "8px",
};

const weekDay = {
  textAlign: "center",
  color: "#aaa",
  fontSize: "12px",
  fontWeight: "700",
};

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
};

const calendarCell = {
  minHeight: "72px",
  borderRadius: "10px",
  display: "flex",            // 👈 ADD
  alignItems: "center",       // 👈 vertical center
  justifyContent: "center",   // 👈 horizontal center
  flexDirection: "column",    // 👈 keep pills below if any
  textAlign: "center",
  background: "transparent",
};

const appointmentPill = {
  fontSize: "10px",
  background: "#a7f3d0",
  color: "#022c22",
  borderRadius: "5px",
  padding: "3px 5px",
  marginTop: "4px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const panelGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
  marginTop: "24px",
  alignItems: "start",
};

const panel = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "24px",
};

const panelTitle = {
  marginTop: 0,
  marginBottom: "20px",
};

const appointmentRow = {
  display: "grid",
  gridTemplateColumns: "60px 1fr auto auto",
  alignItems: "center",
  gap: "14px",
  padding: "16px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const badge = {
  background: "#bfdbfe",
  color: "#06436b",
  padding: "4px 8px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const badgeRow = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  marginTop: "8px",
};

const paymentBadge = {
  background: "#fde68a",
  color: "#713f12",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const unpaidBadge = {
  background: "#fed7aa",
  color: "#7c2d12",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const markPaidBtn = {
  padding: "9px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const deleteBtn = {
  width: "34px",
  height: "34px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  cursor: "pointer",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "12px",
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
};

const smallLabel = {
  margin: "6px 0 10px",
  color: "#b8b8b8",
  fontSize: "12px",
  fontWeight: "700",
};

const radioGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "18px",
};

const radioBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "13px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
};

const checkLabel = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "16px",
  color: "#e5e7eb",
};

const bookBtn = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.11)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};
