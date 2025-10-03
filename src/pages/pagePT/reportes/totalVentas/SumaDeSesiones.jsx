import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";

const toNumber = (v) => {
  const s = String(v ?? "0").trim();
  if (s.includes("%")) return Number(s.replace("%", "").trim());
  return Number(s.replace(/,/g, "")) || 0;
};
const fmt = (n, mostrarCero = false) => {
  const num = Number(n) || 0;
  if (num === 0 && !mostrarCero) return "";
  return num.toLocaleString("es-PE");
};


export function SumaDeSesiones({
  resumenArray,
  resumenTotales, //lo dejamos por compatibilidad
  avataresDeProgramas = [],
  sociosOverride = {},  
}) {
  // 1) claves de programas tal como las pinta el header
  const progKeys = avataresDeProgramas.map(
    (p) => String(p?.name_image ?? "").trim().toUpperCase()
  );

  // 2) lista de asesores: toma de resumenArray (columna 0) y también del override
  const asesores = useMemo(() => {
    const fromResumen = Array.isArray(resumenArray)
      ? resumenArray
          .filter((f) => f?.[0]?.value !== "TOTAL")
          .map((f) => String(f?.[0]?.value ?? "").trim().toUpperCase())
      : [];
    const fromOverride = Object.values(sociosOverride).flatMap((porProg) =>
      Object.keys(porProg || {})
    );
    // únicos y con orden estable
    return Array.from(new Set([...fromResumen, ...fromOverride])).filter(Boolean);
  }, [resumenArray, sociosOverride]);
  //para paradeo de filas
  const hasOverrideData=
  Object.keys(sociosOverride || {}).length > 0 &&
  progKeys.some((k)=>sociosOverride[k] && Object.keys(sociosOverride[k]).length>0);
  if(!hasOverrideData) {
    return null;
  }

  // 3) construimos la matriz asesor × programa a partir del override
let filas = asesores.map((asesor) => {
  const row = [{ header: "NOMBRE", value: asesor, isPropiedad: true }];
  progKeys.forEach((pk) => {
    const val = sociosOverride?.[pk]?.[asesor] ?? 0;
    row.push({ header: pk, value: val });
  });
  return row;
});

// 👇 filtra asesores cuyo total es 0
filas = filas.filter(fila => {
  const totalRow = fila.slice(1).reduce((acc, c) => acc + toNumber(c.value), 0);
  return totalRow > 0;
});


  const sumCol = (idx) => filas.reduce((acc, f) => acc + toNumber(f[idx]?.value), 0);

  return (
    <Row>
      <Col lg={12}>
        <div style={{ margin: "32px 0" }}>
          <h2 className="fw-bold text-center mb-4">Venta de programas</h2>

          <table className="table table-bordered table-striped text-center">
            <thead className="bg-dark text-white">
              <tr>
                <th style={{ width: "180px" , fontSize:'20px',color:'white'}}>Nombre</th>
                {avataresDeProgramas.map((img, idx) => (
                  <th key={idx}>
                    <div
                      style={{
                        width: "180px",
                        height: "80px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        overflow: "hidden",                       
                      }}
                    >
                      <img
                        src={img.urlImage}
                        alt={img.name_image}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </th>
                ))}
                <th style={{fontSize:'20px',color:'white'}}>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {filas.map((fila, ridx) => (
                <tr key={ridx} style={{background:'#fff',fontSize:'18px'}}>
                  <td className="fw-bold text-start">{fila[0]?.value ?? ""}</td>
                  {progKeys.map((_, cidx) => {
                    const val = fila[cidx + 1]?.value ?? 0; // +1 por la col "Nombre"
                    return <td key={cidx}>{Number(val).toLocaleString("es-PE", )}</td>;
                  })}
                  <td>
                    {fila
                      .slice(1)
                      .reduce((acc, c) => acc + toNumber(c?.value), 0)
                      .toLocaleString("es-PE", )}
                  </td>
                </tr>
              ))}

             <tr className="fw-bold bg-light" style={{ background: '#fff', fontSize: '18px' }}>
  <td className="text-start">TOTAL</td>
  {progKeys.map((_, idx) => {
    const colIdx = idx + 1;
    return (
      <td key={idx}>
        {fmt(sumCol(colIdx), true)} {/* 👈 aquí siempre muestra 0 */}
      </td>
    );
  })}
  <td>
    {filas.reduce(
      (acc, f) => acc + f.slice(1).reduce((s, c) => s + toNumber(c?.value), 0),
      0
    ).toLocaleString("es-PE")}
  </td>
</tr>

            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
}
