import { useState } from "react";
import { G, GL, BG, card, btnG } from "../../lib/constants";
import ImgBox from "../shared/ImgBox";
import QA from "../shared/QA";

export default function Detail({ ctx }) {
  const {
    selectedProduct: sp,
    cart,
    wishlist,
    reviews,
    findCategory,
    findProduct,
    addToCart,
    setCartQty,
    toggleWishlist,
    setNotifyWhenAvailable,
    showToast,
    setPage,
    storage,
  } = ctx;

  const [dQty, setDQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  if (!sp) {
    setPage("produse");
    return null;
  }

  const c = findCategory(sp.cat_id);
  const inWishlist = wishlist?.some((w) => w.product_id === sp.id);
  const myReview = reviews?.find((r) => r.product_id === sp.id);
  const images = sp.images || ["📦"];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div
        style={{
          padding: "14px 18px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => setPage("produse")}
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
        <span
          style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D", flex: 1 }}
        >
          {sp.name}
        </span>
        <button
          onClick={() => toggleWishlist(sp.id)}
          style={{
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          {inWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Imagine */}
      <div
        style={{
          margin: "14px 18px 0",
          height: 200,
          background: c.bg,
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImgBox src={images[imgIdx]} bg={c.bg} size={160} radius={0} />
      </div>
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 10,
          }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setImgIdx(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                cursor: "pointer",
                background: i === imgIdx ? G : "#ddd",
              }}
            />
          ))}
        </div>
      )}

      {/* Info produs */}
      <div style={{ padding: "16px 18px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: G }}>
              {sp.price} RON
            </div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{sp.unit}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 12,
                color:
                  sp.stock > 5
                    ? "#16A34A"
                    : sp.stock > 0
                    ? "#F59E0B"
                    : "#DC2626",
                fontWeight: 700,
              }}
            >
              {sp.stock > 5
                ? "În stoc"
                : sp.stock > 0
                ? `Doar ${sp.stock} ${sp.unit}`
                : "Epuizat"}
            </div>
          </div>
        </div>

        {/* Tags */}
        {sp.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {sp.tags.map((t) => (
              <span
                key={t}
                style={{
                  background: GL,
                  color: G,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 10,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Descriere */}
        {sp.description && (
          <div style={{ ...card, marginBottom: 12 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#555",
                lineHeight: 1.6,
              }}
            >
              {sp.description}
            </p>
          </div>
        )}

        {/* Bundle items */}
        {sp.bundle && sp.bundle_items?.length > 0 && (
          <div style={{ ...card, marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              📦 Conținut pachet
            </div>
            {sp.bundle_items.map((item, i) => {
              const p = findProduct(item.product_id);
              return p ? (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#555", fontSize: 13 }}>
                    {p.name} × {item.qty}
                  </span>
                  <span style={{ color: "#aaa", fontSize: 12 }}>
                    {p.price * item.qty} RON
                  </span>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* Pre-comandă */}
        {sp.preorder && (
          <div
            style={{
              background: "#EEF2FE",
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#3B4FCC", fontWeight: 600 }}>
              📅 Disponibil din{" "}
              {sp.preorder_date
                ? new Date(sp.preorder_date).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        )}

        {/* Nutriție */}
        {sp.nutrition && (
          <div style={{ ...card, marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Valori nutriționale
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
              {sp.nutrition}
            </p>
          </div>
        )}

        {/* Origine */}
        {sp.origin && (
          <div style={{ ...card, marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Origine
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
              🌿 {sp.origin}
            </p>
          </div>
        )}

        {/* Recenzia mea */}
        {myReview && (
          <div style={{ ...card, marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Recenzia ta
            </div>
            <div style={{ fontSize: 18 }}>{"⭐".repeat(myReview.rating)}</div>
            {myReview.text && (
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#555" }}>
                {myReview.text}
              </p>
            )}
          </div>
        )}

        {/* Cantitate + Adaugă */}
        {sp.stock > 0 ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>
                Cantitate:
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setDQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#f0f0f0",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    minWidth: 24,
                    textAlign: "center",
                  }}
                >
                  {dQty}
                </span>
                <button
                  onClick={() => setDQty((q) => Math.min(sp.stock, q + 1))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: GL,
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    color: G,
                    fontWeight: 700,
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                addToCart(sp.id, dQty);
                showToast(`${sp.name} adăugat ×${dQty}`);
                setPage("produse");
              }}
              style={{
                ...btnG(),
                padding: "18px",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              🛒 Adaugă în coș — {sp.price * dQty} RON
            </button>
          </>
        ) : (
          <button
            onClick={async () => {
              await storage.setNotifyWhenAvailable(sp.id, true);
              await toggleWishlist(sp.id);
              showToast("Te anunțăm când e disponibil!", "🔔");
            }}
            style={{
              ...btnG({ background: "#F59E0B" }),
              padding: "18px",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            🔔 Anunță-mă când e disponibil
          </button>
        )}
      </div>
    </div>
  );
}
