import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";

const emptyPost = {
  title: "",
  excerpt: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
};

export default function AdminBlog({ ctx }) {
  const { storage, showToast, setAdminPage } = ctx;

  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storage.getBlogPosts().then(setPosts);
  }, []);

  const startEdit = (p = null) => {
    setEditItem(p ? { ...p } : { ...emptyPost });
    setMode("form");
  };

  const save = async () => {
    if (!editItem.title.trim()) {
      showToast("Completează titlul", "⚠️");
      return;
    }
    setSaving(true);
    await storage.saveBlogPost(editItem);
    const updated = await storage.getBlogPosts();
    setPosts(updated);
    showToast("Articol salvat", "✓");
    setSaving(false);
    setMode("list");
  };

  const remove = async (id) => {
    const updated = posts.filter((p) => p.id !== id);
    await storage.setConfig("blog", updated);
    setPosts(updated);
    showToast("Articol șters", "🗑");
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
            {editItem.title || "Articol nou"}
          </span>
        </div>
        <div style={{ padding: "16px 18px 0" }}>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Titlu</span>
            <input
              value={editItem.title}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, title: e.target.value }))
              }
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Data</span>
            <input
              type="date"
              value={editItem.date}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, date: e.target.value }))
              }
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Rezumat (apare în listă)</span>
            <textarea
              value={editItem.excerpt}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, excerpt: e.target.value }))
              }
              rows={2}
              style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={lbl}>Conținut articol</span>
            <textarea
              value={editItem.content}
              onChange={(e) =>
                setEditItem((p) => ({ ...p, content: e.target.value }))
              }
              rows={8}
              style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
            />
          </label>
          <button
            onClick={save}
            disabled={saving}
            style={{ ...btnG({ opacity: saving ? 0.7 : 1 }) }}
          >
            {saving ? "Se salvează..." : "Salvează articolul"}
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            Blog
          </span>
        </div>
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
          + Articol nou
        </button>
      </div>
      <div style={{ padding: "12px 18px 0" }}>
        {posts.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
            <p style={{ fontSize: 14 }}>Niciun articol. Adaugă primul!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  ...card,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontWeight: 700, fontSize: 14, color: "#2D2D2D" }}
                  >
                    {post.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{post.date}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => startEdit(post)}
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
                    onClick={() => remove(post.id)}
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
        )}
      </div>
    </div>
  );
}
