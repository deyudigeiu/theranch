import { useState } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function Addresses({ ctx }) {
  const {
    addresses,
    setAddresses,
    storage,
    showToast,
    editAddress,
    setEditAddress,
  } = ctx;

  const [form, setForm] = useState(
    editAddress || { label: "", addr: "", phone: "", is_default: false }
  );
  const [mode, setMode] = useState(editAddress ? "edit" : "list");

  const save = async () => {
    if (!form.label.trim() || !form.addr.trim()) {
      showToast("Completează eticheta și adresa", "⚠️");
      return;
    }
    const saved = await storage.saveAddress(form);
    if (form.id) {
      setAddresses((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
    } else {
      setAddresses((prev) => [...prev, saved]);
    }
    showToast("Adresă salvată", "✓");
    setForm({ label: "", addr: "", phone: "", is_default: false });
    setMode("list");
  };

  const remove = async (id) => {
    await storage.deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Adresă ștearsă", "🗑");
  };

  if (mode === "form")
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
            onClick={() => setMode("list")}
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
            {form.id ? "Editează adresa" : "Adresă nouă"}
          </span>
        </div>
        <div style={{ padding: "16px 18px 0" }}>
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={lbl}>Etichetă (ex: Acasă, Birou)</span>
            <input
              value={form.label}
              onChange={(e) =>
                setForm((f) => ({ ...f, label: e.target.value }))
              }
              placeholder="Acasă"
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={lbl}>Adresă completă</span>
            <textarea
              value={form.addr}
              onChange={(e) => setForm((f) => ({ ...f, addr: e.target.value }))}
              placeholder="Str. Exemplu nr. 10, Sector 1, București"
              style={{ ...inp, resize: "none", minHeight: 80 }}
            />
          </label>
          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={lbl}>Telefon contact (opțional)</span>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="07xx xxx xxx"
              type="tel"
              style={inp}
            />
          </label>
          <button onClick={save} style={btnG()}>
            Salvează adresa
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 18px 0" }}>
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: 18,
            fontWeight: 800,
            color: "#2D2D2D",
          }}
        >
          Adresele mele
        </h2>

        {addresses.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#bbb" }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
            <p style={{ fontSize: 14 }}>Nicio adresă salvată</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {addresses.map((a) => (
              <div
                key={a.id}
                style={{
                  ...card,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 28 }}>📍</div>
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
                      setForm(a);
                      setMode("form");
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
                    onClick={() => remove(a.id)}
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
            setForm({ label: "", addr: "", phone: "", is_default: false });
            setMode("form");
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
          }}
        >
          + Adaugă adresă nouă
        </button>
      </div>
    </div>
  );
}
