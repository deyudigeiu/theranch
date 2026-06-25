import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";

export default function AdminCosBaza({ ctx }) {
  const { storage, products, cosBaza, setCosBaza, showToast, setAdminPage } =
    ctx;

  const [items, setItems] = useState(cosBaza?.items || []);
  const [title, setTitle] = useState(cosBaza?.title || "Coșul Lunii");
  const [desc, setDesc] = useState(cosBaza?.description || "");
  const [price, setPrice] = useState(cosBaza?.price || "");
  const [active, setActive] = useState(cosBaza?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (cosBaza) {
      setItems(cosBaza.items || []);
      setTitle(cosBaza.title || "Coșul Lunii");
      setDesc(cosBaza.description || "");
      setPrice(cosBaza.price || "");
      setActive(cosBaza.active ?? true);
    }
  }, [cosBaza]);

  const save = async () => {
    setSaving(true);
    const updated = {
      title,
      description: desc,
      active,
      items,
      price: Number(price) || 0,
    };
    await storage.setConfig("cosBaza", updated);
    setCosBaza(updated);
    showToast("Coșul Lunii salvat", "✓");
    setSaving(false);
  };

  const addProduct = (prod) => {
    if (items.find((i) => i.product_id === prod.id)) {
      showToast("Deja în coș", "!");
      return;
    }
    setItems((arr) => [...arr, { product_id: prod.id, qty: 1 }]);
    setSearch("");
  };

  const updateQty = (product_id, qty) => {
    if (qty <= 0) {
      setItems((arr) => arr.filter((i) => i.product_id !== product_id));
    } else {
      setItems((arr) =>
        arr.map((i) => (i.product_id === product_id ? { ...i, qty } : i))
      );
    }
  };

  const getProduct = (id) => (products || []).find((p) => p.id === id);

  const filtered =
    search.length > 1
      ? (products || [])
          .filter(
            (p) =>
              p.active &&
              p.name.toLowerCase().includes(search.toLowerCase()) &&
              !items.find((i) => i.product_id === p.id)
          )
          .slice(0, 8)
      : [];

  const computedTotal = items.reduce((sum, i) => {
    const p = getProduct(i.product_id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);

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
          Coșul Lunii
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <p style={sectHdr}>Informații coș</p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 13, color: "#555" }}>
            Coș activ (vizibil clienților)
          </span>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            style={{ accentColor: G, width: 18, height: 18 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Titlu coș</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inp}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Descriere (opțional)</span>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            placeholder="ex: Selecția lunii iunie — produse proaspete de sezon"
            style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={lbl}>
            Preț coș (RON) — lasă 0 pentru prețul calculat automat
          </span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="ex: 150"
            style={inp}
          />
        </label>

        <p style={sectHdr}>Produse în coș</p>

        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută produs de adăugat..."
            style={inp}
          />
          {filtered.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 50,
                background: "white",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addProduct(p)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = GL)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <span style={{ fontSize: 18 }}>{p.images?.[0] || "📦"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#777" }}>
                      {p.price} RON / {p.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#aaa",
              fontSize: 13,
            }}
          >
            Niciun produs. Caută mai sus pentru a adăuga.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {items.map((item) => {
              const p = getProduct(item.product_id);
              if (!p) return null;
              return (
                <div
                  key={item.product_id}
                  style={{
                    ...card,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{p.images?.[0] || "📦"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#777" }}>
                      {p.price} RON / {p.unit}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      onClick={() => updateQty(item.product_id, item.qty - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: `1.5px solid ${G}`,
                        background: "white",
                        color: G,
                        fontSize: 16,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: 20,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product_id, item.qty + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: "none",
                        background: G,
                        color: "white",
                        fontSize: 16,
                        cursor: "pointer",
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
        )}

        {items.length > 0 && (
          <div
            style={{
              background: GL,
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: price && Number(price) > 0 ? 6 : 0,
              }}
            >
              <span style={{ fontSize: 13, color: "#555" }}>
                Total calculat ({items.length} produse)
              </span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#777" }}>
                {computedTotal} RON
              </span>
            </div>
            {Number(price) > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: "#555" }}>
                  Preț coș setat
                </span>
                <span style={{ fontWeight: 800, fontSize: 16, color: G }}>
                  {Number(price)} RON
                </span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          style={{ ...btnG({ opacity: saving ? 0.7 : 1 }) }}
        >
          {saving ? "Se salvează..." : "Salvează coșul"}
        </button>
      </div>
    </div>
  );
}
