import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login({ setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    if (mode === "signup") {
      alert("Account created. Check your email if confirmation is enabled.");
    }

    if (result.data.session) {
      setSession(result.data.session);
    }
  }

  return (
    <div style={page}>
      <form onSubmit={handleSubmit} style={card}>
        <h1 style={title}>
          {mode === "login" ? "Login" : "Create account"}
        </h1>

        <input
          style={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={button} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>

        <button
          type="button"
          style={switchButton}
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#111217",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
};

const card = {
  width: "100%",
  maxWidth: "380px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
  padding: "28px",
};

const title = {
  textAlign: "center",
  marginBottom: "24px",
};

const input = {
  width: "100%",
  marginBottom: "12px",
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
};

const button = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "none",
  background: "white",
  color: "#111217",
  fontWeight: "700",
  cursor: "pointer",
};

const switchButton = {
  width: "100%",
  marginTop: "12px",
  background: "transparent",
  border: "none",
  color: "#aaa",
  cursor: "pointer",
};