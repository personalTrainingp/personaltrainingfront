import React from "react";
import Chart from "react-apexcharts";
import { useGraficoLinealInversionRedes } from "../hooks/useGraficoLinealInversionRedes";

export const GraficoLinealInversionRedes = ({ data = [] }) => {
  const { red, setRed, series, options } = useGraficoLinealInversionRedes(data);

  const ICONS = {
    ambos: { src: "/Positivo-transparente.png", color: "#6366f1", label: "Ambos" },
    meta: { src: "/meta.jpg", color: "#0d6efd", label: "Meta" },
    tiktok: { src: "/tiktok.png", color: "#000000", label: "TikTok" },
  };

  const IconFilter = ({ keyName }) => {
    const active = red === keyName;
    const { src, color, label } = ICONS[keyName];

    return (
      <button
        onClick={() => setRed(keyName)}
        aria-label={label}
        title={label}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 28px",
          borderRadius: "999px",
          border: "none",
          backgroundColor: active ? color : "transparent",
          color: active ? "#fff" : "#475569",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: active ? `0 6px 16px ${color}40` : "none",
        }}
        onMouseOver={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = "#f1f5f9";
        }}
        onMouseOut={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <img
            src={src}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <span style={{ fontSize: "18px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      </button>
    );
  };

  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}>
      {/* Contenedor de Encabezado Centrado */}
      <div style={{
        display: "flex",
        flexDirection: "column", // Apila el título sobre los filtros
        alignItems: "center",    // Centra todo horizontalmente
        gap: "20px",             // Espacio entre título y botones
        marginBottom: "30px"
      }}>
        <h3 style={{
          margin: 0,
          fontSize: "20px",
          color: "#1e293b",
          fontWeight: "600",
          textAlign: "center"
        }}>
          LEADS
        </h3>

        {/* El "Pill" o cápsula de filtros ahora está centrada por el padre */}
        <div style={{
          display: "flex",
          backgroundColor: "#f8fafc",
          padding: "6px",         // Un poco más de aire interno
          borderRadius: "999px",
          border: "1px solid #e2e8f0",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)", // Sombra interna sutil
          width: "fit-content"    // Asegura que no se estire
        }}>
          <IconFilter keyName="ambos" />
          <IconFilter keyName="meta" />
          <IconFilter keyName="tiktok" />
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ marginTop: "10px" }}>
        <Chart options={options} series={series} type="line" height={420} />
      </div>
    </div>
  );
};