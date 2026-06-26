import { useState } from "react";
import { G, GL, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";
import ImgBox from "../shared/ImgBox";

const emptyProduct = {
  id: "",
  name: "",
  cat_id: "",
  description: "",
  unit: "",
  price: 0,
  stock: 0,
  images: ["📦"],
  tags: [],
  nutrition: "",
  allergens: "",
  origin: "",
  hot: false,
  active: true,
  bundle: false,
  bundle_items: [],
};

export default function AdminProducts({ ctx }) {
  const {
    products,
    setProducts,
    categories,
    storage,
    showToast,
    setAdminPage,
  } = ctx;

  const [mode, setMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [tagInput, setTagInput] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p = null) => {
    setEditItem(p ? { ...p } : { ...emptyProduct });
    setMode("form");
  };

  const save = async () => {
    if (!editItem.name || !editItem.cat_id) {
      showToast("Completează numele și categoria", "⚠️");
      return;
    }
    const saved = await storage.saveProduct(editItem);
    if (!saved) {
      showToast("Eroare la salvare - verifică consola", "❌");
      return;
    }
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved];
    });
    showToast("Produs salvat", "✓");
    setMode("list");
  };

  const remove = async (id) => {
    await storage.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Produs șters", "🗑");
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setEditItem((p) => ({
        ...p,
        tags: [...(p.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  if (mode === "form" && editItem)
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
            onClick={() => setMode("list")}
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
            {editItem.name || "Produs nou"}
          </span>
        </div>
        <div style={{ padding: "16px 18px 0" }}>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Nume produs</span>
            <input
              value={editItem.name}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, name: e.target.value }))
              }
              style={inp}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Categorie</span>
            <select
              value={editItem.cat_id}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, cat_id: e.target.value }))
              }
              style={{ ...inp, padding: "12px 15px" }}
            >
              <option value="">— Alege —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Descriere</span>
            <textarea
              value={editItem.description}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, description: e.target.value }))
              }
              style={{ ...inp, resize: "none", minHeight: 70 }}
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <label>
              <span style={lbl}>Preț (RON)</span>
              <input
                type="number"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem((p) => ({ ...p, price: Number(e.target.value) }))
                }
                style={inp}
              />
            </label>
            <label>
              <span style={lbl}>Stoc</span>
              <input
                type="number"
                value={editItem.stock}
                onChange={(e) =>
                  setEditItem((p) => ({ ...p, stock: Number(e.target.value) }))
                }
                style={inp}
              />
            </label>
          </div>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Unitate (ex: 1 kg, 10 buc)</span>
            <input
              value={editItem.unit}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, unit: e.target.value }))
              }
              style={inp}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Emoji / imagine (primul element)</span>
            <input
              value={editItem.images?.[0] || ""}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, images: [e.target.value] }))
              }
              style={inp}
              placeholder="🥚 sau URL imagine"
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Origine</span>
            <input
              value={editItem.origin}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, origin: e.target.value }))
              }
              style={inp}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Valori nutriționale</span>
            <input
              value={editItem.nutrition}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, nutrition: e.target.value }))
              }
              style={inp}
            />
          </label>

          {/* Tags */}
          <div style={{ marginBottom: 12 }}>
            <span style={lbl}>Etichete</span>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {(editItem.tags || []).map((t) => (
                <span
                  key={t}
                  style={{
                    background: GL,
                    color: G,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {t}
                  <button
                    onClick={() =>
                      setEditItem((p) => ({
                        ...p,
                        tags: p.tags.filter((x) => x !== t),
                      }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: G,
                      padding: 0,
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Adaugă etichetă..."
                style={{ ...inp, flex: 1 }}
              />
              <button
                onClick={addTag}
                style={{
                  background: GL,
                  color: G,
                  border: "none",
                  borderRadius: 14,
                  padding: "0 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Toggle-uri */}
          <div style={{ ...card, marginBottom: 16 }}>
            {[
              ["hot", "🔥 Recomandat (apare pe Home)"],
              ["active", "✅ Activ (vizibil în catalog)"],
            ].map(([field, label]) => (
              <label
                key={field}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 13, color: "#555" }}>{label}</span>
                <input
                  type="checkbox"
                  checked={!!editItem[field]}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, [field]: e.target.checked }))
                  }
                  style={{ accentColor: G, width: 18, height: 18 }}
                />
              </label>
            ))}
          </div>

          <button onClick={save} style={btnG()}>
            Salvează produsul
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{
          padding: "14px 18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
        <button
          onClick={() => startEdit()}
          style={{
            background: G,
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Produs nou
        </button>
      </div>

      <div style={{ padding: "12px 18px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Caută produs..."
          style={{ ...inp, marginBottom: 14 }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: p.active ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: 32 }}>{p.images?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontWeight: 700, fontSize: 14, color: "#2D2D2D" }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>
                  {p.unit} · Stoc: {p.stock}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: G }}>
                  {p.price} RON
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => startEdit(p)}
                  style={{
                    background: GL,
                    color: G,
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  style={{
                    background: "#FEE2E2",
                    color: "#DC2626",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
