import React, { useEffect, useMemo, useState } from "react";
import { Badge, ButtonGroup, Button, Card, Table } from "react-bootstrap";
import { PTApi } from "@/common";

// GET /prospectos-redes/publicaciones?red=FACEBOOK|INSTAGRAM&limite=N responde:
// { fakeData, publicaciones: [{ id, id_red, red, id_publicacion, fecha (ISO UTC), tipo, texto, likes, comentarios, compartidos, visualizaciones }] }
// Lee tb_publicaciones_redes: ultimas 50 de Facebook y 50 de Instagram (cron diario 11:45pm).
const FILTROS = [
  { label: "Todas", value: "" },
  { label: "Facebook", value: "FACEBOOK" },
  { label: "Instagram", value: "INSTAGRAM" },
];
const COLOR_RED = { FACEBOOK: "primary", INSTAGRAM: "danger" };

// fecha viene en UTC: se muestra en hora de Perú
const formatoFecha = (iso) =>
  new Date(iso).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const numero = (n) => (n === null || n === undefined ? "-" : Number(n).toLocaleString("es-PE"));

// Columnas que se pueden ordenar con clic en el encabezado (1er clic desc, 2do asc).
// Sin orden elegido, la tabla queda por fecha desc (como la envia el backend).
const COLUMNAS_ORDEN = [
  { campo: "likes", label: "Likes" },
  { campo: "comentarios", label: "Comentarios" },
  { campo: "compartidos", label: "Compartidos" },
  { campo: "visualizaciones", label: "Visualizaciones" },
];

const PublicacionesRedes = () => {
  const [red, setRed] = useState("");
  const [publicaciones, setPublicaciones] = useState([]);
  const [fakeData, setFakeData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState({ campo: null, dir: "desc" });

  const cambiarOrden = (campo) =>
    setOrden((o) =>
      o.campo === campo
        ? { campo, dir: o.dir === "desc" ? "asc" : "desc" }
        : { campo, dir: "desc" },
    );

  const publicacionesOrdenadas = useMemo(() => {
    if (!orden.campo) return publicaciones;
    const signo = orden.dir === "asc" ? 1 : -1;
    // empate: la mas reciente primero
    return [...publicaciones].sort(
      (a, b) =>
        signo * ((Number(a[orden.campo]) || 0) - (Number(b[orden.campo]) || 0)) ||
        b.fecha.localeCompare(a.fecha),
    );
  }, [publicaciones, orden]);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await PTApi.get("/prospectos-redes/publicaciones", {
          params: { red: red || undefined, limite: 100 },
        });
        setPublicaciones(Array.isArray(data?.publicaciones) ? data.publicaciones : []);
        setFakeData(Boolean(data?.fakeData));
      } catch (err) {
        console.error(err);
        setError("No se pudo obtener las publicaciones");
        setPublicaciones([]);
      } finally {
        setIsLoading(false);
      }
    };
    obtenerPublicaciones();
  }, [red]);

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h4 className="header-title m-0">
            Últimas publicaciones{" "}
            {publicaciones.length > 0 && <span className="text-muted fs-6">({publicaciones.length})</span>}{" "}
            {fakeData && <Badge bg="warning" text="dark">Datos de prueba</Badge>}
            {orden.campo && (
              <Button variant="link" size="sm" className="p-0 ms-2 align-baseline" onClick={() => setOrden({ campo: null, dir: "desc" })}>
                Quitar orden
              </Button>
            )}
          </h4>
          <ButtonGroup size="sm">
            {FILTROS.map((f) => (
              <Button
                key={f.value}
                variant={red === f.value ? "primary" : "outline-primary"}
                onClick={() => setRed(f.value)}
                disabled={isLoading}
              >
                {f.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        {error && <div className="text-danger">{error}</div>}
        {!error && !isLoading && publicaciones.length === 0 && (
          <div className="text-muted">No hay publicaciones</div>
        )}
        {publicaciones.length > 0 && (
          <div style={{ maxHeight: 600, overflowY: "auto" }}>
          <Table hover size="sm" className="align-middle mb-0">
            <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th>Red</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Publicación</th>
                {COLUMNAS_ORDEN.map(({ campo, label }) => {
                  const activo = orden.campo === campo;
                  return (
                    <th
                      key={campo}
                      className={`text-end text-nowrap ${activo ? "text-primary" : ""}`}
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => cambiarOrden(campo)}
                      title="Ordenar"
                    >
                      {label} {activo ? (orden.dir === "desc" ? "▼" : "▲") : <span className="text-muted">⇅</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {publicacionesOrdenadas.map((p) => (
                <tr key={p.id}>
                  <td><Badge bg={COLOR_RED[p.red] ?? "secondary"}>{p.red}</Badge></td>
                  <td className="text-nowrap">{formatoFecha(p.fecha)}</td>
                  <td>{p.tipo}</td>
                  <td style={{ maxWidth: 360 }} className="text-truncate" title={p.texto}>{p.texto}</td>
                  <td className="text-end">{numero(p.likes)}</td>
                  <td className="text-end">{numero(p.comentarios)}</td>
                  <td className="text-end">{numero(p.compartidos)}</td>
                  <td className="text-end">{numero(p.visualizaciones)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PublicacionesRedes;
