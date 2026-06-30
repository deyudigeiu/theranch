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
    storage,
  } = ctx;

  const [cancelling, setCancelling] = useState(null);
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

  const cancelPreorder = async (orderId) => {
    await storage.updateOrderStatus(orderId, "Anulată");
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Anulată" } : o))
    );
    setCancelling(null);
    showToast("Pre-comandă anulată", "✓");
  };

  if (orders.length === 0)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
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
          Comenzile mele
        </h2>
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
                            `Bună Denis! Am o întrebare despre comanda #${o.id}.`
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
