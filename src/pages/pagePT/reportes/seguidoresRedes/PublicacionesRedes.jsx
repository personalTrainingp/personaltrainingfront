import React, { useEffect, useState } from "react";
import { Badge, ButtonGroup, Button, Card, Table } from "react-bootstrap";
import { PTApi } from "@/common";

// GET /prospectos-redes/publicaciones?red=FACEBOOK|INSTAGRAM&limite=N responde:
// { fakeData, publicaciones: [{ id, id_red, red, fecha (ISO UTC), tipo, texto, likes, comentarios, compartidos, enlace }] }
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

const PublicacionesRedes = () => {
  const [red, setRed] = useState("");
  const [publicaciones, setPublicaciones] = useState([]);
  const [fakeData, setFakeData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await PTApi.get("/prospectos-redes/publicaciones", {
          params: { red: red || undefined, limite: 20 },
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
            {fakeData && <Badge bg="warning" text="dark">Datos de prueba</Badge>}
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
          <Table responsive hover size="sm" className="align-middle mb-0">
            <thead>
              <tr>
                <th>Red</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Publicación</th>
                <th className="text-end">Likes</th>
                <th className="text-end">Comentarios</th>
                <th className="text-end">Compartidos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {publicaciones.map((p) => (
                <tr key={p.id}>
                  <td><Badge bg={COLOR_RED[p.red] ?? "secondary"}>{p.red}</Badge></td>
                  <td className="text-nowrap">{formatoFecha(p.fecha)}</td>
                  <td>{p.tipo}</td>
                  <td style={{ maxWidth: 360 }} className="text-truncate" title={p.texto}>{p.texto}</td>
                  <td className="text-end">{numero(p.likes)}</td>
                  <td className="text-end">{numero(p.comentarios)}</td>
                  <td className="text-end">{numero(p.compartidos)}</td>
                  <td>
                    {p.enlace && (
                      <a href={p.enlace} target="_blank" rel="noopener noreferrer">Ver</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default PublicacionesRedes;
