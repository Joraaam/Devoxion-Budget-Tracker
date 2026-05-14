import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Settings({ session }) {
  const [jointAccountId, setJointAccountId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (session) {
      loadJointAccount();
    }
  }, [session]);

  async function loadJointAccount() {
    setStatus("");

    const { data, error } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", session.user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("loadJointAccount error:", error);
      setStatus(error.message);
      return null;
    }

    if (data?.household_id) {
      setJointAccountId(data.household_id);
      await loadInvites(data.household_id);
      return data.household_id;
    }

    return null;
  }

  async function loadInvites(accountId) {
    const { data, error } = await supabase
      .from("household_invites")
      .select("*")
      .eq("household_id", accountId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadInvites error:", error);
      setStatus(error.message);
      return;
    }

    setInvites(data || []);
  }

  async function inviteUser(e) {
    e.preventDefault();

    const email = inviteEmail.trim().toLowerCase();

    if (!email) {
      setStatus("Enter an email.");
      return;
    }

    setStatus("Creating invite...");

    let householdId = jointAccountId;

    if (!householdId) {
      const { data: memberRow, error: memberError } = await supabase
        .from("household_members")
        .select("household_id")
        .eq("user_id", session.user.id)
        .limit(1)
        .maybeSingle();

      if (memberError) {
        setStatus("Member check error: " + memberError.message);
        return;
      }

      householdId = memberRow?.household_id || null;
    }

    if (!householdId) {
      const { data: household, error: householdError } = await supabase
        .from("households")
        .insert({
          name: "Joint Account",
          owner_id: session.user.id,
        })
        .select("id")
        .single();

      if (householdError) {
        setStatus("Create joint account error: " + householdError.message);
        return;
      }

      householdId = household.id;

      const { error: ownerError } = await supabase
        .from("household_members")
        .insert({
          household_id: householdId,
          user_id: session.user.id,
          role: "owner",
        });

      if (ownerError) {
        setStatus("Owner member error: " + ownerError.message);
        return;
      }
    }

    const { data: invite, error: inviteError } = await supabase
      .from("household_invites")
      .insert({
        household_id: householdId,
        email,
        role: "member",
        accepted: false,
      })
      .select()
      .single();

    if (inviteError) {
      setStatus("Invite error: " + inviteError.message);
      return;
    }

    setJointAccountId(householdId);
    setInvites((prev) => [invite, ...prev]);
    setInviteEmail("");
    setStatus(`Invite created for ${email}`);
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={panel}>
        <h3 style={sectionTitle}>Account</h3>
        <p style={muted}>Logged in as</p>
        <strong>{session.user.email}</strong>
      </div>

      <form onSubmit={inviteUser} style={panel}>
        <h3 style={sectionTitle}>Joint account access</h3>

        <p style={muted}>
          Add someone by email. When they sign up or log in with that email,
          they will get access to your shared schedules, goals, transactions,
          and profit/loss.
        </p>

        <input
          type="email"
          style={input}
          placeholder="Enter email address"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />

        <button type="submit" style={button}>
          Add access
        </button>

        {status && <p style={statusText}>{status}</p>}
      </form>

      <div style={panel}>
        <h3 style={sectionTitle}>Access invites</h3>

        {!jointAccountId ? (
          <p style={muted}>No joint account yet. Add an email to create one.</p>
        ) : invites.length === 0 ? (
          <p style={muted}>No invites yet.</p>
        ) : (
          invites.map((invite) => (
            <div key={invite.id} style={row}>
              <strong>{invite.email}</strong>

              <span style={invite.accepted ? acceptedBadge : pendingBadge}>
                {invite.accepted ? "Accepted" : "Pending"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const panel = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "12px",
  textTransform: "uppercase",
  fontSize: "13px",
  color: "#b8b8b8",
};

const muted = {
  color: "#aaa",
  margin: "6px 0 14px",
  fontSize: "14px",
};

const statusText = {
  color: "#a7f3d0",
  margin: "12px 0 0",
  fontSize: "14px",
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

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const pendingBadge = {
  background: "#fde68a",
  color: "#713f12",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const acceptedBadge = {
  background: "#a7f3d0",
  color: "#065f46",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};