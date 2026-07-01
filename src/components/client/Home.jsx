import { G } from "../../lib/constants";
import ImgBox from "../shared/ImgBox";
import QA from "../shared/QA";
import { SkeletonProductGrid } from "../shared/Skeleton";

export default function Home({ ctx }) {
  const {
    products, categories, cart, orders, content,
    nextDelivery, cutoff, countdown, settings,
    addToCart, setCartQty, setPage, openProduct,
    findCategory, findProduct, dataLoaded,
    setCatFilter,
  } = ctx;

  const shopOpen = settings?.shopOpen !== false;
  const farmerName = settings?.farmerName || "Denis";

  const hotProducts = products.filter((p) => p.active && p.hot && p.stock > 0).slice(0, 6);

  const lastOrderItems =
    orders.length > 0
      ? (orders[0].items || []).slice(0, 3).map((i) => findProduct(i.product_id)).filter(Boolean)
      : [];

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("ro-RO", { day: "numeric", month: "long", timeZone: "Europe/Bucharest" }) : "";

  const sectHdr = {
    margin: "0 0 12px 0", fontSize: 11, fontWeight: 800, color: "#aaa",
    letterSpacing: 1.2, textTransform: "uppercase",
  };

  // MEDIU FIX #10: navigate to Produse with category pre-selected
  const goToCategory = (catId) => {
    setCatFilter(catId);
    setPage("produse");
  };

  return (
    <div style={{ paddingBottom: 80, overflowX: "hidden" }}>
      {/* Banner livrare */}
      <div style={{ background: shopOpen ? G : "#888", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "white", fontSize: 13, fontWeight: 800 }}>
            {shopOpen ? content?.banner_open || "Comenzi deschise" : content?.banner_closed || "Comenzi închise"}
          </div>
          {nextDelivery && (
            <div style={{ color: "rgba(255,255,255,.8)", fontSize: 11, marginTop: 2 }}>Ridicare: {formatDate(nextDelivery)}</div>
          )}
        </div>
        {shopOpen && cutoff && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 10 }}>{content?.time_remaining_label || "timp rămas"}</div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{countdown}</div>
          </div>
        )}
      </div>

      {/* Mesaj fermier — MINOR FIX: use dynamic farmerName */}
      {content?.home_message && (
        <div style={{ margin: "16px 16px 0" }}>
          <div style={{ background: "white", borderRadius: 18, padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{content.home_photo || "🌾"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>De la {farmerName}</div>
              <div style={{ color: "#444", fontSize: 13, lineHeight: 1.6 }}>{content.home_message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Recomandări din istoric */}
      {lastOrderItems.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <p style={sectHdr}>Data trecută ai luat</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lastOrderItems.map((p) => {
              const c = findCategory(p.cat_id);
              return (
                <div key={p.id} style={{ background: "white", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                  <ImgBox src={p.images?.[0]} bg={c.bg} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#2D2D2D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ color: G, fontSize: 12, fontWeight: 700 }}>{p.price} RON / {p.unit}</div>
                  </div>
                  <QA pid={p.id} cart={cart} addToCart={addToCart} setCartQty={setCartQty} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorii — MEDIU FIX #10: pass category id to goToCategory */}
      <div style={{ padding: "20px 0 0" }}>
        <p style={{ ...sectHdr, paddingLeft: 16 }}>{content?.section_categories || "Răsfoiește categorii"}</p>
        <div className="home-cats" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, paddingLeft: 16, paddingRight: 16, scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
          {categories.map((c) => (
            <button key={c.id} onClick={() => goToCategory(c.id)} style={{ background: c.bg, border: "none", borderRadius: 16, padding: "10px 16px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.ac }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Produse recomandate */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={sectHdr}>{content?.section_recommended || "Recomandate luna asta"}</p>
        {!dataLoaded ? (
          <SkeletonProductGrid />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {hotProducts.map((p) => {
              const c = findCategory(p.cat_id);
              return (
                <div key={p.id} onClick={() => openProduct(p)} style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                  <div style={{ height: 100, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ImgBox src={p.images?.[0]} bg={c.bg} size={72} radius={0} />
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#2D2D2D", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
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
