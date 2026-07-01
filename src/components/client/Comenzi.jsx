import { useState } from "react";
import { G, GL, card, SC, btnG } from "../../lib/constants";

export default function Comenzi({ ctx }) {
  const {
    orders,
    setOrders,
    setPage,
    showToast,
    settings,
    findProduct,
    addToCart,
    editOrder,
  } = ctx;

  const [cancelling, setCancelling] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const phone = settings?.whatsapp?.replace(/\s/g, "") || "";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const reorder = async (order) => {
    for (const item of order.items || []) {
      await addToCart(item.product_id, item.qty);
    }
    setPage("cos");
  };

  const startClientEdit = (order) => {
    setEditingId(order.id);
    setEditDraft({
      items: (order.items || []).map((i) => ({ ...i })),
      pay: order.pay || "cash",
    });
  };

  const saveClientEdit = async (order) => {
    setSaving(true);
    const total = editDraft.items.reduce((s, item) => {
      const p = findProduct(item.product_id);
      return s + (p ? p.price * item.qty : 0);
    }, 0);
    const updated = await editOrder(order.id, {
      items: editDraft.items,
      pay: editDraft.pay,
      total,
    });
    setSaving(false);
    if (updated) {
      setEditingId(null);
      setEditDraft(null);
      showToast("Comanda actualizată", "✓");
    } else {
      showToast("Eroare la actualizare", "❌");
    }
  };

  // CRITIC FIX #5: use editOrder (with audit trail) instead of storage.updateOrderStatus directly
  const cancelPreorder = async (orderId) => {
    const updated = await editOrder(orderId, { status: "Anulată" });
    if (updated) {
      setCancelling(null);
      showToast("Pre-comandă anulată", "✓");
    } else {
      showToast("Eroare la anulare", "❌");
    }
  };

  const Header = () => (
    <div
      style={{
        padding: "14px 18px 0",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <button
        onClick={() => setPage("home")}
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
        Comenzile mele
      </span>
    </div>
  );

  if (orders.length === 0)
    return (
      <div>
        <Header />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 64 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D" }}>
            Nicio comandă încă
          </div>
          <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", margin: 0 }}>
            Comenzile tale vor apărea aici
          </p>
          <button
            onClick={() => setPage("produse")}
            style={{ ...btnG({ width: "auto", padding: "14px 28px" }) }}
          >
            Comandă acum
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((o) => {
            const isPreorder = o.status === "Pre-comandă";
            const sc = isPreorder
              ? { bg: "#FEF3C7", c: "#B45309" }
              : SC?.[o.status] || { bg: "#f5f5f5", c: "#888" };

            return (
              <div key={o.id} style={card}>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#2D2D2D",
                      }}
                    >
                      #{o.id}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                      {formatDate(o.created_at)}
                    </div>
                  </div>
                  <span
                    style={{
                      background: sc.bg,
                      color: sc.c,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 8,
                    }}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Info pre-comandă */}
                {isPreorder && (
                  <div
                    style={{
                      background: "#FEF3C7",
                      borderRadius: 8,
                      padding: "8px 10px",
                      marginBottom: 10,
                      fontSize: 12,
                      color: "#92400E",
                    }}
                  >
                    ⏳ Va fi livrată când apare stocul. Plata a fost înregistrată.
                  </div>
                )}

                {/* Produse */}
                <div style={{ marginBottom: 10 }}>
                  {(o.items || []).map((item, i) => {
                    const p = findProduct(item.product_id);
                    const name = p?.name || item.product_id;
                    const price = p?.price ?? 0;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          color: "#555",
                          marginBottom: 4,
                        }}
                      >
                        <span>
                          {name} × {item.qty}
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          {price * item.qty} RON
                        </span>
                      </div>
                    );
                  })}
                </div>

                {o.delivery_slot && (
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>
                    🕐 {o.delivery_slot}
                  </div>
                )}
                {o.addr && (
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>
                    📍 {o.addr}
                  </div>
                )}

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 10,
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 800, color: G }}>
                    {o.total} RON
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {phone && (
                      <button
                        onClick={() => {
                          const msg = encodeURIComponent(
                            `Bună! Am o întrebare despre comanda #${o.id}.`
                          );
                          window.open(
                            `https://wa.me/${phone.replace("+", "")}?text=${msg}`
                          );
                        }}
                        style={{
                          background: "#25D366",
                          color: "white",
                          border: "none",
                          borderRadius: 10,
                          padding: "7px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        💬
                      </button>
                    )}
                    {!isPreorder && (
                      <button
                        onClick={() => {
                          reorder(o);
                          showToast("Produsele au fost adăugate!", "🔄");
                        }}
                        style={{
                          background: GL,
                          color: G,
                          border: "none",
                          borderRadius: 10,
                          padding: "7px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🔄 Comandă din nou
                      </button>
                    )}
                  </div>
                </div>

                {/* Editare comanda (doar status Noua) */}
                {o.status === "Nouă" && editingId !== o.id && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => startClientEdit(o)}
                      style={{ background: GL, color: G, border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      ✏️ Modifică comanda
                    </button>
                  </div>
                )}

                {/* Panoul de editare client */}
                {editingId === o.id && editDraft && (
                  <div style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                    <div style={{ fontSize: 12, color: G, fontWeight: 600, marginBottom: 10 }}>
                      ✏️ Editezi comanda — poți modifica cantitățile și plata
                    </div>

                    {editDraft.items.map((item, idx) => {
                      const p = findProduct(item.product_id);
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ flex: 1, fontSize: 13, color: "#2D2D2D" }}>{p?.name || item.product_id}</span>
                          <button
                            onClick={() => setEditDraft((d) => {
                              const items = [...d.items];
                              items[idx] = { ...items[idx], qty: Math.max(1, items[idx].qty - 1) };
                              return { ...d, items };
                            })}
                            style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #e8e8e8", background: "white", fontSize: 16, cursor: "pointer" }}
                          >−</button>
                          <span style={{ fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                          <button
                            onClick={() => setEditDraft((d) => {
                              const items = [...d.items];
                              items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
                              return { ...d, items };
                            })}
                            style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #e8e8e8", background: "white", fontSize: 16, cursor: "pointer" }}
                          >+</button>
                        </div>
                      );
                    })}

                    <div style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 12 }}>
                      {[{ v: "cash", l: "💵 Cash" }, { v: "transfer", l: "🏦 Transfer" }].map(({ v, l }) => (
                        <button
                          key={v}
                          onClick={() => setEditDraft((d) => ({ ...d, pay: v }))}
                          style={{
                            padding: "6px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                            border: `1.5px solid ${editDraft.pay === v ? G : "#e8e8e8"}`,
                            background: editDraft.pay === v ? GL : "white",
                            color: editDraft.pay === v ? G : "#555", cursor: "pointer",
                          }}
                        >{l}</button>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => saveClientEdit(o)}
                        disabled={saving}
                        style={{ flex: 2, background: G, color: "white", border: "none", borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}
                      >
                        {saving ? "Se salvează..." : "✓ Salvează"}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditDraft(null); }}
                        style={{ flex: 1, background: "#f5f5f5", color: "#555", border: "none", borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                      >
                        Renunță
                      </button>
                    </div>
                  </div>
                )}

                {/* Anulare pre-comandă */}
                {isPreorder && o.status === "Pre-comandă" && (
                  <div style={{ marginTop: 10 }}>
                    {cancelling === o.id ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => cancelPreorder(o.id)}
                          style={{
                            flex: 1,
                            background: "#DC2626",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            padding: "9px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Da, anulează
                        </button>
                        <button
                          onClick={() => setCancelling(null)}
                          style={{
                            flex: 1,
                            background: "#f5f5f5",
                            color: "#555",
                            border: "none",
                            borderRadius: 10,
                            padding: "9px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Păstrează
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelling(o.id)}
                        style={{
                          background: "none",
                          color: "#DC2626",
                          border: "1.5px solid #DC2626",
                          borderRadius: 10,
                          padding: "7px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        × Anulează pre-comanda
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
