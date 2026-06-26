import { useState } from "react";
import { G, GL, sectHdr } from "../../lib/constants";
import ImgBox from "../shared/ImgBox";
import QA from "../shared/QA";
import { SkeletonProductGrid } from "../shared/Skeleton";

export default function Produse({ ctx }) {
  const {
    products,
    categories,
    cart,
    addToCart,
    setCartQty,
    showToast,
    openProduct,
    findCategory,
    dataLoaded,
  } = ctx;

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState("default");

  const filtered = products
    .filter((p) => p.active)
    .filter((p) => activeCat === "all" || p.cat_id === activeCat)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Search */}
      <div style={{ padding: "14px 18px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Caută produse..."
          style={{
            width: "100%",
            border: "1.5px solid #e8e8e8",
            borderRadius: 14,
            padding: "12px 15px",
            fontSize: 14,
            color: "#2D2D2D",
            boxSizing: "border-box",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Categorii */}
      <div
        style={{
          padding: "12px 18px 0",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {[
          { id: "all", name: "Toate", emoji: "🌿", ac: G, bg: GL },
          ...categories,
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            style={{
              background: activeCat === c.id ? G : "white",
              color: activeCat === c.id ? "white" : "#555",
              border: activeCat === c.id ? "none" : "1.5px solid #e8e8e8",
              borderRadius: 20,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div
        style={{
          padding: "10px 18px 0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            border: "1.5px solid #e8e8e8",
            borderRadius: 10,
            padding: "6px 10px",
            fontSize: 12,
            color: "#555",
            background: "white",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="default">Sortare: Default</option>
          <option value="price_asc">Preț crescător</option>
          <option value="price_desc">Preț descrescător</option>
          <option value="name">Nume A-Z</option>
        </select>
      </div>

      {/* Lista produse */}
      <div style={{ padding: "12px 18px 0" }}>
        {!dataLoaded ? (
          <SkeletonProductGrid />
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "#bbb",
              fontSize: 14,
            }}
          >
            Niciun produs găsit
          </div>
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {filtered.map((p) => {
              const c = findCategory(p.cat_id);
              return (
                <div
                  key={p.id}
                  onClick={() => openProduct(p)}
                  style={{
                    background: "white",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    opacity: p.stock === 0 ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      height: 100,
                      background: c.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <ImgBox
                      src={p.images?.[0]}
                      bg={c.bg}
                      size={72}
                      radius={0}
                    />
                    {p.hot && p.stock > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          background: "#E53935",
                          color: "white",
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 6,
                        }}
                      >
                        HOT
                      </span>
                    )}
                    {p.stock === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          background: "#FEE2E2",
                          color: "#DC2626",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 6,
                        }}
                      >
                        Epuizat
                      </span>
                    )}
                    {p.bundle && (
                      <span
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#EEF2FE",
                          color: "#3B4FCC",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 6,
                        }}
                      >
                        📦 Pachet
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#2D2D2D",
                        marginBottom: 2,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}
                    >
                      {p.unit}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 800, color: G }}>
                        {p.price} RON
                      </span>
                      {p.stock > 0 ? (
                        <QA
                          pid={p.id}
                          cart={cart}
                          addToCart={addToCart}
                          setCartQty={setCartQty}
                          showToast={showToast}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#DC2626",
                            fontWeight: 700,
                          }}
                        >
                          Stoc 0
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
