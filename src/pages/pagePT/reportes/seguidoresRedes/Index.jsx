import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import { PageBreadcrumb } from "@/components";
import { PTApi } from "@/common";
import PublicacionesRedes from "./PublicacionesRedes";

// GET /prospectos-redes/seguidores?desde=YYYY-MM-DD&hasta=YYYY-MM-DD responde:
// { desde, hasta, seguidoresRedes: [{ id, id_red, red: "FACEBOOK", seguidores, likes, comentarios, fecha: "YYYY-MM-DD" }] }
const toRows = (resp) => (Array.isArray(resp?.seguidoresRedes) ? resp.seguidoresRedes : []);

const nombreRed = (r) => r.red ?? `RED ${r.id_red}`;

// Seguidores en el eje izquierdo (linea solida); likes y comentarios en el derecho (punteada),
// porque su escala es mucho menor.
const METRICAS = [
  { campo: "seguidores", label: "SEGUIDORES", eje: "seguidores", dash: 0 },
  { campo: "likes", label: "LIKES", eje: "interaccion", dash: 6 },
  { campo: "comentarios", label: "COMENTARIOS", eje: "interaccion", dash: 2 },
];
const COLORES_RED = {
  FACEBOOK: ["#1877F2", "#5B9BF8", "#9EC3FB"],
  INSTAGRAM: ["#E1306C", "#EC6F99", "#F5A9C3"],
  TIKTOK: ["#111111", "#25F4EE", "#FE2C55"],
};
// Un grafico por red (label_param de terminologia, grupo "seguidores")
const REDES = [
  { red: "FACEBOOK", titulo: "Facebook" },
  { red: "INSTAGRAM", titulo: "Instagram" },
  { red: "TIKTOK", titulo: "TikTok" },
];
const COLORES_OTROS = ["#6c757d", "#9aa1a7", "#c4c8cc"];

// Grafico de una sola red: una linea por metrica; eje X = fechas de esa red.
const buildChart = (rows, red) => {
  const filasRed = rows.filter((r) => nombreRed(r) === red);
  // fecha viene como texto YYYY-MM-DD: se ordena como texto, sin pasar por Date
  const fechas = [...new Set(filasRed.map((r) => r.fecha))].sort();
  const series = filasRed.length
    ? METRICAS.map((m) => ({
        name: m.label,
        data: fechas.map((f) => {
          const fila = filasRed.find((r) => r.fecha === f);
          return fila ? Number(fila[m.campo] ?? 0) : null;
        }),
      }))
    : [];
  return {
    categories: fechas.map((f) => f.split("-").reverse().join("/")),
    series,
    colores: COLORES_RED[red] ?? COLORES_OTROS,
    dashes: METRICAS.map((m) => m.dash),
    ejes: METRICAS.map((m) => m.eje),
  };
};

const formatoNumero = (v) => (v === null || v === undefined ? "-" : Math.round(v).toLocaleString("es-PE"));

// ApexCharts pide un yaxis por serie: cada una se ata a la primera serie de su eje
// (seriesName) y solo se muestra un eje izquierdo y un eje derecho.
const buildYAxis = (series, ejes) => {
  // sin datos (carga inicial o red sin registros, ej. TikTok) no hay series que atar
  if (!series.length) return [];
  const primera = {};
  ejes.forEach((eje, i) => { if (!(eje in primera)) primera[eje] = series[i].name; });
  const mostrado = {};
  return series.map((_, i) => {
    const eje = ejes[i];
    const show = !mostrado[eje];
    mostrado[eje] = true;
    return {
      seriesName: primera[eje],
      opposite: eje === "interaccion",
      show,
      min: 0,
      forceNiceScale: true,
      title: { text: eje === "seguidores" ? "Seguidores" : "Likes / Comentarios" },
      labels: { formatter: formatoNumero },
    };
  });
};

const GraficoRed = ({ titulo, red, rows, isLoading, error }) => {
  const { categories, series, colores, dashes, ejes } = useMemo(() => buildChart(rows, red), [rows, red]);
  const options = {
    chart: { id: `seguidores-${red.toLowerCase()}`, toolbar: { show: true }, zoom: { enabled: false } },
    colors: colores,
    stroke: { curve: "smooth", width: 3, dashArray: dashes },
    markers: { size: 4 },
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { rotate: -45 } },
    yaxis: buildYAxis(series, ejes),
    legend: { position: "top" },
    tooltip: { shared: true, intersect: false, y: { formatter: formatoNumero } },
  };
  return (
    <Card>
      <Card.Body>
        <h4 className="header-title mb-3">{titulo}</h4>
        {error && <div className="text-danger">{error}</div>}
        {!error && !isLoading && series.length === 0 && (
          <div className="text-muted">No hay datos para el rango seleccionado</div>
        )}
        {series.length > 0 && (
          <Chart options={options} series={series} type="line" height={400} />
        )}
      </Card.Body>
    </Card>
  );
};

const SeguidoresRedes = () => {
  const [desde, setDesde] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [hasta, setHasta] = useState(dayjs().format("YYYY-MM-DD"));
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerSeguidores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await PTApi.get("/prospectos-redes/seguidores", { params: { desde, hasta } });
      setRows(toRows(data));
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener la data de seguidores");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { obtenerSeguidores(); }, []);

  return (
    <>
      <PageBreadcrumb title="REPORTE REDES SOCIALES" subName="Marketing" />
      <Row className="mb-3">
        <Col lg={12}>
          <Card>
            <Card.Body className="d-flex align-items-end gap-3 flex-wrap">
              <Form.Group>
                <Form.Label>Desde</Form.Label>
                <Form.Control type="date" value={desde} max={hasta} onChange={(e) => setDesde(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Hasta</Form.Label>
                <Form.Control type="date" value={hasta} min={desde} onChange={(e) => setHasta(e.target.value)} />
              </Form.Group>
              <Button onClick={obtenerSeguidores} disabled={isLoading || !desde || !hasta}>
                {isLoading ? "Cargando..." : "Actualizar"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {REDES.map((r) => (
          <Col lg={12} key={r.red}>
            <GraficoRed titulo={r.titulo} red={r.red} rows={rows} isLoading={isLoading} error={error} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={12}>
          <PublicacionesRedes />
        </Col>
      </Row>
    </>
  );
};

export default SeguidoresRedes;
