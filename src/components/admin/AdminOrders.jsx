import { useState } from "react";
import { G, GL, card, SC, inp } from "../../lib/constants";

export default function AdminOrders({ ctx }) {
  const { orders, setOrders, storage, showToast, setAdminPage, findProduct } =
    ctx;

  const [filter, setFilter] = useState("toate");
  const [expandedId, setExpandedId] = useState(null);

  const statusOptions = [
    "toate",
    "Nouă",
    "În procesare",
    "Pregătită",
    "Livrată",
    "Anulată",
  ];

  const filtered =
    filter === "toate" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (orderId, status) => {
    await storage.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Comandă → ${status}`, "✓");
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

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
          onClick={() => setAdminPage("dash")}
          style={{
            background: "none",
            border: "none",
            color: G,
            fontSize: 15,
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
          }}
        >
          ‹ Înapoi
        </button>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D" }}>
          Comenzi ({filtered.length})
        </span>
      </div>

      {/* Filtre status */}
      <div
        style={{
          padding: "12px 18px 4px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
        }}
      >
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              background: filter === s ? G : "white",
              color: filter === s ? "white" : "#555",
              border: filter === s ? "none" : "1.5px solid #e8e8e8",
              borderRadius: 20,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: "12px 18px 0",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "#bbb",
              fontSize: 14,
            }}
          >
            Nicio comandă
          </div>
        ) : (
          filtered.map((o) => {
            const sc = SC?.[o.status] || { bg: "#f5f5f5", c: "#888" };
            const expanded = expandedId === o.id;
            return (
              <div key={o.id} style={card}>
                {/* Header */}
                <div
                  onClick={() => setExpandedId(expanded ? null : o.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#2D2D2D",
                      }}
                    >
                      #{o.id}
                    </div>
                    <span
                      style={{
                        background: sc.bg,
                        color: sc.c,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 8,
                      }}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#aaa" }}>
                      {formatDate(o.created_at)}
                    </span>
                    <span style={{ fontWeight: 800, color: G }}>
                      {o.total} RON
                    </span>
                  </div>
                  {o.profiles?.name && (
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      👤 {o.profiles.name}{" "}
                      {o.profiles.phone ? `· ${o.profiles.phone}` : ""}
                    </div>
                  )}
                </div>

                {/* Detalii expandate */}
                {expanded && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
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

                    {o.addr && (
                      <div
                        style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}
                      >
                        📍 {o.addr}
                      </div>
                    )}
                    {o.delivery_slot && (
                      <div
                        style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}
                      >
                        🕐 {o.delivery_slot}
                      </div>
                    )}
                    {o.pay && (
                      <div
                        style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}
                      >
                        💳 {o.pay}
                      </div>
                    )}
                    {o.note && (
                      <div
                        style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}
                      >
                        📝 {o.note}
                      </div>
                    )}
                    {o.promo && (
                      <div
                        style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}
                      >
                        🎉 Promo: {o.promo}
                      </div>
                    )}

                    {/* Notă client */}
                    <textarea
                      defaultValue={o.clientNotes || ""}
                      placeholder="Notă despre client (vizibilă doar Denis)..."
                      onBlur={async (e) => {
                        await storage.updateClientNote(
                          o.user_id,
                          e.target.value
                        );
                        showToast("Notă salvată", "📌");
                      }}
                      style={{
                        ...inp,
                        resize: "none",
                        minHeight: 50,
                        marginTop: 8,
                        marginBottom: 12,
                        fontSize: 12,
                      }}
                    />

                    {/* Schimbă status */}
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#bbb",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Schimbă status
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {[
                        "Nouă",
                        "În procesare",
                        "Pregătită",
                        "Livrată",
                        "Anulată",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(o.id, s)}
                          style={{
                            background: o.status === s ? G : "white",
                            color: o.status === s ? "white" : "#555",
                            border: `1.5px solid ${
                              o.status === s ? G : "#e8e8e8"
                            }`,
                            borderRadius: 10,
                            padding: "6px 12px",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
