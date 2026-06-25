import { useState } from "react";
import { G, GL, card, btnG, inp, lbl } from "../../lib/constants";

export default function Checkout({ ctx }) {
  const {
    cart,
    products,
    slots,
    addresses,
    placeOrder,
    setPage,
    nextDelivery,
    showToast,
    deliveryConfig,
    settings,
  } = ctx;

  const [del, setDel] = useState({
    addr: "",
    slot: "",
    pay: "cash",
    note: "",
    addrId: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const cartItems = (cart || [])
    .map(({ product_id, qty }) => ({
      p: products.find((pr) => pr.id === product_id),
      q: qty,
    }))
    .filter((item) => item.p);

  const subtotal = cartItems.reduce((sum, { p, q }) => sum + p.price * q, 0);
  const shipping = deliveryConfig?.fee ?? settings?.shipping ?? 15;
  const shipFree =
    subtotal >= (deliveryConfig?.freeAt ?? settings?.shipFreeAt ?? 150);
  const total = subtotal + (shipFree ? 0 : shipping);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const validate = () => {
    const e = {};
    if (!del.addr.trim()) e.addr = "Adresa este obligatorie";
    if (slots?.length > 0 && !del.slot) e.slot = "Alege un interval orar";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await placeOrder({
        addr: del.addr,
        delivery_slot: del.slot,
        pay: del.pay,
        note: del.note,
        total,
      });
    } catch (e) {
      showToast("Eroare la plasarea comenzii", "❌");
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        style={{
          padding: "14px 18px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => setPage("cos")}
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
          Finalizează comanda
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        {nextDelivery && (
          <div
            style={{
              background: GL,
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 13,
              color: G,
              fontWeight: 600,
            }}
          >
            📦 Livrare estimată: {formatDate(nextDelivery)}
          </div>
        )}

        {addresses?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>Adrese salvate</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    setDel((d) => ({ ...d, addr: a.addr, addrId: a.id }))
                  }
                  style={{
                    background: del.addrId === a.id ? GL : "white",
                    border: `2px solid ${del.addrId === a.id ? G : "#e8e8e8"}`,
                    borderRadius: 12,
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 13,
                    color: "#2D2D2D",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{a.label}</span>
                  <span style={{ color: "#aaa", marginLeft: 8 }}>{a.addr}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <span style={lbl}>Adresă livrare</span>
          <textarea
            value={del.addr}
            onChange={(e) => {
              setDel((d) => ({ ...d, addr: e.target.value, addrId: null }));
              setErrors((err) => ({ ...err, addr: "" }));
            }}
            placeholder="Str. Exemplu nr. 10, Sector 1, București"
            style={{
              ...inp,
              resize: "none",
              minHeight: 70,
              border: errors.addr
                ? "1.5px solid #DC2626"
                : "1.5px solid #e8e8e8",
            }}
          />
          {errors.addr && (
            <p style={{ color: "#DC2626", fontSize: 12, margin: "4px 0 0" }}>
              {errors.addr}
            </p>
          )}
        </div>

        {slots?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>🕐 Interval orar livrare</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setDel((d) => ({ ...d, slot }));
                    setErrors((err) => ({ ...err, slot: "" }));
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    border: `2px solid ${del.slot === slot ? G : "#e8e8e8"}`,
                    background: del.slot === slot ? GL : "white",
                    color: del.slot === slot ? G : "#777",
                    cursor: "pointer",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.slot && (
              <p style={{ color: "#DC2626", fontSize: 12, margin: "4px 0 0" }}>
                {errors.slot}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <span style={lbl}>Metodă de plată</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              ["cash", "💵 Cash la livrare"],
              ["transfer", "🏦 Transfer bancar"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setDel((d) => ({ ...d, pay: val }))}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  border: `2px solid ${del.pay === val ? G : "#e8e8e8"}`,
                  background: del.pay === val ? GL : "white",
                  color: del.pay === val ? G : "#777",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span style={lbl}>Notă pentru Denis (opțional)</span>
          <input
            value={del.note}
            onChange={(e) => setDel((d) => ({ ...d, note: e.target.value }))}
            placeholder="ex: Interfon 42, sună înainte..."
            style={inp}
          />
        </div>

        <div style={{ ...card, marginBottom: 20 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2D2D2D",
              marginBottom: 10,
            }}
          >
            Sumar
          </div>
          {cartItems.map(({ p, q }) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: 13,
                color: "#555",
              }}
            >
              <span>
                {p.name} × {q}
              </span>
              <span style={{ fontWeight: 600 }}>{p.price * q} RON</span>
            </div>
          ))}
          <div style={{ height: 1, background: "#f0f0f0", margin: "8px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontWeight: 800,
              color: "#2D2D2D",
            }}
          >
            <span>Total</span>
            <span style={{ color: G }}>{total} RON</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...btnG({ opacity: loading ? 0.7 : 1 }),
            padding: "18px",
            fontSize: 16,
          }}
        >
          {loading ? "Se procesează..." : "Plasează comanda →"}
        </button>
      </div>
    </div>
  );
}
