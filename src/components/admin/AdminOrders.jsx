import { useState } from "react";
import { G, GL, card, SC } from "../../lib/constants";

const STATUS_OPTIONS = [
  "Nouă",
  "Confirmată",
  "Pre-comandă",
  "În livrare",
  "Livrată",
  "Anulată",
];

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShort(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChangeLabel({ changes }) {
  const lines = [];
  if (changes.status)
    lines.push(`Status: ${changes.status.from} → ${changes.status.to}`);
  if (changes.items) lines.push("Produse modificate");
  if (changes.total)
    lines.push(`Total: ${changes.total.from} → ${changes.total.to} RON`);
  if (changes.pay)
    lines.push(
      `Plată: ${changes.pay.from === "cash" ? "Cash" : "Transfer"} → ${changes.pay.to === "cash" ? "Cash" : "Transfer"}`
    );
  if (changes.addr) lines.push("Adresă modificată");
  if (changes.note) lines.push("Notă modificată");
  if (lines.length === 0) lines.push("Fără modificări înregistrate");
  return (
    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
      {lines.map((l, i) => (
        <div key={i}>• {l}</div>
      ))}
    </div>
  );
}

export default function AdminOrders({ ctx }) {
  const { orders, setOrders, storage, showToast, findProduct, settings, editOrder, profile } = ctx;

  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [historyMap, setHistoryMap] = useState({});
  const [historyOpen, setHistoryOpen] = useState(null);
  const [saving, setSaving] = useState(false);

  const phone = settings?.whatsapp?.replace(/\s/g, "") || "";

  const startEdit = (order) => {
    setEditingId(order.id);
    setEditDraft({
      status: order.status,
      items: (order.items || []).map((i) => ({ ...i })),
      addr: order.addr || "",
      note: order.note || "",
      pay: order.pay || "cash",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = async (orderId) => {
    setSaving(true);
    const total = editDraft.items.reduce((s, item) => {
      const p = findProduct(item.product_id);
      return s + (p ? p.price * item.qty : 0);
    }, 0);
    const updated = await editOrder(orderId, {
      status: editDraft.status,
      items: editDraft.items,
      addr: editDraft.addr,
      note: editDraft.note,
      pay: editDraft.pay,
      total,
    });
    setSaving(false);
    if (updated) {
      setEditingId(null);
      setEditDraft(null);
      showToast("Comandă actualizată", "✓");
      // Refresh history if open
      if (historyOpen === orderId) loadHistory(orderId);
    } else {
      showToast("Eroare la salvare", "❌");
    }
  };

  const loadHistory = async (orderId) => {
    const edits = await storage.getOrderEdits(orderId);
    setHistoryMap((prev) => ({ ...prev, [orderId]: edits }));
    setHistoryOpen(orderId === historyOpen ? null : orderId);
  };

  const deleteOrder = async (orderId) => {
    const ok = await storage.deleteOrder(orderId);
    if (ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setExpandedId(null);
      setConfirmDelete(null);
      showToast("Comandă ștearsă", "✓");
    } else {
      showToast("Eroare la ștergere", "❌");
    }
  };

  if (orders.length === 0)
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
        <div style={{ fontSize: 64 }}>📋</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D" }}>
          Nicio comandă
        </div>
      </div>
    );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 18px 0" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#2D2D2D" }}>
          Comenzi ({orders.length})
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => {
            const isExpanded = expandedId === o.id;
            const isEditing = editingId === o.id;
            const isPreorder = o.status === "Pre-comandă";
            const sc = isPreorder
              ? { bg: "#FEF3C7", c: "#B45309" }
              : SC?.[o.status] || { bg: "#f5f5f5", c: "#888" };
            const clientName =
              o.profiles?.name || o.profiles?.phone || o.user_id?.slice(0, 8);

            return (
              <div key={o.id} style={card}>
                {/* Header */}
                <div
                  onClick={() => {
                    if (!isEditing) {
                      setExpandedId(isExpanded ? null : o.id);
                      setConfirmDelete(null);
                    }
                  }}
                  style={{ cursor: isEditing ? "default" : "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#2D2D2D" }}>
                        #{o.id}
                        {o.edit_count > 0 && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#B45309",
                              background: "#FEF3C7",
                              padding: "1px 6px",
                              borderRadius: 5,
                            }}
                          >
                            EDITATĂ
                          </span>
                        )}
                      </div>
                      {clientName && (
                        <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
                          {clientName}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                        {formatDate(o.created_at)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.c,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 8,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        {o.status}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: G }}>
                        {o.total} RON
                      </span>
                    </div>
                  </div>

                  {!isExpanded && !isEditing && (
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                      {(o.items || [])
                        .slice(0, 2)
                        .map((item) => {
                          const p = findProduct(item.product_id);
                          return p ? `${p.name} ×${item.qty}` : item.product_id;
                        })
                        .join(", ")}
                      {(o.items || []).length > 2 &&
                        ` +${(o.items || []).length - 2} produse`}
                    </div>
                  )}
                </div>

                {/* VIEW mode (expanded, not editing) */}
                {isExpanded && !isEditing && (
                  <div style={{ marginTop: 12 }}>
                    {isPreorder && (
                      <div
                        style={{
                          background: "#FEF3C7",
                          borderRadius: 8,
                          padding: "8px 10px",
                          marginBottom: 10,
                          fontSize: 12,
                          color: "#92400E",
                        }}
                      >
                        ⏳ Pre-comandă — stocul nu a fost decrementat
                      </div>
                    )}

                    {/* Produse */}
                    <div style={{ marginBottom: 12, borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
                      {(o.items || []).map((item, i) => {
                        const p = findProduct(item.product_id);
                        return (
                          <div
                            key={i}
                            style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 4 }}
                          >
                            <span>{p?.name || item.product_id} × {item.qty}</span>
                            <span style={{ fontWeight: 600 }}>{(p?.price ?? 0) * item.qty} RON</span>
                          </div>
                        );
                      })}
                    </div>

                    {o.addr && <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>📍 {o.addr}</div>}
                    {o.delivery_slot && <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>🕐 {o.delivery_slot}</div>}
                    {o.pay && <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>💳 {o.pay === "cash" ? "Cash" : "Transfer bancar"}</div>}
                    {o.note && <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>📝 {o.note}</div>}
                    {o.profiles?.phone && <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>📞 {o.profiles.phone}</div>}

                    {/* Actiuni */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <button
                        onClick={() => startEdit(o)}
                        style={{
                          flex: 1,
                          background: GL,
                          color: G,
                          border: "none",
                          borderRadius: 10,
                          padding: "9px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Editează comanda
                      </button>
                      <button
                        onClick={() => loadHistory(o.id)}
                        style={{
                          background: "#f5f5f5",
                          color: "#555",
                          border: "none",
                          borderRadius: 10,
                          padding: "9px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🕐 Istoric
                      </button>
                    </div>

                    {/* Istoric editari */}
                    {historyOpen === o.id && (
                      <div
                        style={{
                          marginTop: 10,
                          borderTop: "1px solid #f0f0f0",
                          paddingTop: 10,
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                          Istoric editări
                        </div>
                        {(historyMap[o.id] || []).length === 0 ? (
                          <div style={{ fontSize: 12, color: "#bbb" }}>Nicio editare înregistrată</div>
                        ) : (
                          (historyMap[o.id] || []).map((edit) => (
                            <div
                              key={edit.id}
                              style={{
                                marginBottom: 10,
                                padding: "8px 10px",
                                background: "#f9f9f9",
                                borderRadius: 8,
                                borderLeft: `3px solid ${edit.editor_role === "admin" ? G : "#3B82F6"}`,
                              }}
                            >
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4 }}>
                                {edit.editor_role === "admin" ? "👤 Admin" : "🧑 Client"} — {edit.editor_name}
                                <span style={{ fontWeight: 400, color: "#aaa", marginLeft: 6 }}>
                                  {formatShort(edit.edited_at)}
                                </span>
                              </div>
                              <ChangeLabel changes={edit.changes || {}} />
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* WhatsApp */}
                    {phone && o.profiles?.phone && (
                      <button
                        onClick={() => {
                          const msg = encodeURIComponent(`Bună! Comanda ta #${o.id} este: ${o.status}.`);
                          window.open(`https://wa.me/${o.profiles.phone.replace(/\D/g, "")}?text=${msg}`);
                        }}
                        style={{
                          marginTop: 10,
                          background: "#25D366",
                          color: "white",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 14px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        💬 WhatsApp client
                      </button>
                    )}

                    {/* Sterge */}
                    <div style={{ marginTop: 10 }}>
                      {confirmDelete === o.id ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => deleteOrder(o.id)} style={{ flex: 1, background: "#DC2626", color: "white", border: "none", borderRadius: 10, padding: "9px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            Da, șterge
                          </button>
                          <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: "#f5f5f5", color: "#555", border: "none", borderRadius: 10, padding: "9px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            Anulează
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(o.id)} style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          × Șterge comanda
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* EDIT mode */}
                {isEditing && editDraft && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: G, fontWeight: 600 }}>
                      ✏️ Mod editare — modificările sunt logate cu numele tău
                    </div>

                    {/* Status */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Status</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => setEditDraft((d) => ({ ...d, status: s }))}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 700,
                              border: `1.5px solid ${editDraft.status === s ? G : "#e8e8e8"}`,
                              background: editDraft.status === s ? GL : "white",
                              color: editDraft.status === s ? G : "#555",
                              cursor: "pointer",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Produse */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Produse</div>
                      {editDraft.items.map((item, idx) => {
                        const p = findProduct(item.product_id);
                        return (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ flex: 1, fontSize: 13, color: "#2D2D2D" }}>{p?.name || item.product_id}</span>
                            <button
                              onClick={() => setEditDraft((d) => {
                                const items = [...d.items];
                                items[idx] = { ...items[idx], qty: Math.max(1, items[idx].qty - 1) };
                                return { ...d, items };
                              })}
                              style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #e8e8e8", background: "white", fontSize: 16, cursor: "pointer" }}
                            >−</button>
                            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                            <button
                              onClick={() => setEditDraft((d) => {
                                const items = [...d.items];
                                items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
                                return { ...d, items };
                              })}
                              style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #e8e8e8", background: "white", fontSize: 16, cursor: "pointer" }}
                            >+</button>
                            <button
                              onClick={() => setEditDraft((d) => ({ ...d, items: d.items.filter((_, i) => i !== idx) }))}
                              style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", fontSize: 14, cursor: "pointer" }}
                            >×</button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Plata */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Metodă plată</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[{ v: "cash", l: "💵 Cash" }, { v: "transfer", l: "🏦 Transfer" }].map(({ v, l }) => (
                          <button
                            key={v}
                            onClick={() => setEditDraft((d) => ({ ...d, pay: v }))}
                            style={{
                              padding: "7px 14px",
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 700,
                              border: `1.5px solid ${editDraft.pay === v ? G : "#e8e8e8"}`,
                              background: editDraft.pay === v ? GL : "white",
                              color: editDraft.pay === v ? G : "#555",
                              cursor: "pointer",
                            }}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Adresa */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Adresă</div>
                      <input
                        value={editDraft.addr}
                        onChange={(e) => setEditDraft((d) => ({ ...d, addr: e.target.value }))}
                        style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 10, padding: "9px 12px", fontSize: 13, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
                      />
                    </div>

                    {/* Nota */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Notă</div>
                      <textarea
                        value={editDraft.note}
                        onChange={(e) => setEditDraft((d) => ({ ...d, note: e.target.value }))}
                        rows={2}
                        style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 10, padding: "9px 12px", fontSize: 13, boxSizing: "border-box", outline: "none", fontFamily: "inherit", resize: "none" }}
                      />
                    </div>

                    {/* Butoane save/cancel */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => saveEdit(o.id)}
                        disabled={saving}
                        style={{ flex: 2, background: G, color: "white", border: "none", borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}
                      >
                        {saving ? "Se salvează..." : "✓ Salvează modificările"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ flex: 1, background: "#f5f5f5", color: "#555", border: "none", borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
