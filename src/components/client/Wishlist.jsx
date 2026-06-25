import { G, GL, card, btnG } from "../../lib/constants";
import ImgBox from "../shared/ImgBox";
import QA from "../shared/QA";

export default function Wishlist({ ctx }) {
  const {
    wishlist,
    products,
    cart,
    addToCart,
    setCartQty,
    toggleWishlist,
    showToast,
    openProduct,
    setPage,
    findCategory,
  } = ctx;

  const wishlistProducts = products.filter((p) =>
    wishlist.some((w) => w.product_id === p.id)
  );

  if (wishlistProducts.length === 0)
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
        <div style={{ fontSize: 64 }}>❤️</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D" }}>
          Niciun favorit
        </div>
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            margin: 0,
          }}
        >
          Apasă ❤️ pe orice produs să-l salvezi aici
        </p>
        <button
          onClick={() => setPage("produse")}
          style={{ ...btnG({ width: "auto", padding: "14px 28px" }) }}
        >
          Explorează produse
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
          Favoritele mele ({wishlistProducts.length})
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {wishlistProducts.map((p) => {
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
                <div
                  onClick={() => openProduct(p)}
                  style={{ cursor: "pointer" }}
                >
                  <ImgBox src={p.images?.[0]} bg={c.bg} size={56} />
                </div>
                <div
                  onClick={() => openProduct(p)}
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 14, color: "#2D2D2D" }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                    {p.unit}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: G,
                      marginTop: 4,
                    }}
                  >
                    {p.price} RON
                  </div>
                  {p.stock === 0 && (
                    <span
                      style={{
                        background: "#FEE2E2",
                        color: "#DC2626",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 6,
                      }}
                    >
                      Epuizat
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  {p.stock > 0 && (
                    <QA
                      pid={p.id}
                      cart={cart}
                      addToCart={addToCart}
                      setCartQty={setCartQty}
                      showToast={showToast}
                    />
                  )}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 20,
                      cursor: "pointer",
                    }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
