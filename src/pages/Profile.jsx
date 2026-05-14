import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Profile({ session, refreshProfile }) {
  const [memberCount, setMemberCount] = useState(0);
  const [jointAccountId, setJointAccountId] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");

  const email = session.user.email;

  const initials =
    displayName?.slice(0, 2).toUpperCase() ||
    email?.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (session) {
      loadProfileInfo();
      loadProfile();
    }
  }, [session]);

  async function loadProfileInfo() {
    const { data: memberData } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", session.user.id)
      .limit(1)
      .maybeSingle();

    if (!memberData?.household_id) return;

    setJointAccountId(memberData.household_id);

    const { data: members } = await supabase
      .from("household_members")
      .select("*")
      .eq("household_id", memberData.household_id);

    setMemberCount(members?.length || 0);
  }

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setStatus(error.message);
      return;
    }

    if (data) {
      setDisplayName(data.display_name || "");
      setNickname(data.nickname || "");
    }
  }

  async function saveProfile(e) {
    e.preventDefault();

    setStatus("Saving profile...");

    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      display_name: displayName,
      nickname,
    });

    if (error) {
      console.error(error);
      setStatus(error.message);
      return;
    }

    await refreshProfile?.();
    setStatus("Profile updated successfully.");
  }

  return (
    <div style={{ maxWidth: "950px" }}>
      <div style={profileCard}>
        <div style={avatar}>{initials}</div>

        <div>
          <h2 style={{ margin: 0 }}>{displayName || "Your Profile"}</h2>
          <p style={muted}>{email}</p>
          {nickname && <p style={nicknameStyle}>@{nickname}</p>}
        </div>
      </div>

      <div className="responsive-grid-2">
        <div style={panel}>
          <h3 style={sectionTitle}>Profile settings</h3>

          <form onSubmit={saveProfile}>
            <p style={label}>Display name</p>
            <input
              style={input}
              placeholder="Your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <p style={label}>Nickname</p>
            <input
              style={input}
              placeholder="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />

            <button type="submit" style={button}>
              Save profile
            </button>

            {status && <p style={statusText}>{status}</p>}
          </form>
        </div>

        <div style={panel}>
          <h3 style={sectionTitle}>Joint account</h3>

          {jointAccountId ? (
            <>
              <p style={label}>Status</p>
              <span style={activeBadge}>Active</span>

              <p style={label}>Connected members</p>
              <strong>{memberCount}</strong>
            </>
          ) : (
            <>
              <p style={muted}>No joint account connected yet.</p>
              <p style={muted}>You can add access in Settings.</p>
            </>
          )}
        </div>
      </div>

      <div style={panel}>
        <h3 style={sectionTitle}>Account info</h3>

        <p style={label}>Email</p>
        <strong>{email}</strong>

        <p style={label}>User ID</p>
        <code style={codeBox}>{session.user.id}</code>
      </div>
    </div>
  );
}

const profileCard = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "22px",
  marginBottom: "20px",
};

const avatar = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #10b981, #3b82f6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "800",
  fontSize: "24px",
};

const panel = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "20px",
  marginBottom: "18px",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "16px",
  textTransform: "uppercase",
  fontSize: "13px",
  color: "#b8b8b8",
};

const muted = {
  color: "#aaa",
  margin: "6px 0",
};

const nicknameStyle = {
  color: "#60a5fa",
  marginTop: "4px",
};

const label = {
  color: "#aaa",
  fontSize: "13px",
  margin: "14px 0 6px",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "14px",
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

const statusText = {
  color: "#a7f3d0",
  marginTop: "12px",
};

const codeBox = {
  display: "block",
  padding: "10px",
  borderRadius: "8px",
  background: "rgba(0,0,0,0.25)",
  color: "#d1d5db",
  wordBreak: "break-all",
};

const activeBadge = {
  display: "inline-block",
  background: "#a7f3d0",
  color: "#065f46",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};