import React, { useMemo,useState } from "react";

export default function RenovacionesPorVencer({
  renewals = [],
  daysThreshold = 15,
  title = "Renovaciones próximas a vencer",
  maxRows = 50,
  emptyMessage = "No se encontraron renovaciones dentro del rango seleccionado.",
  excludeZeroAmount = true,
  showSummary = true,
  onRowClick,
   pgmNameById = {},
   startCollapsed=true
}) {
  const [isOpen,setIsOpen]=useState(!startCollapsed)

  const parseDateOnly = (v) => {
    if (!v) return null;
    const s = String(v).trim();
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const d = new Date(s);
    if (isNaN(d)) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const daysBetweenToday = (future) => {
    if (!future) return null;
    const today = startOfDay(new Date());
    const end = startOfDay(future);
    const diffMs = end.getTime() - today.getTime();
    return Math.round(diffMs / 86400000);
  };

  const formatDate = (date) =>
    date
      ? new Intl.DateTimeFormat("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date)
      : "-";

  const formatMoney = (value) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));

  /* ======================== Normalización ======================== */

  const normalized = useMemo(() => {
    return (renewals || []).map((item, idx) => {
      const expiration =
        parseDateOnly(item?.fecha_fin) ||
        parseDateOnly(item?.fechaFin) ||
        parseDateOnly(item?.fechaFinContrato);

      const remaining =
        typeof item?.dias_restantes === "number" && Number.isFinite(item?.dias_restantes)
          ? Math.round(item.dias_restantes)
          : daysBetweenToday(expiration);

      // 👇 intenta resolver el nombre del programa por varias rutas
      const id_pgm = item?.id_pgm ?? item?.idPgm ?? item?.programaId ?? null;

      const planResolved =
        item?.plan ||
        item?.servicio ||
        item?.nombre_plan ||
        item?.name_pgm ||
        item?.tb_programa_training?.name_pgm ||
        item?.tb_programa?.name_pgm ||
        item?.tb_programaTraining?.name_pgm ||
        (id_pgm && pgmNameById?.[id_pgm]) ||     // 👈 fallback por id_pgm
        (id_pgm ? `PGM ${id_pgm}` : "-");

      return {
        id: item?.id ?? `renewal-${idx}`,
        client: String(
          item?.cliente ||
          item?.cliente_nombre ||
          item?.nombre_cliente ||
          "SIN NOMBRE"
        ),
        plan: planResolved,                        
        expiration,
        remainingDays: remaining,
        amount: Number(item?.monto ?? item?.monto_renovacion ?? item?.montoPendiente ?? 0),
        executive: item?.ejecutivo || item?.asesor || item?.responsable || "-",
        notes: item?.notas || item?.comentarios || "",
      };
    });
  }, [renewals, pgmNameById]); 

  const hasThreshold = Number.isFinite(Number(daysThreshold));
  const effectiveThreshold = hasThreshold ? Number(daysThreshold) : Infinity;

  const processed = useMemo(() => {
    let list = normalized.filter((r) => typeof r.remainingDays === "number");
    if (excludeZeroAmount) list = list.filter((r) => Number(r.amount) > 0);
    if (hasThreshold) list = list.filter((r) => r.remainingDays <= effectiveThreshold);
    list.sort((a, b) => {
      if (a.remainingDays !== b.remainingDays) return a.remainingDays - b.remainingDays;
      const ax = a.expiration?.getTime?.() ?? 0;
      const bx = b.expiration?.getTime?.() ?? 0;
      return ax - bx;
    });
    const limit =
      Number.isFinite(Number(maxRows)) && Number(maxRows) > 0
        ? Number(maxRows)
        : list.length;
    return list.slice(0, limit);
  }, [normalized, excludeZeroAmount, hasThreshold, effectiveThreshold, maxRows]);


  const summary = useMemo(() => {
    const src = processed;
    let vencidos = 0,
      hoy = 0,
      proximos = 0,
      total = src.length;
    for (const r of src) {
      if (r.remainingDays < 0) vencidos++;
      else if (r.remainingDays === 0) hoy++;
      else if (r.remainingDays > 0 && r.remainingDays <= effectiveThreshold) proximos++;
    }
    return { vencidos, hoy, proximos, total };
  }, [processed, effectiveThreshold]);


  const styles = {
    wrapper: {
      fontFamily: "Inter, system-ui, Segoe UI, Roboto, sans-serif",
      border: "1px solid #dce1eb",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)",
      background: "#ffffff",
    },
    header: {
      background: "#111827",
      color: "#f9fafb",
      padding: "16px 20px",
      fontSize: 25,
      fontWeight: 800,
      letterSpacing: 0.4,
textAlign: "center",
   },
    bar: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: "10px 14px",
      background: "#f9fafb",
      borderBottom: "1px solid #eef2f7",
      fontSize: 20,
      fontWeight: 600,
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: "#fff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      background: "#f3f4f6",
      color: "#111827",
      textAlign: "left",
      fontSize: 22,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    th: {
      padding: "12px 16px",
      borderBottom: "1px solid #e5e7eb",
      fontWeight: 700,
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #eef2f7",
      fontSize: 24,
      color: "#1f2937",
      verticalAlign: "top",
    },
    badge: {
      borderRadius: 999,
      padding: "4px 10px",
      fontSize: 22,
      fontWeight: 700,
      display: "inline-block",
      textTransform: "uppercase",
    },
    empty: {
      padding: 24,
      textAlign: "center",
      color: "#6b7280",
      fontStyle: "italic",
    },
  };

  const getRowBackground = (remainingDays) => {
    if (typeof remainingDays !== "number") return "transparent";
    if (remainingDays < 0) return "#fee2e2"; // rojo suave expirado
    if (hasThreshold && remainingDays <= Math.max(0, effectiveThreshold)) return "#fef3c7"; // ámbar
    return "transparent";
  };

  const getBadge = (remainingDays) => {
    if (typeof remainingDays !== "number") return null;
    if (remainingDays < 0)
      return (
        <span style={{ ...styles.badge, background: "#b91c1c", color: "#fef2f2" }}>
          vencido
        </span>
      );
    if (remainingDays === 0)
      return (
        <span style={{ ...styles.badge, background: "#d97706", color: "#fff7ed" }}>
          vence hoy
        </span>
      );
    if (hasThreshold && remainingDays <= effectiveThreshold)
      return (
        <span style={{ ...styles.badge, background: "#f59e0b", color: "#fff7ed" }}>
          {remainingDays} días
        </span>
      );
    return (
      <span style={{ ...styles.badge, background: "#047857", color: "#ecfdf5" }}>
        {remainingDays} días
      </span>
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* Header con toggle */}
      <div
        style={{
          ...styles.header,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span style={{ fontSize: 22 }}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Solo se muestra el contenido si isOpen === true */}
      {isOpen && (
        <>
          {showSummary && (
            <div style={styles.bar}>
              <span style={styles.chip}>
                <span>🔴 Vencidos:</span> <strong>{summary.vencidos}</strong>
              </span>
              <span style={styles.chip}>
                <span>🟠 Vence hoy:</span> <strong>{summary.hoy}</strong>
              </span>
              <span style={styles.chip}>
                <span>🟡 ≤ {daysThreshold} días:</span> <strong>{summary.proximos}</strong>
              </span>
              <span style={styles.chip}>
                <span>Total listado:</span> <strong>{summary.total}</strong>
              </span>
            </div>
          )}

          {processed.length === 0 ? (
            <div style={styles.empty}>{emptyMessage}</div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={{ ...styles.th, width: "28%" }}>Cliente</th>
                  <th style={{ ...styles.th, width: "20%" }}>Plan</th>
                  <th style={{ ...styles.th, width: "14%" }}>Fecha fin</th>
                  <th style={{ ...styles.th, width: "14%" }}>Monto</th>
                  <th style={{ ...styles.th, width: "14%" }}>Ejecutivo</th>
                  <th style={{ ...styles.th, width: "10%" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {processed.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      background: getRowBackground(item.remainingDays),
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    <td style={styles.td}>
                      <div style={{ fontWeight: 700 }}>{item.client}</div>
                      {item.notes && (
                        <div style={{ color: "#6b7280", marginTop: 4 }}>{item.notes}</div>
                      )}
                    </td>
                    <td style={styles.td}>{item.plan}</td>
                    <td style={styles.td}>{formatDate(item.expiration)}</td>
                    <td style={styles.td}>{formatMoney(item.amount)}</td>
                    <td style={styles.td}>{item.executive}</td>
                    <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                      {getBadge(item.remainingDays)}
                    </td>
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