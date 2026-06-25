import { useState, useEffect } from "react";
import { G, GL, card } from "../../lib/constants";

export default function AdminDeliveryList({ ctx }) {
  const { storage, nextDelivery, setAdminPage, showToast, findProduct } = ctx;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("products");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await storage.getOrders(false);
      const relevant = (data || []).filter((o) =>
        ["Nouă", "În procesare", "Pregătită"].includes(o.status)
      );
      setOrders(relevant);
      setLoading(false);
    })();
  }, []);

  const deliveryDate = nextDelivery
    ? new Date(nextDelivery).toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Bucharest",
      })
    : "—";
  // Aggregate products
  const productMap = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const p = findProduct(item.product_id);
      const key = item.product_id;
      if (!productMap[key])
        productMap[key] = {
          name: p?.name || key,
          unit: p?.unit || "buc",
          qty: 0,
        };
      productMap[key].qty += item.qty || 1;
    });
  });
  const productList = Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .filter(
      (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
    );

  // By address
  const addressList = orders
    .map((order) => ({
      client: order.profiles?.name || "—",
      phone: order.profiles?.phone || "",
      address: order.addr || "—",
      slot: order.delivery_slot || "—",
      items: order.items || [],
      total: order.total || 0,
      id: order.id,
    }))
    .filter(
      (o) =>
        !search ||
        o.client.toLowerCase().includes(search.toLowerCase()) ||
        o.address.toLowerCase().includes(search.toLowerCase())
    );

  // By client
  const clientMap = {};
  orders.forEach((order) => {
    const key = order.user_id;
    if (!clientMap[key])
      clientMap[key] = {
        name: order.profiles?.name || "—",
        phone: order.profiles?.phone || "",
        orders: [],
        totalItems: 0,
        total: 0,
      };
    clientMap[key].orders.push(order);
    clientMap[key].total += order.total || 0;
    (order.items || []).forEach((i) => {
      clientMap[key].totalItems += i.qty || 1;
    });
  });
  const clientList = Object.values(clientMap).filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const waLink = (phone) => {
    if (!phone) return null;
    const p = (phone.startsWith("0") ? "4" + phone : phone).replace(/\D/g, "");
    return `https://wa.me/${p}`;
  };

  const copyAll = async () => {
    let text = `Lista livrare — ${deliveryDate}\n${"─".repeat(30)}\n\n`;
    if (view === "products") {
      text += "PRODUSE TOTALE:\n";
      productList.forEach((p) => {
        text += `• ${p.name}: ${p.qty} ${p.unit}\n`;
      });
    } else if (view === "addresses") {
      text += "ADRESE:\n";
      addressList.forEach((a) => {
        text += `\n${a.client} — Slot: ${a.slot}\n${a.address}\n`;
        a.items.forEach((i) => {
          const p = findProduct(i.product_id);
          text += `  • ${p?.name || i.product_id}: ${i.qty} ${
            p?.unit || "buc"
          }\n`;
        });
      });
    } else {
      text += "CLIENȚI:\n";
      clientList.forEach((c) => {
        text += `\n${c.name} — ${c.totalItems} produse — ${c.total} RON\n`;
      });
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("Lista copiată!", "✓");
    } catch {
      showToast("Eroare copiere", "!");
    }
  };

  const TABS = [
    { v: "products", l: "Produse" },
    { v: "addresses", l: "Adrese" },
    { v: "clients", l: "Clienți" },
  ];

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
          Listă livrare
        </span>
      </div>

      <div style={{ padding: "12px 18px 0" }}>
        <div
          style={{
            background: GL,
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: G, fontWeight: 700 }}>
              Livrare
            </div>
            <div style={{ fontSize: 13, color: "#2D2D2D", fontWeight: 800 }}>
              {deliveryDate}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#888" }}>
              {orders.length} comenzi
            </div>
            <div style={{ fontSize: 11, color: "#aaa" }}>active</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {TABS.map((t) => (
            <button
              key={t.v}
              onClick={() => setView(t.v)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: `1.5px solid ${view === t.v ? G : "#e8e8e8"}`,
                background: view === t.v ? GL : "white",
                color: view === t.v ? G : "#777",
                cursor: "pointer",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrează..."
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 12,
            fontSize: 13,
            border: "1.5px solid #e8e8e8",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 12,
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            Se încarcă...
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#aaa",
              fontSize: 13,
            }}
          >
            Nicio comandă activă pentru această livrare.
          </div>
        ) : (
          <>
            {view === "products" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {productList.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      ...card,
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: "#2D2D2D",
                        fontWeight: 600,
                      }}
                    >
                      {p.name}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: 16, color: G }}>
                      {p.qty}{" "}
                      <span
                        style={{ fontSize: 12, fontWeight: 400, color: "#888" }}
                      >
                        {p.unit}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {view === "addresses" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {addressList.map((a, i) => (
                  <div key={i} style={{ ...card, padding: "12px 14px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {a.client}
                      </span>
                      <span style={{ fontSize: 11, color: "#888" }}>
                        {a.slot}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#555", marginBottom: 8 }}
                    >
                      📍 {a.address}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        marginBottom: 8,
                      }}
                    >
                      {a.items.map((item, j) => {
                        const p = findProduct(item.product_id);
                        return (
                          <div
                            key={j}
                            style={{
                              fontSize: 12,
                              color: "#666",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>• {p?.name || item.product_id}</span>
                            <span style={{ fontWeight: 600 }}>
                              {item.qty} {p?.unit || "buc"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 700, color: G }}>
                        {a.total} RON
                      </span>
                      {waLink(a.phone) && (
                        <a
                          href={waLink(a.phone)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#25D366",
                            textDecoration: "none",
                            background: "#F0FDF4",
                            padding: "4px 10px",
                            borderRadius: 8,
                          }}
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "clients" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {clientList.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      ...card,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: GL,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14,
                        color: G,
                        flexShrink: 0,
                      }}
                    >
                      {c.name[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {c.orders.length} comandă · {c.totalItems} produse
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: G }}>
                        {c.total} RON
                      </div>
                      {waLink(c.phone) && (
                        <a
                          href={waLink(c.phone)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: 10,
                            color: "#25D366",
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                        >
                          WA
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={copyAll}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "13px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                background: GL,
                color: G,
                border: "none",
                cursor: "pointer",
              }}
            >
              📋 Copiază lista
            </button>
          </>
        )}
      </div>
    </div>
  );
}
