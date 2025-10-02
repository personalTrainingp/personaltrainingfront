import React from "react";

export function SumaDeSesiones({ resumenArray, resumenTotales, avataresDeProgramas = [] }) {
  if (!Array.isArray(resumenArray) || resumenArray.length === 0) return null;

  const filterCols = (cols) => cols.slice(0, -2);

  // Índice de la columna "S/. VENTA TOTAL"
  const ventaTotalIndex = resumenArray[0].findIndex(col => col.header.includes('VENTA TOTAL'));

  // Filtramos, convertimos a número y ordenamos
  const resumenFiltrado = resumenArray
    .filter(fila => fila[0].value !== 'TOTAL') // excluir fila TOTAL
    .map(fila => ({
      fila,
      venta: parseFloat(
        String(fila[ventaTotalIndex]?.value || '0')
          .replace(/\./g, '')   // eliminamos puntos de miles
          .replace(',', '.')    // convertimos coma decimal a punto
      ) || 0
    }))
    .filter(item => item.venta > 0) // solo ventas mayores a 0
    .sort((a, b) => b.venta - a.venta) // ordenar descendente
    .slice(0, 2) // solo los 2 primeros
    .map(item => item.fila); // recuperamos solo la fila original

  return (
    <div style={{ margin: "32px 0" }}>
      {/* Avatares */}
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
          {resumenFiltrado.map((fila, idx) => (
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
