import { useState } from "react";
import { G, GL, card, btnG, inp } from "../../lib/constants";
import ImgBox from "../shared/ImgBox";

export default function Cos({ ctx }) {
  const {
    cart,
    products,
    setCartQty,
    showToast,
    setPage,
    findCategory,
    settings,
    deliveryConfig,
  } = ctx;

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const cartItems = (cart || [])
    .map(({ product_id, qty }) => ({
      p: products.find((pr) => pr.id === product_id),
      q: qty,
    }))
    .filter((item) => item.p);

  const subtotal = cartItems.reduce((sum, { p, q }) => sum + p.price * q, 0);
  const promoDisc = 0;
  const shipping = deliveryConfig?.fee ?? settings?.shipping ?? 15;
  const shipFree =
    subtotal >= (deliveryConfig?.freeAt ?? settings?.shipFreeAt ?? 150);
  const total = subtotal - promoDisc + (shipFree ? 0 : shipping);

  if (cartItems.length === 0)
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
        <div style={{ fontSize: 64 }}>🛒</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D" }}>
          Coșul e gol
        </div>
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            margin: 0,
          }}
        >
          Adaugă produse din magazin
        </p>
        <button
          onClick={() => setPage("produse")}
          style={{ ...btnG({ width: "auto", padding: "14px 28px" }) }}
        >
          Vezi produse
        </button>
      </div>
    );

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: "16px 18px 0" }}>
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: 18,
            fontWeight: 800,
            color: "#2D2D2D",
          }}
        >
          Coșul meu ({cartItems.length})
        </h2>

        {/* Produse */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {cartItems.map(({ p, q }) => {
            const c = findCategory(p.cat_id);
            return (
              <div
                key={p.id}
                style={{
                  ...card,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <ImgBox src={p.images?.[0]} bg={c.bg} size={52} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#2D2D2D",
                      marginBottom: 2,
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{p.unit}</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: G,
                      marginTop: 2,
                    }}
                  >
                    {p.price * q} RON
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => setCartQty(p.id, q - 1)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#f0f0f0",
                      border: "none",
                      fontSize: 16,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {q}
                  </span>
                  <button
                    onClick={() => setCartQty(p.id, q + 1)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#f5fdf5",
                      border: "none",
                      fontSize: 16,
                      cursor: "pointer",
                      color: G,
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cod promoțional */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2D2D2D",
              marginBottom: 10,
            }}
          >
            Cod promoțional
          </div>
          {appliedPromo ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: "#ECFDF5",
                  color: "#059669",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 8,
                }}
              >
                ✓ {appliedPromo}
              </span>
              <button
                onClick={() => setAppliedPromo(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#DC2626",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Elimină
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Introdu codul..."
                style={{ ...inp, flex: 1 }}
              />
              <button
                onClick={() => showToast("Niciun cod activ momentan", "ℹ️")}
                style={{
                  background: G,
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "0 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Aplică
              </button>
            </div>
          )}
        </div>

        {/* Sumar */}
        <div style={{ ...card, marginBottom: 20 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Sumar comandă
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#555",
              }}
            >
              <span>Subtotal</span>
              <span>{subtotal} RON</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#555",
              }}
            >
              <span>Livrare</span>
              <span>
                {shipFree ? (
                  <span style={{ color: "#059669" }}>Gratuită</span>
                ) : (
                  `${shipping} RON`
                )}
              </span>
            </div>
            <div
              style={{ height: 1, background: "#f0f0f0", margin: "4px 0" }}
            />
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
        </div>

        {total < (settings?.minOrder || 50) ? (
          <div
            style={{
              background: "#FEF3CD",
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 14,
              fontSize: 13,
              color: "#B45309",
              textAlign: "center",
            }}
          >
            Comandă minimă: {settings?.minOrder || 50} RON (mai ai{" "}
            {(settings?.minOrder || 50) - total} RON)
          </div>
        ) : (
          <button
            onClick={() => setPage("checkout")}
            style={{ ...btnG(), padding: "18px", fontSize: 16 }}
          >
            Comandă acum — {total} RON →
          </button>
        )}
      </div>
    </div>
  );
}
