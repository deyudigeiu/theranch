import { useState, useEffect } from "react";
import { G, GL, card, sectHdr } from "../../lib/constants";

export default function AdminAnalytics({ ctx }) {
  const { storage, setAdminPage, findProduct } = ctx;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await storage.getOrders(false);
      setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  const days = Number(period);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const filtered = orders.filter(
    (o) => new Date(o.created_at) >= cutoff && o.status !== "Anulată"
  );
  const revenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = filtered.length ? revenue / filtered.length : 0;
  const uniqueClients = new Set(filtered.map((o) => o.user_id)).size;

  // Revenue by day (last N days)
  const byDay = {};
  for (let i = Math.min(days - 1, 29); i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = 0;
  }
  filtered.forEach((o) => {
    const key = o.created_at?.slice(0, 10);
    if (key && byDay[key] !== undefined) byDay[key] += o.total || 0;
  });
  const dayEntries = Object.entries(byDay);
  const maxVal = Math.max(...dayEntries.map(([, v]) => v), 1);

  // Top products
  const prodMap = {};
  filtered.forEach((o) => {
    (o.items || []).forEach((item) => {
      const p = findProduct(item.product_id);
      if (!prodMap[item.product_id])
        prodMap[item.product_id] = {
          name: p?.name || item.product_id,
          qty: 0,
          rev: 0,
        };
      prodMap[item.product_id].qty += item.qty || 1;
      prodMap[item.product_id].rev += (p?.price || 0) * (item.qty || 1);
    });
  });
  const topProducts = Object.values(prodMap)
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 5);

  // Status breakdown
  const statusMap = {};
  orders.forEach((o) => {
    statusMap[o.status] = (statusMap[o.status] || 0) + 1;
  });

  const PERIODS = [
    { v: "7", l: "7 zile" },
    { v: "30", l: "30 zile" },
    { v: "90", l: "3 luni" },
  ];

  const KPI = ({ label, value, sub, color }) => (
    <div style={{ ...card, textAlign: "center", padding: "14px 10px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || G }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 10, color: "#bbb", marginTop: 1 }}>{sub}</div>
      )}
    </div>
  );

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
          Analytics
        </span>
      </div>

      <div style={{ padding: "12px 18px 0" }}>
        {/* Period selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {PERIODS.map((p) => (
            <button
              key={p.v}
              onClick={() => setPeriod(p.v)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: `1.5px solid ${period === p.v ? G : "#e8e8e8"}`,
                background: period === p.v ? GL : "white",
                color: period === p.v ? G : "#777",
                cursor: "pointer",
              }}
            >
              {p.l}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            Se încarcă...
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <KPI
                label="Venituri"
                value={`${revenue.toFixed(0)} RON`}
                sub={`${PERIODS.find((p) => p.v === period)?.l}`}
              />
              <KPI label="Comenzi" value={filtered.length} sub="finalizate" />
              <KPI label="Coș mediu" value={`${avgOrder.toFixed(0)} RON`} />
              <KPI
                label="Clienți unici"
                value={uniqueClients}
                sub="în perioadă"
              />
            </div>

            {/* Bar chart */}
            {days <= 30 && (
              <>
                <p style={sectHdr}>Venituri zilnice</p>
                <div
                  style={{ ...card, padding: "16px 12px", overflowX: "auto" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 3,
                      height: 100,
                      minWidth: dayEntries.length * 20,
                    }}
                  >
                    {dayEntries.map(([date, val]) => {
                      const h =
                        maxVal > 0
                          ? Math.max((val / maxVal) * 90, val > 0 ? 4 : 0)
                          : 0;
                      const label = new Date(date).toLocaleDateString("ro-RO", {
                        day: "numeric",
                        month: "numeric",
                      });
                      return (
                        <div
                          key={date}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            minWidth: 16,
                          }}
                          title={`${label}: ${val.toFixed(0)} RON`}
                        >
                          <div
                            style={{
                              fontSize: 8,
                              color: "#bbb",
                              transform: "rotate(-45deg)",
                              transformOrigin: "bottom center",
                              whiteSpace: "nowrap",
                              marginBottom: 2,
                              opacity: dayEntries.length > 14 ? 0 : 1,
                            }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              width: "100%",
                              background: val > 0 ? G : "#f0f0f0",
                              borderRadius: "3px 3px 0 0",
                              height: `${h}px`,
                              transition: "height 0.3s",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {days > 14 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 4,
                      }}
                    >
                      <span style={{ fontSize: 9, color: "#bbb" }}>
                        {new Date(dayEntries[0]?.[0]).toLocaleDateString(
                          "ro-RO",
                          { day: "numeric", month: "short" }
                        )}
                      </span>
                      <span style={{ fontSize: 9, color: "#bbb" }}>
                        {new Date(
                          dayEntries[dayEntries.length - 1]?.[0]
                        ).toLocaleDateString("ro-RO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Top products */}
            {topProducts.length > 0 && (
              <>
                <p style={sectHdr}>Top produse</p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {topProducts.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        ...card,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: GL,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 13,
                          color: G,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#2D2D2D",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#888" }}>
                          {p.qty} buc vândute
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 13,
                          color: G,
                          flexShrink: 0,
                        }}
                      >
                        {p.rev.toFixed(0)} RON
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Status breakdown */}
            {Object.keys(statusMap).length > 0 && (
              <>
                <p style={sectHdr}>Comenzi după status</p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {Object.entries(statusMap).map(([status, count]) => (
                    <div
                      key={status}
                      style={{
                        ...card,
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#555",
                          textTransform: "capitalize",
                        }}
                      >
                        {status}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: 16, color: G }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#aaa",
                  fontSize: 13,
                }}
              >
                Nicio comandă în această perioadă.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
