import { G, GL, card, SC, btnG } from "../../lib/constants";

export default function Comenzi({ ctx }) {
  const { orders, setPage, showToast, settings, findProduct, addToCart } = ctx;

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
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            margin: 0,
          }}
        >
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
            const sc = SC?.[o.status] || { bg: "#f5f5f5", c: "#888" };
            return (
              <div key={o.id} style={card}>
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
                            `https://wa.me/${phone.replace(
                              "+",
                              ""
                            )}?text=${msg}`
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
                      🔄 Comandă din nou{" "}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
