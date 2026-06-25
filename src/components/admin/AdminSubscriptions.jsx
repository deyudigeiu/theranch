import { useState, useEffect } from "react";
import { G, GL, card, sectHdr } from "../../lib/constants";

export default function AdminSubscriptions({ ctx }) {
  const { storage, setAdminPage, showToast } = ctx;

  const [basketSubs, setBasketSubs] = useState([]);
  const [productSubs, setProductSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [basket, allSubs] = await Promise.all([
        storage.getBasketSubscriptions(),
        storage.getAllSubscriptions(),
      ]);
      setBasketSubs(basket || []);
      setProductSubs(allSubs || []);
      setLoading(false);
    })();
  }, []);

  const q = search.toLowerCase();

  const filteredBasket = basketSubs.filter(
    (s) =>
      !q ||
      (s.name || "").toLowerCase().includes(q) ||
      (s.phone || "").includes(q)
  );

  const filteredProducts = productSubs.filter(
    (s) =>
      !q ||
      (s.profiles?.name || "").toLowerCase().includes(q) ||
      (s.products?.name || "").toLowerCase().includes(q)
  );

  const toggleBasket = async (sub) => {
    await storage.toggleBasketSubscription(sub.user_id, !sub.active);
    setBasketSubs((arr) =>
      arr.map((s) =>
        s.user_id === sub.user_id ? { ...s, active: !s.active } : s
      )
    );
    showToast(sub.active ? "Abonament pausat" : "Abonament activat", "✓");
  };

  const toggleProduct = async (sub) => {
    await storage.updateSubscription(sub.id, { active: !sub.active });
    setProductSubs((arr) =>
      arr.map((s) => (s.id === sub.id ? { ...s, active: !s.active } : s))
    );
    showToast(sub.active ? "Abonament pausat" : "Abonament activat", "✓");
  };

  const waLink = (phone) => {
    if (!phone) return null;
    const ph = (phone.startsWith("0") ? "4" + phone : phone).replace(/\D/g, "");
    return `https://wa.me/${ph}`;
  };

  const BasketCard = ({ sub }) => {
    const wa = waLink(sub.phone);
    return (
      <div style={{ ...card, padding: "12px 14px", marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: sub.active ? GL : "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: sub.active ? G : "#bbb",
              flexShrink: 0,
            }}
          >
            {(sub.name || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#2D2D2D",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {sub.name || "—"}
            </div>
            {sub.phone && (
              <div style={{ fontSize: 11, color: "#888" }}>{sub.phone}</div>
            )}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: 20,
              background: sub.active ? "#DCFCE7" : "#F5F5F5",
              color: sub.active ? "#16A34A" : "#aaa",
            }}
          >
            {sub.active ? "Activ" : "Pausat"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => toggleBasket(sub)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              border: `1.5px solid ${sub.active ? "#FCA5A5" : G}`,
              background: sub.active ? "#FEF2F2" : GL,
              color: sub.active ? "#DC2626" : G,
              cursor: "pointer",
            }}
          >
            {sub.active ? "Pausează" : "Activează"}
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  };

  const ProductCard = ({ sub }) => {
    const wa = waLink(sub.profiles?.phone);
    const name = sub.profiles?.name || "—";
    return (
      <div style={{ ...card, padding: "12px 14px", marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: sub.active ? GL : "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: sub.active ? G : "#bbb",
              flexShrink: 0,
            }}
          >
            {name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#2D2D2D" }}>
              {name}
            </div>
            {sub.profiles?.phone && (
              <div style={{ fontSize: 11, color: "#888" }}>
                {sub.profiles.phone}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: 20,
              background: sub.active ? "#DCFCE7" : "#F5F5F5",
              color: sub.active ? "#16A34A" : "#aaa",
            }}
          >
            {sub.active ? "Activ" : "Pausat"}
          </div>
        </div>
        <div
          style={{
            background: "#f9f9f9",
            borderRadius: 10,
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 12, color: "#555" }}>
            {sub.products?.name || sub.product_id}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: G }}>
            x{sub.qty} {sub.products?.unit || "buc"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => toggleProduct(sub)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              border: `1.5px solid ${sub.active ? "#FCA5A5" : G}`,
              background: sub.active ? "#FEF2F2" : GL,
              color: sub.active ? "#DC2626" : G,
              cursor: "pointer",
            }}
          >
            {sub.active ? "Pausează" : "Activează"}
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    );
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
          Abonamente
        </span>
      </div>

      <div style={{ padding: "12px 18px 0" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            {
              label: "Abonați coș",
              value: basketSubs.filter((s) => s.active).length,
              accent: G,
            },
            {
              label: "Produse",
              value: productSubs.filter((s) => s.active).length,
              accent: "#555",
            },
            {
              label: "Pausate",
              value: [...basketSubs, ...productSubs].filter((s) => !s.active)
                .length,
              accent: "#bbb",
            },
          ].map((st) => (
            <div
              key={st.label}
              style={{
                flex: 1,
                ...card,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 20, color: st.accent }}>
                {st.value}
              </div>
              <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
                {st.label}
              </div>
            </div>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută client..."
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 12,
            fontSize: 13,
            border: "1.5px solid #e8e8e8",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            Se încarcă...
          </div>
        ) : (
          <>
            {/* Coșul Lunii */}
            <div
              style={{
                background: `linear-gradient(135deg,${G} 0%,#3a6347 100%)`,
                borderRadius: 16,
                padding: "14px 16px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: 15,
                  marginBottom: 2,
                }}
              >
                🌾 Coșul Lunii
              </div>
              <div style={{ color: "rgba(255,255,255,.8)", fontSize: 12 }}>
                {basketSubs.filter((s) => s.active).length} abonați activi din{" "}
                {basketSubs.length} total
              </div>
            </div>

            {filteredBasket.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px 0 8px",
                  color: "#aaa",
                  fontSize: 13,
                }}
              >
                Niciun abonat la Coșul Lunii
              </div>
            ) : (
              filteredBasket.map((sub) => (
                <BasketCard key={sub.user_id} sub={sub} />
              ))
            )}

            {/* Abonamente produse */}
            {filteredProducts.length > 0 && (
              <>
                <p style={{ ...sectHdr, marginTop: 20 }}>Abonamente produse</p>
                {filteredProducts.map((sub) => (
                  <ProductCard key={sub.id} sub={sub} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
