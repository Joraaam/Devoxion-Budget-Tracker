import { useState } from "react";

export default function Schedules() {
    const [selectedDate, setSelectedDate] = useState("");
    const [schedules, setSchedules] = useState([]);

    const [form, setForm] = useState({
        client: "",
        service: "",
        time: "",
        amount: "",
        paymentMethod: "cash",
        paid: false,
    });

    function addSchedule(e) {
        e.preventDefault();

        if (!selectedDate || !form.client || !form.time || !form.amount) {
            alert("Please fill in date, name, time, and amount.");
            return;
        }

        const newSchedule = {
            id: Date.now(),
            date: selectedDate,
            ...form,
        };

        setSchedules([...schedules, newSchedule]);

        setForm({
           client: "",
           service: "",
           time: "",
           amount: "",
           paymentMethod: "cash",
           paid: false,
        })
    }

    function deleteSchedule(id) {
        setSchedules(schedules.filter((item) => item.id !== id))
    }
    const schedulesForDate = schedules.filter(
        (item) => item.date === selectedDate
    );

  return (
  <div>
    <h1>Schedules</h1>
    <p>Manage your barber client appointments.</p>

    <div style={{ marginTop: "20px" }}>
        <label>Select Date</label>
        <br />
        <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate (e.target.value)}
        />
        </div>

      <form onSubmit={addSchedule} style={{ marginTop: "20px" }}>
        <h2>Add Client Schedule</h2>

        <input
          type="text"
          placeholder="Client name"
          value={form.client}
          onChange={(e) => setForm({ ...form, client: e.target.value })}
        />

        <input
          type="text"
          placeholder="Service e.g. Haircut"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        />

        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          value={form.paymentMethod}
          onChange={(e) =>
            setForm({ ...form, paymentMethod: e.target.value })
          }
        >
          <option value="cash">Cash</option>
          <option value="bank transfer">Bank Transfer</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.paid}
            onChange={(e) => setForm({ ...form, paid: e.target.checked })}
          />
          Already paid
        </label>

        <button type="submit">Add Schedule</button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <h2>Appointments</h2>

        {schedulesForDate.length === 0 ? (
          <p>No appointments for this date.</p>
        ) : (
          schedulesForDate.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "10px",
              }}
            >
              <h3>{item.client}</h3>
              <p>Service: {item.service}</p>
              <p>Time: {item.time}</p>
              <p>Amount: €{item.amount}</p>
              <p>Payment: {item.paymentMethod}</p>
              <p>Status: {item.paid ? "Paid" : "Not paid"}</p>

              <button onClick={() => deleteSchedule(item.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}