import React from "react";
import { useSociosInactivosMarketing } from "./../hooks/useSociosInactivosMarketing";

const PAGE_SIZE = 20;

export default function SociosInactivosMarketing({ empresa = 598 }) {
    const {
        fechaCorte,
        loading,
        error,
        search,
        setSearch,
        isOpen,
        setIsOpen,
        processed,
        paginated,
        page,
        setPage,
        totalPages,
        fetchData,
        handleSort,
        sortIcon,
        formatDate,
        exportToCSV,
        getWhatsAppLink,
        getDaysColor,
        dias,
        setDias
    } = useSociosInactivosMarketing(empresa, PAGE_SIZE);

    const styles = {
        wrapper: {
            border: "1px solid #dce1eb",
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 8px 22px rgba(15,23,42,.08)",
            marginTop: 20,
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
            fontSize: 20,
        },
        toolbar: {
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            padding: "14px 20px",
            borderBottom: "1px solid #e5e7eb",
            background: "#fafbfc",
        },
        searchInput: {
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 16,
            flex: "1 1 220px",
            maxWidth: 320,
            outline: "none",
        },
        badge: {
            background: "#ef4444",
            color: "#fff",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 16,
            fontWeight: 700,
        },
        badgeInfo: {
            background: "#3b82f6",
            color: "#fff",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 16,
            fontWeight: 700,
        },
        table: { width: "100%", borderCollapse: "collapse" },
        thead: { background: "#f3f4f6", textTransform: "uppercase", fontSize: 13 },
        th: {
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            fontWeight: 800,
            cursor: "pointer",
            userSelect: "none",
            whiteSpace: "nowrap",
        },
        td: { padding: "12px 16px", borderBottom: "1px solid #eef2f7", fontSize: 14, color: "#1f2937" },
        paginationBar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            borderTop: "1px solid #e5e7eb",
            background: "#fafbfc",
            fontSize: 13,
        },
        btn: {
            border: "1px solid #d1d5db",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 13,
            cursor: "pointer",
            background: "#fff",
        },
        btnExport: {
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: "bold",
            cursor: "pointer",
            background: "#10b981", // Verde éxito
            color: "#fff",
            marginLeft: "auto",
        }
    };


    return (
        <div style={styles.wrapper}>
            <div style={styles.header} onClick={() => setIsOpen(!isOpen)}>
                <span>
                    Campañas de Retargeting - Inactivos +{dias} días ({loading ? "..." : processed.length})
                </span>
                <span style={{ fontSize: 18 }}>{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
                <>
                    <div style={styles.toolbar}>
                        <input
                            style={styles.searchInput}
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <label style={{ fontSize: 16, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                                Corte:
                            </label>
                            <select
                                value={dias}
                                onChange={(e) => setDias(Number(e.target.value))}
                                disabled={loading}
                                style={{
                                    border: "1px solid #d1d5db",
                                    borderRadius: 6,
                                    padding: "6px 10px",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    background: "#fff",
                                }}
                            >
                                {[15, 30, 60, 91, 120, 180, 365].map(d => (
                                    <option key={d} value={d}>+{d} días</option>
                                ))}
                            </select>
                        </div>
                        <span style={styles.badge}>{processed.length} Leads a recuperar</span>
                        {fechaCorte && (
                            <span style={styles.badgeInfo}>Corte: {formatDate(fechaCorte)}</span>
                        )}

                        {/* BOTÓN DE EXPORTAR CSV */}
                        <button
                            style={styles.btnExport}
                            onClick={exportToCSV}
                            disabled={loading || processed.length === 0}
                        >
                            ↓ Exportar
                        </button>

                        <button
                            style={{ ...styles.btn, marginLeft: "10px" }}
                            onClick={fetchData}
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "↻"}
                        </button>
                    </div>

                    {error && (
                        <div style={{ padding: "12px 20px", background: "#fef2f2", color: "#dc2626", fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div style={{ textAlign: "center", padding: 40, color: "#6b7280", fontSize: 15 }}>
                            Cargando leads inactivos...
                        </div>
                    )}

                    {!loading && processed.length === 0 && (
                        <div style={{ padding: 40, textAlign: "center", color: "#6b7280", fontStyle: "italic" }}>
                            Excelente retención. No se encontraron socios inactivos.
                        </div>
                    )}

                    {!loading && processed.length > 0 && (
                        <>
                            <div style={{ overflowX: "auto" }}>
                                <table style={styles.table}>
                                    <thead className="bg-primary" style={styles.thead}>
                                        <tr>
                                            <th style={{ ...styles.th, width: "5%" }}>#</th>
                                            <th style={{ ...styles.th, width: "25%" }} onClick={() => handleSort("nombre_completo")}>
                                                SOCIO{sortIcon("nombre_completo")}
                                            </th>
                                            <th style={{ ...styles.th, width: "15%" }} onClick={() => handleSort("ultimo_programa")}>
                                                Último<br /> Programa{sortIcon("ultimo_programa")}
                                            </th>
                                            <th style={{ ...styles.th, width: "15%" }} onClick={() => handleSort("ultima_fecha_fin")}>
                                                Vencimiento{sortIcon("ultima_fecha_fin")}
                                            </th>
                                            <th style={{ ...styles.th, width: "10%", textAlign: "center" }} onClick={() => handleSort("dias_sin_renovar")}>
                                                Inactividad{sortIcon("dias_sin_renovar")}
                                            </th>
                                            <th style={{ ...styles.th, width: "12%" }} onClick={() => handleSort("telefono")}>
                                                Teléfono{sortIcon("telefono")}
                                            </th>
                                            <th style={{ ...styles.th, width: "18%" }} onClick={() => handleSort("email")}>
                                                Email{sortIcon("email")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((row, idx) => {
                                            const waLink = getWhatsAppLink(row.telefono);
                                            return (
                                                <tr key={row.id_cli} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                                                    <td style={{ ...styles.td, color: "#9ca3af" }}>
                                                        {(page - 1) * PAGE_SIZE + idx + 1}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <strong>{row.nombre_completo}</strong>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={{ background: "#e2e8f0", padding: "2px 8px", borderRadius: 4, fontSize: 16, fontWeight: 600 }}>
                                                            {row.ultimo_programa}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>{formatDate(row.ultima_fecha_fin)}</td>
                                                    <td style={{ ...styles.td, textAlign: "center", fontSize: 16 }}>
                                                        <span style={{ fontWeight: 700, color: getDaysColor(row.dias_sin_renovar) }}>
                                                            {row.dias_sin_renovar} Días
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        {waLink ? (
                                                            <a
                                                                href={waLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={{ color: "#16a34a", textDecoration: "none", fontWeight: "bold", fontSize: 16 }}
                                                            >
                                                                💬 {row.telefono}
                                                            </a>
                                                        ) : (
                                                            row.telefono
                                                        )}
                                                    </td>
                                                    <td style={{ ...styles.td, fontSize: 16 }}>
                                                        {row.email && row.email !== "-" ? (
                                                            <a href={`mailto:${row.email}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                                                                ✉️ {row.email}
                                                            </a>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div style={styles.paginationBar}>
                                    <span>
                                        Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, processed.length)} de {processed.length}
                                    </span>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            style={{ ...styles.btn, opacity: page === 1 ? 0.4 : 1 }}
                                            disabled={page === 1}
                                            onClick={() => setPage((p) => p - 1)}
                                        >
                                            ← Anterior
                                        </button>
                                        <span style={{ padding: "6px 10px", fontSize: 13, fontWeight: 600 }}>
                                            {page} / {totalPages}
                                        </span>
                                        <button
                                            style={{ ...styles.btn, opacity: page === totalPages ? 0.4 : 1 }}
                                            disabled={page === totalPages}
                                            onClick={() => setPage((p) => p + 1)}
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}