import { useState, useEffect } from "react";
import { G, GL, card, sectHdr } from "../../lib/constants";

export default function AdminHome({ ctx }) {
  const {
    orders,
    products,
    settings,
    countdown,
    nextDelivery,
    storage,
    setAdminPage,
    showToast,
  } = ctx;

  const [clients, setClients] = useState([]);

  useEffect(() => {
    storage.getClients().then((data) => setClients(data || []));
  }, []);

  const newOrders = orders.filter((o) => o.status === "Nouă");
  const monthlyTotal = orders.reduce((s, o) => s + (o.total || 0), 0);
  const lowStock = products
    .filter((p) => p.active && p.stock < 5)
    .sort((a, b) => a.stock - b.stock);

  const inactiveMonths = settings?.inactiveMonths || 2;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - inactiveMonths);
  const inactiveClients = clients.filter((c) => {
    const last = orders
      .filter((o) => o.user_id === c.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    return !last || new Date(last.created_at) < cutoffDate;
  });

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
        })
      : "—";

  const modules = [
    { id: "orders", e: "📋", t: "Comenzi", c: `${newOrders.length} noi` },
    { id: "products", e: "📦", t: "Produse", c: `${products.length} total` },
    { id: "clients", e: "👥", t: "Clienți", c: `${clients.length} total` },
    { id: "deliveryList", e: "🚚", t: "Listă livrare", c: "generează" },
    { id: "cosBaza", e: "🛒", t: "Coșul Lunii", c: "editare" },
    { id: "broadcast", e: "📢", t: "Broadcast", c: "WhatsApp" },
    { id: "analytics", e: "📊", t: "Analytics", c: "statistici" },
    { id: "content", e: "✏️", t: "Conținut", c: "texte & module" },
    { id: "settings", e: "⚙️", t: "Setări", c: "general" },
    { id: "about", e: "🌾", t: "Despre", c: "editare" },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{
          background: "#FEF3CD",
          padding: "10px 18px",
          fontSize: 13,
          color: "#B45309",
          fontWeight: 700,
        }}
      >
        ⚙️ Panou Admin — Denis
      </div>

      <div style={{ padding: "16px 18px 8px" }}>
        {/* Comenzi noi + total */}
        <div
          style={{
            ...card,
            marginBottom: 10,
            background: newOrders.length > 0 ? "#FEF2F2" : "white",
            border: newOrders.length > 0 ? "1.5px solid #FCA5A5" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Comenzi noi
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: newOrders.length > 0 ? "#DC2626" : G,
                }}
              >
                {newOrders.length}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Total luna aceasta
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#2D2D2D" }}>
                {monthlyTotal} RON
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div
              style={{
                flex: 1,
                background: "#f9f9f9",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
              }}
            >
              <span style={{ color: "#aaa" }}>Livrare: </span>
              <span style={{ fontWeight: 700, color: "#2D2D2D" }}>
                {formatDate(nextDelivery)}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                background: "#f9f9f9",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
              }}
            >
              <span style={{ color: "#aaa" }}>Cutoff: </span>
              <span style={{ fontWeight: 700, color: "#2D2D2D" }}>
                {countdown || "—"}
              </span>
            </div>
          </div>
          {newOrders.length > 0 && (
            <button
              onClick={() => setAdminPage("orders")}
              style={{
                width: "100%",
                marginTop: 10,
                background: "#DC2626",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "10px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📋 Vezi cele {newOrders.length} comenzi noi →
            </button>
          )}
        </div>

        {/* Stocuri critice */}
        {lowStock.length > 0 && (
          <div style={{ ...card, marginBottom: 10 }}>
            <p style={{ ...sectHdr, marginBottom: 8 }}>⚠️ Stocuri critice</p>
            {lowStock.slice(0, 3).map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#555", fontSize: 13 }}>{p.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      background: "#FEE2E2",
                      color: "#DC2626",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {p.stock} {p.unit}
                  </span>
                  <button
                    onClick={() => setAdminPage("products")}
                    style={{
                      background: GL,
                      color: G,
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
            {lowStock.length > 3 && (
              <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
                +{lowStock.length - 3} alte produse cu stoc scăzut
              </div>
            )}
          </div>
        )}

        {/* Clienți inactivi */}
        {inactiveClients.length > 0 && (
          <div style={{ ...card, marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <p style={{ ...sectHdr, margin: 0 }}>
                👤 Clienți inactivi ({inactiveClients.length})
              </p>
              <button
                onClick={() => setAdminPage("clients")}
                style={{
                  background: "none",
                  border: "none",
                  color: G,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Vezi toți →
              </button>
            </div>
            {inactiveClients.slice(0, 2).map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#555", fontSize: 13 }}>{c.name}</span>
                <button
                  onClick={() => {
                    const msg = encodeURIComponent(
                      `Bună ${c.name}, te-am ratat! Avem produse proaspete luna asta 🌿`
                    );
                    const phone = (c.phone || "").replace(/\D/g, "");
                    const waPhone = phone.startsWith("0") ? "4" + phone : phone;
                    if (waPhone)
                      window.open(`https://wa.me/${waPhone}?text=${msg}`);
                    else showToast("Clientul nu are telefon salvat", "⚠️");
                  }}
                  style={{
                    background: "#25D366",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  💬 WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Grid module */}
        <p style={sectHdr}>Administrare</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setAdminPage(m.id)}
              style={{
                ...card,
                padding: 14,
                textAlign: "left",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 6 }}>{m.e}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#2D2D2D",
                  marginBottom: 2,
                }}
              >
                {m.t}
              </div>
              <div style={{ color: "#aaa", fontSize: 11 }}>{m.c}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
