import { useState } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function Profile({ ctx }) {
  const { profile, setProfile, storage, showToast, signOut } = ctx;

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await storage.updateProfile({ name, phone });
    setProfile((p) => ({ ...p, name, phone }));
    showToast("Profil actualizat", "✓");
    setLoading(false);
  };

  const initials = (profile?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 18px 0" }}>
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: 18,
            fontWeight: 800,
            color: "#2D2D2D",
          }}
        >
          Profilul meu
        </h2>

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: G,
              color: "white",
              fontSize: 30,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initials}
          </div>
        </div>

        {/* Email (readonly) */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#bbb",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Email
          </div>
          <div style={{ fontSize: 14, color: "#2D2D2D" }}>
            {profile?.email || "—"}
          </div>
        </div>

        {/* Nume */}
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={lbl}>Nume complet</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ion Popescu"
            style={inp}
          />
        </label>

        {/* Telefon */}
        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={lbl}>Telefon</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xx xxx xxx"
            type="tel"
            style={inp}
          />
        </label>

        <button
          onClick={save}
          disabled={loading}
          style={{ ...btnG({ opacity: loading ? 0.7 : 1 }), marginBottom: 12 }}
        >
          {loading ? "Se salvează..." : "Salvează modificările"}
        </button>

        <button
          onClick={signOut}
          style={{
            width: "100%",
            background: "white",
            color: "#DC2626",
            border: "1.5px solid #DC2626",
            borderRadius: 18,
            padding: "14px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🚪 Deconectare
        </button>
      </div>
    </div>
  );
}
