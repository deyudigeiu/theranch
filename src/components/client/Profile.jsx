import { useState } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function Profile({ ctx }) {
  const {
    profile,
    setProfile,
    addresses,
    setAddresses,
    storage,
    showToast,
    signOut,
  } = ctx;

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [mode, setMode] = useState("profile");
  const [addrForm, setAddrForm] = useState({
    label: "",
    addr: "",
    phone: "",
    is_default: false,
  });

  const saveProfile = async () => {
    setLoadingProfile(true);
    await storage.updateProfile({ name, phone });
    setProfile((p) => ({ ...p, name, phone }));
    showToast("Profil actualizat", "✓");
    setLoadingProfile(false);
  };

  const saveAddress = async () => {
    if (!addrForm.label.trim() || !addrForm.addr.trim()) {
      showToast("Completează eticheta și adresa", "⚠️");
      return;
    }
    const saved = await storage.saveAddress(addrForm);
    if (addrForm.id) {
      setAddresses((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
    } else {
      setAddresses((prev) => [...prev, saved]);
    }
    showToast("Adresă salvată", "✓");
    setAddrForm({ label: "", addr: "", phone: "", is_default: false });
    setMode("profile");
  };

  const removeAddress = async (id) => {
    await storage.deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Adresă ștearsă", "🗑");
  };

  const initials = (profile?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (mode === "addrForm") {
    return (
      <div style={{ paddingBottom: 80 }}>
        <div
          style={{
            padding: "14px 18px 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => setMode("profile")}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#2D2D2D",
            }}
          >
            ‹
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D" }}>
            {addrForm.id ? "Editează adresa" : "Adresă nouă"}
          </span>
        </div>
        <div style={{ padding: "16px 18px 0" }}>
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={lbl}>Etichetă (ex: Acasă, Birou)</span>
            <input
              value={addrForm.label}
              onChange={(e) =>
                setAddrForm((f) => ({ ...f, label: e.target.value }))
              }
              placeholder="Acasă"
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={lbl}>Adresă completă</span>
            <textarea
              value={addrForm.addr}
              onChange={(e) =>
                setAddrForm((f) => ({ ...f, addr: e.target.value }))
              }
              placeholder="Str. Exemplu nr. 10, Sector 1, București"
              style={{ ...inp, resize: "none", minHeight: 80 }}
            />
          </label>
          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={lbl}>Telefon contact (opțional)</span>
            <input
              value={addrForm.phone}
              onChange={(e) =>
                setAddrForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="07xx xxx xxx"
              type="tel"
              style={inp}
            />
          </label>
          <button onClick={saveAddress} style={btnG()}>
            Salvează adresa
          </button>
        </div>
      </div>
    );
  }

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
          style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
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
          onClick={saveProfile}
          disabled={loadingProfile}
          style={{
            ...btnG({ opacity: loadingProfile ? 0.7 : 1 }),
            marginBottom: 28,
          }}
        >
          {loadingProfile ? "Se salvează..." : "Salvează modificările"}
        </button>

        {/* Separator adrese */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "#aaa",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Adresele mele
        </div>

        {addresses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#bbb",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
            <p style={{ fontSize: 13, margin: 0 }}>Nicio adresă salvată</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {addresses.map((a) => (
              <div
                key={a.id}
                style={{ ...card, display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ fontSize: 24 }}>📍</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontWeight: 700, fontSize: 14, color: "#2D2D2D" }}
                  >
                    {a.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                    {a.addr}
                  </div>
                  {a.phone && (
                    <div style={{ fontSize: 12, color: "#aaa" }}>
                      📞 {a.phone}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => {
                      setAddrForm(a);
                      setMode("addrForm");
                    }}
                    style={{
                      background: GL,
                      color: G,
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeAddress(a.id)}
                    style={{
                      background: "#FEE2E2",
                      color: "#DC2626",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setAddrForm({ label: "", addr: "", phone: "", is_default: false });
            setMode("addrForm");
          }}
          style={{
            width: "100%",
            background: "white",
            color: G,
            border: `1.5px dashed ${G}`,
            borderRadius: 18,
            padding: "14px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          + Adaugă adresă nouă
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
