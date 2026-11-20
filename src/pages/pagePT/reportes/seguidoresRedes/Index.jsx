import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import { PageBreadcrumb } from "@/components";
import { PTApi } from "@/common";
import PublicacionesRedes from "./PublicacionesRedes";

// GET /prospectos-redes/metricas-semanales?desde=YYYY-MM-DD&hasta=YYYY-MM-DD responde las semanas (bloques de 7 dias
// desde el primer post de cada red) que se cruzan con el rango:
// { desde, hasta, metricasSemanales: [{ id, id_red, red: "FACEBOOK", semana_inicio, semana_fin, seguidores,
//   seguidores_ganados, seguidores_perdidos, posts, likes, comentarios }] }
// seguidores puede venir null (Instagram solo tiene el ultimo año): esa semana queda sin punto en el grafico.
// likes y comentarios son de los posts publicados en la semana, con lo que acumularon hasta hoy.
const toRows = (resp) => (Array.isArray(resp?.metricasSemanales) ? resp.metricasSemanales : []);
// Inicio del historial guardado (primer post de Facebook: 13/09/2024)
const INICIO_HISTORIAL = "2024-09-01";
const formatoDia = (f) => f.split("-").reverse().join("/");

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

// Grafico de una sola red: una linea por metrica; eje X = semanas de esa red (por su dia de inicio).
const buildChart = (rows, red) => {
  // semana_inicio viene como texto YYYY-MM-DD: se ordena como texto, sin pasar por Date
  const filasRed = rows.filter((r) => nombreRed(r) === red).sort((a, b) => a.semana_inicio.localeCompare(b.semana_inicio));
  const series = filasRed.length
    ? METRICAS.map((m) => ({
        name: m.label,
        data: filasRed.map((fila) => (fila[m.campo] === null || fila[m.campo] === undefined ? null : Number(fila[m.campo]))),
      }))
    : [];
  return {
    categories: filasRed.map((f) => formatoDia(f.semana_inicio)),
    // texto del tooltip para cada punto
    rangos: filasRed.map((f) => `Semana del ${formatoDia(f.semana_inicio)} al ${formatoDia(f.semana_fin)}`),
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
  const { categories, rangos, series, colores, dashes, ejes } = useMemo(() => buildChart(rows, red), [rows, red]);
  const options = {
    chart: { id: `seguidores-${red.toLowerCase()}`, toolbar: { show: true }, zoom: { enabled: false } },
    colors: colores,
    stroke: { curve: "smooth", width: 3, dashArray: dashes },
    markers: { size: categories.length > 30 ? 0 : 4, hover: { size: 5 } },
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { rotate: -45, hideOverlappingLabels: true }, tickAmount: Math.min(categories.length, 24) },
    yaxis: buildYAxis(series, ejes),
    legend: { position: "top" },
    tooltip: {
      shared: true,
      intersect: false,
      x: { formatter: (_, { dataPointIndex }) => rangos[dataPointIndex] ?? "" },
      y: { formatter: formatoNumero },
    },
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
  // Por defecto todo el historial semanal
  const [desde, setDesde] = useState(INICIO_HISTORIAL);
  const [hasta, setHasta] = useState(dayjs().format("YYYY-MM-DD"));
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerSeguidores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await PTApi.get("/prospectos-redes/metricas-semanales", { params: { desde, hasta } });
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
