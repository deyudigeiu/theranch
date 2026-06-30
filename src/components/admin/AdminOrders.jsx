import { useState } from "react";
import { G, GL, card, SC } from "../../lib/constants";

const statusOptions = [
  "Nouă",
  "Confirmată",
  "Pre-comandă",
  "Stoc disponibil",
  "În livrare",
  "Livrată",
  "Anulată",
];

export default function AdminOrders({ ctx }) {
  const { orders, setOrders, storage, showToast, findProduct, settings } = ctx;

  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const phone = settings?.whatsapp?.replace(/\s/g, "") || "";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    await storage.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setUpdatingId(null);
    showToast(`Status actualizat: ${status}`, "✓");
  };

  const deleteOrder = async (orderId) => {
    const ok = await storage.deleteOrder(orderId);
    if (ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setExpandedId(null);
      setConfirmDelete(null);
      showToast("Comandă ștearsă", "✓");
    } else {
      showToast("Eroare la ștergere", "❌");
    }
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
          Nicio comandă
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
          Comenzi ({orders.length})
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => {
            const isExpanded = expandedId === o.id;
            const isPreorder = o.status === "Pre-comandă";
            const sc = isPreorder
              ? { bg: "#FEF3C7", c: "#B45309" }
              : SC?.[o.status] || { bg: "#f5f5f5", c: "#888" };
            const clientName =
              o.profiles?.name || o.profiles?.phone || o.user_id?.slice(0, 8);

            return (
              <div key={o.id} style={card}>
                {/* Header - click to expand */}
                <div
                  onClick={() => {
                    setExpandedId(isExpanded ? null : o.id);
                    setConfirmDelete(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
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
                      {clientName && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#777",
                            marginTop: 2,
                          }}
                        >
                          {clientName}
                        </div>
                      )}
                      <div
                        style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}
                      >
                        {formatDate(o.created_at)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.c,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 8,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        {o.status}
                      </span>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: G,
                        }}
                      >
                        {o.total} RON
                      </span>
                    </div>
                  </div>

                  {/* Preview produse (collapsed) */}
                  {!isExpanded && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#aaa",
                        marginTop: 4,
                      }}
                    >
                      {(o.items || [])
                        .slice(0, 2)
                        .map((item) => {
                          const p = findProduct(item.product_id);
                          return p
                            ? `${p.name} ×${item.qty}`
                            : item.product_id;
                        })
                        .join(", ")}
                      {(o.items || []).length > 2 &&
                        ` +${(o.items || []).length - 2} produse`}
                    </div>
                  )}
                </div>

                {/* Detalii expandate */}
                {isExpanded && (
                  <div style={{ marginTop: 12 }}>
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
                        ⏳ Pre-comandă — stocul nu a fost decrementat
                      </div>
                    )}

                    {/* Produse */}
                    <div
                      style={{
                        marginBottom: 12,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 10,
                      }}
                    >
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

                    {/* Info livrare */}
                    {o.addr && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#777",
                          marginBottom: 4,
                        }}
                      >
                        📍 {o.addr}
                      </div>
                    )}
                    {o.delivery_slot && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#777",
                          marginBottom: 4,
                        }}
                      >
                        🕐 {o.delivery_slot}
                      </div>
                    )}
                    {o.pay && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#777",
                          marginBottom: 4,
                        }}
                      >
                        💳 {o.pay === "cash" ? "Cash" : "Transfer bancar"}
                      </div>
                    )}
                    {o.note && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#777",
                          marginBottom: 4,
                        }}
                      >
                        📝 {o.note}
                      </div>
                    )}
                    {o.profiles?.phone && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#777",
                          marginBottom: 4,
                        }}
                      >
                        📞 {o.profiles.phone}
                      </div>
                    )}

                    {/* Status update */}
                    <div style={{ marginTop: 12 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#aaa",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 8,
                        }}
                      >
                        Actualizează status
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        {statusOptions.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(o.id, s)}
                            disabled={o.status === s || updatingId === o.id}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 10,
                              fontSize: 11,
                              fontWeight: 700,
                              border: `1.5px solid ${
                                o.status === s ? G : "#e8e8e8"
                              }`,
                              background: o.status === s ? GL : "white",
                              color: o.status === s ? G : "#555",
                              cursor:
                                o.status === s ? "default" : "pointer",
                              opacity:
                                updatingId === o.id && o.status !== s
                                  ? 0.5
                                  : 1,
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp */}
                    {phone && o.profiles?.phone && (
                      <button
                        onClick={() => {
                          const msg = encodeURIComponent(
                            `Bună! Comanda ta #${o.id} este: ${o.status}.`
                          );
                          window.open(
                            `https://wa.me/${o.profiles.phone.replace(
                              /\D/g,
                              ""
                            )}?text=${msg}`
                          );
                        }}
                        style={{
                          marginTop: 10,
                          background: "#25D366",
                          color: "white",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 14px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        💬 WhatsApp client
                      </button>
                    )}

                    {/* Șterge comanda */}
                    <div style={{ marginTop: 14 }}>
                      {confirmDelete === o.id ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => deleteOrder(o.id)}
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
                            Da, șterge
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
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
                            Anulează
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(o.id)}
                          style={{
                            background: "#FEE2E2",
                            color: "#DC2626",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 14px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          × Șterge comanda
                        </button>
                      )}
                    </div>
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
