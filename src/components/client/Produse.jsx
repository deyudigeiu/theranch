import { useState } from "react";
import { G, GL } from "../../lib/constants";
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
    catFilter,
    setCatFilter,
  } = ctx;

  // MEDIU FIX #10/#17: initialize activeCat from ctx.catFilter (set by Home category click)
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(catFilter || "all");
  const [sort, setSort] = useState("default");

  const handleCatChange = (id) => {
    setActiveCat(id);
    setCatFilter(id);
  };

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
            onClick={() => handleCatChange(c.id)}
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
              whiteSpace: "nowrap",
            }}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div style={{ padding: "10px 18px 0", display: "flex", gap: 6 }}>
        {[
          { v: "default", l: "Implicit" },
          { v: "price_asc", l: "Preț ↑" },
          { v: "price_desc", l: "Preț ↓" },
          { v: "name", l: "A–Z" },
        ].map(({ v, l }) => (
          <button
            key={v}
            onClick={() => setSort(v)}
            style={{
              padding: "5px 12px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 700,
              border: `1.5px solid ${sort === v ? G : "#e8e8e8"}`,
              background: sort === v ? GL : "white",
              color: sort === v ? G : "#777",
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: "14px 18px 0" }}>
        {!dataLoaded ? (
          <SkeletonProductGrid />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#bbb" }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ fontSize: 14, marginTop: 12 }}>Niciun produs găsit</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map((p) => {
              const c = findCategory(p.cat_id);
              const outOfStock = p.stock != null && p.stock === 0;
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
                    opacity: outOfStock && !p.active ? 0.6 : 1,
                  }}
                >
                  <div style={{ height: 100, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ImgBox src={p.images?.[0]} bg={c.bg} size={72} radius={0} />
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#2D2D2D", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    {outOfStock && (
                      <span style={{ fontSize: 9, fontWeight: 800, background: "#FEF3C7", color: "#B45309", padding: "1px 6px", borderRadius: 5, marginBottom: 4, display: "inline-block" }}>PRE-COMANDĂ</span>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: G }}>{p.price} RON</span>
                      <QA pid={p.id} cart={cart} addToCart={addToCart} setCartQty={setCartQty} />
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
