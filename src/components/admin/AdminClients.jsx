import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG } from "../../lib/constants";

export default function AdminClients({ ctx }) {
  const { storage, settings, orders, showToast, setAdminPage, sendMagicLink } =
    ctx;

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = useState({});
  const [saving, setSaving] = useState(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);

  const inactiveMonths = settings?.inactiveMonths || 2;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await storage.getClients();
      const enriched = (data || []).map((c) => {
        const clientOrders = orders.filter((o) => o.user_id === c.id);
        const total_spent = clientOrders.reduce(
          (s, o) => s + (o.total || 0),
          0
        );
        const sorted = [...clientOrders].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        return {
          ...c,
          total_orders: clientOrders.length,
          total_spent,
          last_order_at: sorted[0]?.created_at || null,
        };
      });
      setClients(enriched);
      const n = {};
      (data || []).forEach((c) => {
        n[c.id] = c.notes || "";
      });
      setNotes(n);
      setLoading(false);
    })();
  }, []);

  const saveNote = async (clientId) => {
    setSaving(clientId);
    await storage.updateClientNote(clientId, notes[clientId]);
    showToast("Notă salvată", "✓");
    setSaving(null);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteSending(true);
    const { error } = await sendMagicLink(inviteEmail.trim());
    if (error) {
      console.error("Invite error:", error);
      showToast("Nu s-a putut trimite invitația", "❌");
    } else {
      showToast(`Invitație trimisă la ${inviteEmail}`, "✓");
      setInviteEmail("");
      setInviteOpen(false);
    }
    setInviteSending(false);
  };

  const isInactive = (client) => {
    if (!client.last_order_at) return true;
    const diff =
      (Date.now() - new Date(client.last_order_at)) /
      (1000 * 60 * 60 * 24 * 30);
    return diff >= inactiveMonths;
  };

  const waLink = (client) => {
    const phone = client.phone
      ? (client.phone.startsWith("0")
          ? "4" + client.phone
          : client.phone
        ).replace(/\D/g, "")
      : null;
    return phone ? `https://wa.me/${phone}` : null;
  };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(q);
    const matchFilter =
      filter === "all"
        ? true
        : filter === "inactive"
        ? isInactive(c)
        : !isInactive(c);
    return matchSearch && matchFilter;
  });

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Niciodată";

  const TABS = [
    { v: "all", l: `Toți (${clients.length})` },
    { v: "active", l: "Activi" },
    { v: "inactive", l: "Inactivi" },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Modal invitație */}
      {inviteOpen && (
        <div
          onClick={() => setInviteOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 36px",
              width: "100%",
              maxWidth: 430,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: "#2D2D2D",
                marginBottom: 6,
              }}
            >
              Invită client nou
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              Clientul primește un magic link pe email și se înregistrează
              automat.
            </div>
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={lbl}>Email client</span>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                placeholder="email@exemplu.ro"
                autoFocus
                style={inp}
              />
            </label>
            <button
              onClick={sendInvite}
              disabled={inviteSending || !inviteEmail.trim()}
              style={{
                ...btnG({
                  opacity: inviteSending || !inviteEmail.trim() ? 0.6 : 1,
                }),
              }}
            >
              {inviteSending ? "Se trimite..." : "Trimite invitația"}
            </button>
          </div>
        </div>
      )}

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
        <span
          style={{ fontWeight: 800, fontSize: 16, color: "#2D2D2D", flex: 1 }}
        >
          Clienți
        </span>
        <button
          onClick={() => setInviteOpen(true)}
          style={{
            background: G,
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Invită
        </button>
      </div>

      <div style={{ padding: "12px 18px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută după nume, email sau telefon..."
          style={{ ...inp, marginBottom: 10 }}
        />

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 14,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.v}
              onClick={() => setFilter(t.v)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: `1.5px solid ${filter === t.v ? G : "#e8e8e8"}`,
                background: filter === t.v ? GL : "white",
                color: filter === t.v ? G : "#777",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            Se încarcă...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#aaa",
              fontSize: 13,
            }}
          >
            Niciun client găsit.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((client) => {
              const inactive = isInactive(client);
              const wa = waLink(client);
              const open = expanded === client.id;
              return (
                <div
                  key={client.id}
                  style={{ ...card, padding: 0, overflow: "hidden" }}
                >
                  <div
                    onClick={() => setExpanded(open ? null : client.id)}
                    style={{
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: inactive ? "#f5f5f5" : GL,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14,
                        color: inactive ? "#aaa" : G,
                        flexShrink: 0,
                      }}
                    >
                      {(client.name || client.email || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#2D2D2D",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {client.name || "—"}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {client.email}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: inactive ? "#FEE2E2" : "#DCFCE7",
                          color: inactive ? "#DC2626" : "#16A34A",
                        }}
                      >
                        {inactive ? "Inactiv" : "Activ"}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}
                      >
                        {client.total_orders} comenzi
                      </div>
                    </div>
                  </div>

                  {open && (
                    <div
                      style={{
                        borderTop: "1px solid #f0f0f0",
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ fontSize: 12, color: "#555" }}>
                          <span style={{ color: "#aaa" }}>Telefon: </span>
                          {client.phone || "—"}
                        </div>
                        <div style={{ fontSize: 12, color: "#555" }}>
                          <span style={{ color: "#aaa" }}>
                            Ultima comandă:{" "}
                          </span>
                          {formatDate(client.last_order_at)}
                        </div>
                        <div style={{ fontSize: 12, color: "#555" }}>
                          <span style={{ color: "#aaa" }}>
                            Total cheltuit:{" "}
                          </span>
                          <strong>{client.total_spent.toFixed(2)} RON</strong>
                        </div>
                        <div style={{ fontSize: 12, color: "#555" }}>
                          <span style={{ color: "#aaa" }}>Comenzi: </span>
                          {client.total_orders}
                        </div>
                      </div>

                      <label style={{ display: "block", marginBottom: 8 }}>
                        <span style={lbl}>Notă internă</span>
                        <textarea
                          value={notes[client.id] || ""}
                          rows={2}
                          onChange={(e) =>
                            setNotes((n) => ({
                              ...n,
                              [client.id]: e.target.value,
                            }))
                          }
                          // MINOR FIX #3: folosește farmerName din settings în loc de "Denis" hardcodat
                          placeholder={`Notă despre client (doar ${settings?.farmerName || "Denis"} o vede)...`}
                          style={{
                            ...inp,
                            resize: "vertical",
                            fontFamily: "inherit",
                          }}
                        />
                      </label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => saveNote(client.id)}
                          disabled={saving === client.id}
                          style={{
                            flex: 1,
                            padding: "9px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            background: GL,
                            color: G,
                            border: "none",
                            cursor: "pointer",
                            opacity: saving === client.id ? 0.6 : 1,
                          }}
                        >
                          {saving === client.id ? "..." : "Salvează notă"}
                        </button>
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              flex: 1,
                              padding: "9px",
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 700,
                              background: "#25D366",
                              color: "white",
                              textDecoration: "none",
                              textAlign: "center",
                              display: "block",
                            }}
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
