import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function AdminGallery({ ctx }) {
  const { storage, showToast, setAdminPage } = ctx;

  const [photos, setPhotos] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storage.getConfig().then((rows) => {
      const cfg = {};
      (rows || []).forEach((r) => {
        cfg[r.key] = r.value;
      });
      setPhotos(cfg.gallery || []);
    });
  }, []);

  const add = () => {
    if (!newUrl.trim()) {
      showToast("Adaugă un URL", "⚠️");
      return;
    }
    setPhotos((p) => [
      ...p,
      { url: newUrl.trim(), caption: newCaption.trim() },
    ]);
    setNewUrl("");
    setNewCaption("");
  };

  const remove = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    await storage.setConfig("gallery", photos);
    showToast("Galerie salvată", "✓");
    setSaving(false);
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
          Galerie foto
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        {/* Adaugă foto */}
        <div style={{ ...card, marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 10 }}>
            <span style={lbl}>URL imagine</span>
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Descriere (opțional)</span>
            <input
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="ex: Animale la pășune"
              style={inp}
            />
          </label>
          <button
            onClick={add}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              background: GL,
              color: G,
              border: "none",
              cursor: "pointer",
            }}
          >
            + Adaugă fotografie
          </button>
        </div>

        {/* Lista poze */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img
                src={photo.url}
                alt=""
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  objectFit: "cover",
                  background: "#f0f0f0",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#555",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {photo.url}
                </div>
                {photo.caption && (
                  <div style={{ fontSize: 11, color: "#aaa" }}>
                    {photo.caption}
                  </div>
                )}
              </div>
              <button
                onClick={() => remove(i)}
                style={{
                  background: "#FEE2E2",
                  color: "#DC2626",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {photos.length > 0 && (
          <button
            onClick={save}
            disabled={saving}
            style={{ ...btnG({ opacity: saving ? 0.7 : 1 }) }}
          >
            {saving
              ? "Se salvează..."
              : `Salvează galeria (${photos.length} poze)`}
          </button>
        )}
      </div>
    </div>
  );
}
