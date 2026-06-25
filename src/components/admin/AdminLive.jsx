import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function AdminLive({ ctx }) {
  const { storage, showToast, setAdminPage } = ctx;

  const [cams, setCams] = useState([]);
  const [newCam, setNewCam] = useState({ name: "", url: "", desc: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storage.getConfig().then((rows) => {
      const cfg = {};
      (rows || []).forEach((r) => {
        cfg[r.key] = r.value;
      });
      setCams(cfg.liveCams || []);
    });
  }, []);

  const add = () => {
    if (!newCam.name.trim() || !newCam.url.trim()) {
      showToast("Completează numele și URL-ul", "⚠️");
      return;
    }
    setCams((c) => [...c, { ...newCam }]);
    setNewCam({ name: "", url: "", desc: "" });
  };

  const remove = (i) => setCams((c) => c.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    await storage.setConfig("liveCams", cams);
    showToast("Camere salvate", "✓");
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
          Camere Live
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ ...card, marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 10 }}>
            <span style={lbl}>Nume cameră</span>
            <input
              value={newCam.name}
              onChange={(e) =>
                setNewCam((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="ex: Grajd cai"
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 10 }}>
            <span style={lbl}>URL stream (YouTube embed, etc.)</span>
            <input
              value={newCam.url}
              onChange={(e) =>
                setNewCam((c) => ({ ...c, url: e.target.value }))
              }
              placeholder="https://www.youtube.com/embed/..."
              style={inp}
            />
          </label>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={lbl}>Descriere (opțional)</span>
            <input
              value={newCam.desc}
              onChange={(e) =>
                setNewCam((c) => ({ ...c, desc: e.target.value }))
              }
              placeholder="ex: Vedere spre pajiște"
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
            + Adaugă cameră
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {cams.map((cam, i) => (
            <div
              key={i}
              style={{
                ...card,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 28 }}>📹</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 700, fontSize: 14, color: "#2D2D2D" }}
                >
                  {cam.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cam.url}
                </div>
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
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {cams.length > 0 && (
          <button
            onClick={save}
            disabled={saving}
            style={{ ...btnG({ opacity: saving ? 0.7 : 1 }) }}
          >
            {saving ? "Se salvează..." : `Salvează (${cams.length} camere)`}
          </button>
        )}
      </div>
    </div>
  );
}
