import { useState, useEffect } from "react";
import { G, GL } from "../../lib/constants";

export default function CosBaza({ ctx }) {
  const {
    appConfig,
    products,
    settings,
    addToCart,
    showToast,
    setPage,
    profile,
    storage,
    findProduct,
  } = ctx;

  const cosLunii = appConfig?.cos_lunii;
  const [basketSub, setBasketSub] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    storage.isSubscribedToBasket().then(setBasketSub);
  }, [profile]);

  const handleSubscribe = async () => {
    if (!profile) {
      showToast("Autentifică-te pentru a te abona", "⚠️");
      return;
    }
    setSubLoading(true);
    if (basketSub) {
      await storage.unsubscribeFromBasket();
      setBasketSub(false);
      showToast("Abonament anulat", "✓");
    } else {
      await storage.subscribeToBasket();
      setBasketSub(true);
      showToast("Te-ai abonat la Coșul Lunii!", "🌾");
    }
    setSubLoading(false);
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
          Coșul Lunii
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        {!cosLunii?.active || !cosLunii?.items?.length ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#bbb",
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            Coșul Lunii nu este disponibil momentan.
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg,${G} 0%,#3a6347 100%)`,
                padding: "20px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,.7)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                🛒 Coșul Lunii
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  color: "white",
                  marginBottom: 4,
                }}
              >
                {cosLunii.title}
              </div>
              {cosLunii.description && (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)" }}>
                  {cosLunii.description}
                </div>
              )}
            </div>

            <div style={{ padding: "16px 18px 20px" }}>
              {cosLunii.items.map((item, i) => {
                const p = findProduct(item.product_id);
                if (!p) return null;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#2D2D2D" }}>
                        {p.images?.[0] && (
                          <span style={{ marginRight: 8 }}>{p.images[0]}</span>
                        )}
                        {p.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                        {item.qty} × {p.price} RON
                      </div>
                    </div>
                    <span style={{ color: G, fontWeight: 700, fontSize: 14 }}>
                      {p.price * item.qty} RON
                    </span>
                  </div>
                );
              })}

              {cosLunii.price > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 14, color: "#888" }}>Preț coș</span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: G }}>
                    {cosLunii.price} RON
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  if (settings?.shopOpen === false) {
                    showToast("Magazinul este momentan închis", "🔒");
                    return;
                  }
                  cosLunii.items.forEach((item) =>
                    addToCart(item.product_id, item.qty)
                  );
                  showToast("Coșul Lunii adăugat!", "🛒");
                }}
                style={{
                  width: "100%",
                  marginTop: 16,
                  background: G,
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Adaugă tot în coș →
              </button>

              <button
                onClick={handleSubscribe}
                disabled={subLoading}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: basketSub ? "#f0f9f1" : "transparent",
                  color: basketSub ? G : "#555",
                  border: `1.5px solid ${basketSub ? G : "#d0d0d0"}`,
                  borderRadius: 14,
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {subLoading
                  ? "..."
                  : basketSub
                  ? "✓ Abonat la Coșul Lunii · Anulează"
                  : "🔔 Abonează-mă la Coșul Lunii"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
