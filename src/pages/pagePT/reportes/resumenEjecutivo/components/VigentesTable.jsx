import React, { useMemo, useState } from "react";

export default function VigentesTable({
  items = [],
  title = "Socios vigentes",
  emptyMessage = "No hay socios vigentes para mostrar.",
  onRowClick,
  startCollapsed = true, // 👈 controla si inicia cerrado
}) {
  const [isOpen, setIsOpen] = useState(!startCollapsed);

  const parseDateOnly = (v) => {
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d)) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const normalized = useMemo(() => {
    return (items || []).map((it, i) => ({
      id: it?.id ?? `vig-${i}`,
      client: it?.cliente || "SIN NOMBRE",
      plan: it?.plan || "-",
      expiration: parseDateOnly(it?.fechaFin),
      remainingDays: Number.isFinite(+it?.dias_restantes)
        ? +it.dias_restantes
        : null,
      amount: Number(it?.monto ?? 0),
      executive: it?.ejecutivo || it?.asesor || it?.responsable || "-",
    }));
  }, [items]);

  const processed = useMemo(() => {
    const list = normalized
      .filter((r) => r.remainingDays !== 0)
      .slice()
      .sort((a, b) => {
        const ax = a.expiration?.getTime?.() ?? 0;
        const bx = b.expiration?.getTime?.() ?? 0;
        return ax - bx;
      });
    return list;
  }, [normalized]);

  const formatDate = (date) =>
    date
      ? new Intl.DateTimeFormat("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date)
      : "-";
  const formatMoney = (v) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(v || 0));

  const styles = {
    wrapper: {
      border: "1px solid #dce1eb",
      borderRadius: 12,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 8px 22px rgba(15,23,42,.08)",
    },
    header: {
      background: "#0f172a",
      color: "#f8fafc",
      padding: "16px 20px",
      fontWeight: 800,
      textTransform: "uppercase",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 22,
    },
    table: { width: "100%", borderCollapse: "collapse" },
    thead: { background: "#f3f4f6", textTransform: "uppercase", fontSize: 18 },
    th: {
      padding: "12px 16px",
      borderBottom: "1px solid #e5e7eb",
      fontWeight: 800,
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #eef2f7",
      fontSize: 20,
      color: "#1f2937",
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER con toggle */}
      <div style={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span style={{ fontSize: 20 }}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* CONTENIDO COLAPSABLE */}
      {isOpen && (
        <>
          {processed.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              {emptyMessage}
            </div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={{ ...styles.th, width: "28%" }}>Cliente</th>
                  <th style={{ ...styles.th, width: "20%" }}>Plan</th>
                  <th style={{ ...styles.th, width: "14%" }}>Fecha fin</th>
                  <th style={{ ...styles.th, width: "14%" }}>Monto</th>
                  <th style={{ ...styles.th, width: "14%" }}>Ejecutivo</th>
                  <th style={{ ...styles.th, width: "10%" }}>Días restantes</th>
                </tr>
              </thead>
              <tbody>
                {processed.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                  >
                    <td style={styles.td}>
                      <strong>{row.client}</strong>
                    </td>
                    <td style={styles.td}>{row.plan}</td>
                    <td style={styles.td}>{formatDate(row.expiration)}</td>
                    <td style={styles.td}>{formatMoney(row.amount)}</td>
                    <td style={styles.td}>{row.executive}</td>
                    <td style={styles.td}>{row.remainingDays ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
