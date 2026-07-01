import { useState, useEffect } from "react";
import { G, GL, card, inp, lbl, btnG, sectHdr } from "../../lib/constants";

const TEMPLATES = [
  {
    id: "delivery_reminder",
    label: "Reminder livrare",
    icon: "📦",
    build: ({ farmName, deliveryDate, cutoffDate }) =>
      `Bună ziua! 🌿\n\nVă reamintim că *livrarea ${
        farmName || "Drăgăneasa Ranch"
      }* are loc pe *${deliveryDate}*.\n\nTermen comandă: *${cutoffDate}*.\n\nIntrați în aplicație pentru a vă completa coșul!\n\nMulțumim! 🙏`,
  },
  {
    id: "new_products",
    label: "Produse noi",
    icon: "🆕",
    build: ({ farmName, productList }) =>
      `Bună ziua! 🌱\n\nAm adăugat produse noi la *${
        farmName || "Drăgăneasa Ranch"
      }*:\n\n${
        productList || "• Produs 1\n• Produs 2\n• Produs 3"
      }\n\nLe găsiți în aplicație la secțiunea Produse!\n\nO zi frumoasă! ☀️`,
  },
  {
    id: "cos_luna",
    label: "Coșul Lunii",
    icon: "🛒",
    build: ({ farmName, cosTitle, cosDesc }) =>
      `Bună ziua! 🐄\n\n*${cosTitle || "Coșul Lunii"}* este disponibil!\n\n${
        cosDesc ||
        "O selecție atentă de produse proaspete de sezon de la ferma noastră."
      }\n\nÎl găsiți în aplicație pe pagina principală.\n\nPoftă bună! 🌿 — *${
        farmName || "Drăgăneasa Ranch"
      }*`,
  },
  {
    id: "restock",
    label: "Revenire stoc",
    icon: "✅",
    build: ({ productName, farmName }) =>
      `Bună ziua! 🎉\n\n*${
        productName || "Produsul"
      }* este din nou disponibil la *${
        farmName || "Drăgăneasa Ranch"
      }*!\n\nGrăbiți-vă, stocul este limitat 🌿\n\nComandați din aplicație!`,
  },
  {
    id: "custom",
    label: "Mesaj personalizat",
    icon: "✏️",
    build: () => "",
  },
];

// MEDIU FIX #5: escapeHtml previne XSS în preview — mesajul e text, nu HTML
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function AdminBroadcast({ ctx }) {
  const {
    storage,
    settings,
    deliveryConfig,
    nextDelivery,
    cutoff,
    products,
    cosBaza,
    clients,
    showToast,
    setAdminPage,
  } = ctx;

  const [templateId, setTemplateId] = useState("delivery_reminder");
  const [vars, setVars] = useState({});
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const farmName = settings?.farmName || "Drăgăneasa Ranch";
  const deliveryDate = nextDelivery
    ? new Date(nextDelivery).toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
      })
    : "—";
  const cutoffDate = cutoff
    ? cutoff.toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId);

  useEffect(() => {
    setVars({
      farmName,
      deliveryDate,
      cutoffDate,
      cosTitle: cosBaza?.title || "Coșul Lunii",
      cosDesc: cosBaza?.description || "",
      productName: "",
      productList: "",
    });
  }, [templateId, farmName, deliveryDate, cutoffDate, cosBaza]);

  useEffect(() => {
    if (!activeTemplate) return;
    if (templateId !== "custom") {
      setMessage(activeTemplate.build(vars));
    }
  }, [vars, templateId]);

  const activeCount = (clients || []).filter((c) => {
    if (!c.phone) return false;
    const months = settings?.inactiveMonths || 2;
    if (!c.last_order_at) return false;
    const diff =
      (Date.now() - new Date(c.last_order_at)) / (1000 * 60 * 60 * 24 * 30);
    return diff < months;
  }).length;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast("Mesaj copiat!", "✓");
    } catch {
      showToast("Copierea a eșuat", "!");
    }
  };

  const openWA = () => {
    const phone = settings?.whatsapp?.replace(/\D/g, "") || "";
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const lines = message.split("\n");

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
          Broadcast WhatsApp
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        {/* Info */}
        <div
          style={{
            background: GL,
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 12, color: G }}>
            📊 {activeCount} clienți activi · Copiezi mesajul și trimiți manual
            în grupul WhatsApp
          </span>
        </div>

        {/* Template select */}
        <p style={sectHdr}>Tip mesaj</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              style={{
                padding: "10px 8px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
                border: `2px solid ${templateId === t.id ? G : "#e8e8e8"}`,
                background: templateId === t.id ? GL : "white",
                color: templateId === t.id ? G : "#555",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Variabile */}
        {templateId === "new_products" && (
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>Listă produse (una pe linie, cu •)</span>
            <textarea
              value={vars.productList || ""}
              rows={4}
              onChange={(e) =>
                setVars((v) => ({ ...v, productList: e.target.value }))
              }
              placeholder={"• Lapte proaspăt\n• Brânză de vacă\n• Ouă bio"}
              style={{ ...inp, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
        )}

        {templateId === "restock" && (
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>Numele produsului</span>
            <input
              value={vars.productName || ""}
              onChange={(e) =>
                setVars((v) => ({ ...v, productName: e.target.value }))
              }
              placeholder="ex: Lapte proaspăt"
              style={inp}
            />
          </div>
        )}

        {/* Message editor */}
        <p style={sectHdr}>Mesaj</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={10}
          style={{
            ...inp,
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        />

        {/* Preview — escapeHtml aplicat înainte de bold markdown, deci XSS imposibil */}
        {message && (
          <div
            style={{
              ...card,
              marginTop: 12,
              padding: "14px 16px",
              background: "#ECF0F1",
              borderRadius: 16,
              borderTopLeftRadius: 4,
            }}
          >
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
              Preview WhatsApp
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#2D2D2D",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {lines.map((line, i) => (
                <span
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html:
                      escapeHtml(line).replace(/\*(.*?)\*/g, "<b>$1</b>") +
                      (i < lines.length - 1 ? "<br/>" : ""),
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={copyMessage}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              background: copied ? "#DCFCE7" : GL,
              color: copied ? "#16A34A" : G,
              border: "none",
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copiat!" : "📋 Copiază"}
          </button>
          <button
            onClick={openWA}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              background: "#25D366",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            📱 Deschide WA
          </button>
        </div>
      </div>
    </div>
  );
}
