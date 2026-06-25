import { useState } from "react";
import { G, GL, card } from "../../lib/constants";

export default function Help({ ctx }) {
  const { appConfig, settings, openFaq, setOpenFaq } = ctx;

  const faqs = appConfig?.faqs || [];
  const tutorial = appConfig?.tutorial || [];
  const phone = settings?.contactPhone || "";
  const whatsapp = settings?.whatsapp?.replace(/\s/g, "") || "";

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px 18px 0" }}>
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: 18,
            fontWeight: 800,
            color: "#2D2D2D",
          }}
        >
          Ajutor
        </h2>

        {/* Contact */}
        <div style={{ ...card, marginBottom: 20 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Contactează-l pe Denis
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {whatsapp && (
              <button
                onClick={() => {
                  const msg = encodeURIComponent("Bună Denis, am o întrebare!");
                  window.open(
                    `https://wa.me/${whatsapp.replace("+", "")}?text=${msg}`
                  );
                }}
                style={{
                  flex: 1,
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "13px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                💬 WhatsApp
              </button>
            )}
            {phone && (
              <button
                onClick={() => {
                  window.location.href = `tel:${phone}`;
                }}
                style={{
                  flex: 1,
                  background: GL,
                  color: G,
                  border: "none",
                  borderRadius: 14,
                  padding: "13px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                📞 Sună
              </button>
            )}
          </div>
        </div>

        {/* Tutorial */}
        {tutorial.length > 0 && (
          <>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 1.2,
                textTransform: "uppercase",
                margin: "0 0 12px",
              }}
            >
              Cum funcționează
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {tutorial.map((t) => (
                <div
                  key={t.n}
                  style={{
                    ...card,
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: GL,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {t.e}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#2D2D2D",
                        marginBottom: 3,
                      }}
                    >
                      {t.t}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5 }}
                    >
                      {t.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#bbb",
                letterSpacing: 1.2,
                textTransform: "uppercase",
                margin: "0 0 12px",
              }}
            >
              Întrebări frecvente
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faqs.map((faq) => (
                <div key={faq.id} style={card}>
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === faq.id ? null : faq.id)
                    }
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 0,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#2D2D2D",
                        flex: 1,
                        paddingRight: 8,
                      }}
                    >
                      {faq.q}
                    </span>
                    <span style={{ fontSize: 18, color: G, flexShrink: 0 }}>
                      {openFaq === faq.id ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === faq.id && (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 13,
                        color: "#555",
                        lineHeight: 1.6,
                        paddingTop: 10,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
