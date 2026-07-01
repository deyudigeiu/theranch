import { G, GL, card, sectHdr } from "../../lib/constants";

export default function AdminHome({ ctx }) {
  const {
    orders,
    products,
    clients,
    settings,
    countdown,
    nextDelivery,
    setAdminPage,
    showToast,
  } = ctx;
  // MEDIU FIX #6: clients vine din ctx (App.jsx îl încarcă o singură dată), nu re-fetchat local

  const newOrders = orders.filter((o) => o.status === "Nouă");
  const preOrders = orders.filter((o) => o.status === "Pre-comandă");
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

  const hasUrgent = newOrders.length > 0 || preOrders.length > 0;
  const cardBg = newOrders.length > 0
    ? "#FEF2F2"
    : preOrders.length > 0
    ? "#FFFBEB"
    : "white";
  const cardBorder = newOrders.length > 0
    ? "1.5px solid #FCA5A5"
    : preOrders.length > 0
    ? "1.5px solid #FCD34D"
    : "none";


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
        ⚙️ Panou Admin
      </div>

      <div style={{ padding: "16px 18px 8px" }}>
        {/* Comenzi noi + pre-comenzi + total */}
        <div
          style={{
            ...card,
            marginBottom: 10,
            background: cardBg,
            border: cardBorder,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            {/* Comenzi noi */}
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

            {/* Pre-comenzi */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Pre-comenzi
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: preOrders.length > 0 ? "#B45309" : "#ccc",
                }}
              >
                {preOrders.length}
              </div>
            </div>

            {/* Total luna */}
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

          {preOrders.length > 0 && (
            <button
              onClick={() => setAdminPage("orders")}
              style={{
                width: "100%",
                marginTop: newOrders.length > 0 ? 6 : 10,
                background: "#FEF3C7",
                color: "#B45309",
                border: "none",
                borderRadius: 12,
                padding: "10px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⏳ {preOrders.length} pre-{preOrders.length === 1 ? "comandă" : "comenzi"} în așteptare →
            </button>
          )}
        </div>

        {/* Stocuri critice */}
        {lowStock.length > 0 && (
          <div style={{ ...card, marginBottom: 10 }}>
            <p style={{ ...sectHdr, marginBottom: 8 }}>⚠️ Stocuri critice</p>
            {lowStock.map((p) => (
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
                    {p.stock} × {p.unit}
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

      </div>
    </div>
  );
}
