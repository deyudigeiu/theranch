import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";
import { formatCountdown } from "../../hooks/useDelivery";

export default function AdminSettings({ ctx }) {
  const {
    storage,
    settings,
    setSettings,
    deliveryConfig,
    setDeliveryConfig,
    nextDelivery,
    cutoff,
    slots,
    showToast,
    setAdminPage,
  } = ctx;

  const [gen, setGen] = useState(settings || {});
  const [del, setDel] = useState(deliveryConfig || {});
  const [newSlot, setNewSlot] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setGen(settings);
  }, [settings]);
  useEffect(() => {
    if (deliveryConfig) setDel(deliveryConfig);
  }, [deliveryConfig]);

  const saveGeneral = async () => {
    setSaving(true);
    await storage.setConfig("settings", gen);
    setSettings(gen);
    showToast("Setări salvate", "✓");
    setSaving(false);
  };

  const saveDelivery = async () => {
    setSaving(true);
    await storage.setConfig("delivery", del);
    setDeliveryConfig(del);
    showToast("Livrare salvată", "✓");
    setSaving(false);
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    setDel((d) => ({ ...d, slots: [...(d.slots || []), newSlot.trim()] }));
    setNewSlot("");
  };

  const removeSlot = (i) => {
    setDel((d) => ({ ...d, slots: d.slots.filter((_, idx) => idx !== i) }));
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const DAYS = [
    "Duminică",
    "Luni",
    "Marți",
    "Miercuri",
    "Joi",
    "Vineri",
    "Sâmbătă",
  ];
  const WEEKS = [
    { v: 1, l: "Prima săptămână" },
    { v: 2, l: "A doua săptămână" },
    { v: -1, l: "Ultima săptămână" },
  ];
  const FREQ = [
    { v: "monthly", l: "Lunar" },
    { v: "biweekly", l: "Bilunar" },
    { v: "weekly", l: "Săptămânal" },
  ];

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
          Setări
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        {/* ── LIVRARE ── */}
        <p style={sectHdr}>Sistem livrare</p>

        {/* Preview */}
        <div
          style={{
            background: GL,
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 16,
          }}
        >
          <div
            style={{ fontSize: 12, color: G, fontWeight: 700, marginBottom: 4 }}
          >
            Preview calculat automat
          </div>
          <div style={{ fontSize: 13, color: "#2D2D2D" }}>
            📦 Următoarea livrare: <strong>{formatDate(nextDelivery)}</strong>
          </div>
          <div style={{ fontSize: 13, color: "#2D2D2D", marginTop: 4 }}>
            ⏰ Cutoff:{" "}
            <strong>
              {cutoff
                ? cutoff.toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Bucharest",
                  })
                : "—"}
            </strong>
          </div>
        </div>

        {/* Frecvență */}
        <div style={{ marginBottom: 14 }}>
          <span style={lbl}>Frecvență livrare</span>
          <div style={{ display: "flex", gap: 8 }}>
            {FREQ.map((f) => (
              <button
                key={f.v}
                onClick={() => setDel((d) => ({ ...d, frequency: f.v }))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `2px solid ${del.frequency === f.v ? G : "#e8e8e8"}`,
                  background: del.frequency === f.v ? GL : "white",
                  color: del.frequency === f.v ? G : "#777",
                  cursor: "pointer",
                }}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Ziua preferată */}
        <div style={{ marginBottom: 14 }}>
          <span style={lbl}>Ziua livrării</span>
          <select
            value={del.preferred_day ?? 6}
            onChange={(e) =>
              setDel((d) => ({ ...d, preferred_day: Number(e.target.value) }))
            }
            style={{ ...inp, padding: "12px 15px" }}
          >
            {DAYS.map((d, i) => (
              <option key={i} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Săptămâna (doar pentru monthly) */}
        {del.frequency === "monthly" && (
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>Săptămâna din lună</span>
            <div style={{ display: "flex", gap: 8 }}>
              {WEEKS.map((w) => (
                <button
                  key={w.v}
                  onClick={() => setDel((d) => ({ ...d, preferred_week: w.v }))}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    border: `2px solid ${
                      del.preferred_week === w.v ? G : "#e8e8e8"
                    }`,
                    background: del.preferred_week === w.v ? GL : "white",
                    color: del.preferred_week === w.v ? G : "#777",
                    cursor: "pointer",
                  }}
                >
                  {w.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cutoff */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <label>
            <span style={lbl}>Zile înainte (cutoff)</span>
            <input
              type="number"
              min="0"
              max="14"
              value={del.cutoff_days_before ?? 2}
              onChange={(e) =>
                setDel((d) => ({
                  ...d,
                  cutoff_days_before: Number(e.target.value),
                }))
              }
              style={inp}
            />
          </label>
          <label>
            <span style={lbl}>Ora cutoff</span>
            <input
              type="number"
              min="0"
              max="23"
              value={del.cutoff_hour ?? 20}
              onChange={(e) =>
                setDel((d) => ({ ...d, cutoff_hour: Number(e.target.value) }))
              }
              style={inp}
            />
          </label>
        </div>

        {/* Override manual */}
        <div style={{ ...card, marginBottom: 14 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2D2D2D",
              marginBottom: 10,
            }}
          >
            Override manual (suprascrie calculul automat)
          </div>
          <label style={{ display: "block", marginBottom: 10 }}>
            <span style={lbl}>Data livrării (lasă gol = automat)</span>
            <input
              type="date"
              value={del.override_delivery || ""}
              onChange={(e) =>
                setDel((d) => ({
                  ...d,
                  override_delivery: e.target.value || null,
                }))
              }
              style={inp}
            />
          </label>
          <label style={{ display: "block" }}>
            <span style={lbl}>Data/ora cutoff (lasă gol = automat)</span>
            <input
              type="datetime-local"
              value={del.override_cutoff || ""}
              onChange={(e) =>
                setDel((d) => ({
                  ...d,
                  override_cutoff: e.target.value || null,
                }))
              }
              style={inp}
            />
          </label>
          {(del.override_delivery || del.override_cutoff) && (
            <button
              onClick={() =>
                setDel((d) => ({
                  ...d,
                  override_delivery: null,
                  override_cutoff: null,
                }))
              }
              style={{
                marginTop: 10,
                background: "none",
                color: "#DC2626",
                border: "none",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              × Șterge override
            </button>
          )}
        </div>

        {/* Sloturi orare */}
        <div style={{ marginBottom: 16 }}>
          <span style={lbl}>Sloturi orare livrare</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 8,
            }}
          >
            {(del.slots || []).map((slot, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    flex: 1,
                    background: "white",
                    border: "1.5px solid #e8e8e8",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                  }}
                >
                  {slot}
                </div>
                <button
                  onClick={() => removeSlot(i)}
                  style={{
                    background: "#FEE2E2",
                    color: "#DC2626",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="ex: 10:00-12:00"
              style={{ ...inp, flex: 1 }}
            />
            <button
              onClick={addSlot}
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

        <button
          onClick={saveDelivery}
          disabled={saving}
          style={{ ...btnG({ marginBottom: 24, opacity: saving ? 0.7 : 1 }) }}
        >
          Salvează livrarea
        </button>

        {/* ── GENERAL ── */}
        <p style={sectHdr}>Setări generale</p>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Numele fermei</span>
          <input
            value={gen.farmName || ""}
            onChange={(e) =>
              setGen((g) => ({ ...g, farmName: e.target.value }))
            }
            style={inp}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Tagline</span>
          <input
            value={gen.tagline || ""}
            onChange={(e) => setGen((g) => ({ ...g, tagline: e.target.value }))}
            style={inp}
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
            <span style={lbl}>Taxă livrare (RON)</span>
            <input
              type="number"
              value={gen.deliveryFee || 0}
              onChange={(e) =>
                setGen((g) => ({ ...g, deliveryFee: Number(e.target.value) }))
              }
              style={inp}
            />
          </label>
          <label>
            <span style={lbl}>Comandă minimă (RON)</span>
            <input
              type="number"
              value={gen.minOrder || 0}
              onChange={(e) =>
                setGen((g) => ({ ...g, minOrder: Number(e.target.value) }))
              }
              style={inp}
            />
          </label>
        </div>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Telefon contact</span>
          <input
            value={gen.contactPhone || ""}
            onChange={(e) =>
              setGen((g) => ({ ...g, contactPhone: e.target.value }))
            }
            style={inp}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>WhatsApp (cu prefix +40)</span>
          <input
            value={gen.whatsapp || ""}
            onChange={(e) =>
              setGen((g) => ({ ...g, whatsapp: e.target.value }))
            }
            style={inp}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Email contact</span>
          <input
            value={gen.contactEmail || ""}
            onChange={(e) =>
              setGen((g) => ({ ...g, contactEmail: e.target.value }))
            }
            style={inp}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={lbl}>Luni inactivitate client</span>
          <input
            type="number"
            min="1"
            value={gen.inactiveMonths || 2}
            onChange={(e) =>
              setGen((g) => ({ ...g, inactiveMonths: Number(e.target.value) }))
            }
            style={inp}
          />
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 13, color: "#555" }}>
            🛒 Magazin deschis
          </span>
          <input
            type="checkbox"
            checked={gen.shopOpen !== false}
            onChange={(e) =>
              setGen((g) => ({ ...g, shopOpen: e.target.checked }))
            }
            style={{ accentColor: G, width: 18, height: 18 }}
          />
        </label>

        <button
          onClick={saveGeneral}
          disabled={saving}
          style={{ ...btnG({ opacity: saving ? 0.7 : 1 }) }}
        >
          Salvează setările generale
        </button>
      </div>
    </div>
  );
}
