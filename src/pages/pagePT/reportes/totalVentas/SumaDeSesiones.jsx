import React from "react";

export function SumaDeSesiones({ resumenArray, resumenTotales, avataresDeProgramas = [] }) {
  if (!Array.isArray(resumenArray) || resumenArray.length === 0) return null;

  // Filtramos para eliminar las dos últimas columnas
  const filterCols = (cols) => cols.slice(0, -2);

  return (
    <div style={{ margin: "32px 0" }}>
      {/* Avatares de programas */}
      {Array.isArray(avataresDeProgramas) && avataresDeProgramas.length > 0 && (
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginBottom: "16px" }}>
          {avataresDeProgramas.map((img, idx) => (
            <img
              key={idx}
              className="mx-4"
              src={img.urlImage || img}
              height={img.height || 100}
              width={img.width || 180}
              alt={img.name_image || `avatar-${idx}`}
              style={{ objectFit: "contain", borderRadius: "8px" }}
            />
          ))}
        </div>
      )}

      <h2 className="fw-bold">Ventas de programas</h2>
      <table className="table table-bordered table-striped">
        <thead className="bg-primary text-white">
          <tr>
            {filterCols(resumenArray[0]).map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resumenArray.map((fila, idx) => (
            <tr key={idx}>
              {filterCols(fila).map((col, j) => (
                <td key={j} className={col.isPropiedad ? "fw-bold" : ""}>
                  {col.value ?? col.HTML ?? ""}
                </td>
              ))}
            </tr>
          ))}

          {/* Totales */}
          {Array.isArray(resumenTotales) && resumenTotales.length > 0 && (
            <tr className="fw-bold bg-light">
              {filterCols(resumenTotales).map((col, idx) => (
                <td key={idx}>{col.value ?? col.HTML ?? ""}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
