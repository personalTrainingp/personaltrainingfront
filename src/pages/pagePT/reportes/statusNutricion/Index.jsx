import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { PageBreadcrumb } from "@/components";
import { PTApi } from "@/common";

// GET /dieta/historial-nutricional?desde=YYYY-MM-DD&hasta=YYYY-MM-DD responde:
// { desde, hasta, historialNutricional: [{ id, id_cli, uid_cli, numDoc_cli, cliente, fecha: "YYYY-MM-DD", ...medidas }] }
// Las evaluaciones se registran en el perfil del cliente (tab "Historial clinico").
// La tabla se muestra agrupada: fila con el nombre del cliente y debajo sus evaluaciones.
const CAMPOS = [
  { campo: "peso", label: "Peso (kg)" },
  { campo: "talla", label: "Talla" },
  { campo: "mme", label: "MME" },
  { campo: "masa_magra_corporal", label: "Masa magra corporal" },
  { campo: "tasa_metabolica_basal", label: "Tasa metabólica basal" },
  { campo: "relacion_cintura_cadera", label: "Relación cintura-cadera" },
  { campo: "nivel_grasa_visceral", label: "Nivel grasa visceral" },
  { campo: "grado_obecidad", label: "Grado de obesidad" },
];

// fecha viene como texto YYYY-MM-DD: se muestra sin pasar por Date (evita el desfase de un dia)
// filas 0 (nombre del cliente) y 1 (encabezados) de cada cliente
const ESTILO_ROJO = { backgroundColor: "#dc3545", color: "#fff", borderColor: "#fff" };

const formatoFecha = (f) => (f ? f.split("-").reverse().join("/") : "-");
const numero = (n) =>
  n === null || n === undefined ? "-" : Number(n).toLocaleString("es-PE", { maximumFractionDigits: 2 });

const StatusNutricion = () => {
  const [desde, setDesde] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [hasta, setHasta] = useState(dayjs().format("YYYY-MM-DD"));
  const [busqueda, setBusqueda] = useState("");
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerRegistros = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await PTApi.get("/dieta/historial-nutricional", { params: { desde, hasta } });
      setRegistros(Array.isArray(data?.historialNutricional) ? data.historialNutricional : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg ?? "No se pudo obtener el historial nutricional");
      setRegistros([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerRegistros();
  }, []);

  // filtro por nombre o documento del cliente (en el navegador)
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return registros;
    return registros.filter(
      (r) => (r.cliente ?? "").toLowerCase().includes(texto) || (r.numDoc_cli ?? "").includes(texto),
    );
  }, [registros, busqueda]);

  // Agrupado por cliente: una fila con el nombre y debajo sus evaluaciones (fecha desc).
  // Clientes ordenados por nombre.
  const grupos = useMemo(() => {
    const porCliente = new Map();
    for (const r of filtrados) {
      if (!porCliente.has(r.id_cli)) {
        porCliente.set(r.id_cli, {
          id_cli: r.id_cli,
          uid_cli: r.uid_cli,
          cliente: r.cliente || `Cliente ${r.id_cli}`,
          evaluaciones: [],
        });
      }
      porCliente.get(r.id_cli).evaluaciones.push(r);
    }
    return [...porCliente.values()].sort((a, b) => a.cliente.localeCompare(b.cliente, "es"));
  }, [filtrados]);

  return (
    <>
      <PageBreadcrumb title="STATUS NUTRICIÓN" subName="Informe gerencial" />
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
              <Button onClick={obtenerRegistros} disabled={isLoading || !desde || !hasta}>
                {isLoading ? "Cargando..." : "Actualizar"}
              </Button>
              <Form.Group className="ms-auto">
                <Form.Label>Buscar cliente</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Nombre o documento"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-3">
                Evaluaciones nutricionales{" "}
                {grupos.length > 0 && (
                  <span className="text-muted fs-6">
                    ({grupos.length} {grupos.length === 1 ? "cliente" : "clientes"}, {filtrados.length}{" "}
                    {filtrados.length === 1 ? "evaluación" : "evaluaciones"})
                  </span>
                )}
              </h4>
              {error && <div className="text-danger">{error}</div>}
              {!error && !isLoading && filtrados.length === 0 && (
                <div className="text-muted">No hay evaluaciones para el rango seleccionado</div>
              )}
              {filtrados.length > 0 && (
                <div style={{ maxHeight: "80vh", overflow: "auto" }}>
                  <Table bordered size="lg" className="align-middle mb-0 fs-5">
                    <tbody>
                      {grupos.map((g) => (
                        <React.Fragment key={g.id_cli}>
                          {/* fila 0: nombre del cliente */}
                          <tr className="fs-3 text-center">
                            <td colSpan={CAMPOS.length + 1} className="fw-bold" style={ESTILO_ROJO}>
                              {g.uid_cli ? (
                                <Link to={`/historial-cliente/${g.uid_cli}`} style={{ color: "#fff", textDecoration: "underline" }}>
                                  {g.cliente}
                                </Link>
                              ) : (
                                g.cliente
                              )}{" "}
                              <span className="fw-normal">({g.evaluaciones.length})</span>
                            </td>
                          </tr>
                          {/* fila 1: encabezados */}
                          <tr className="fs-3">
                            <th style={ESTILO_ROJO}>Fecha</th>
                            {CAMPOS.map(({ campo, label }) => (
                              <th key={campo} className="text-end" style={ESTILO_ROJO}>{label}</th>
                            ))}
                          </tr>
                          {g.evaluaciones.map((r) => (
                            <tr key={r.id}>
                              <td className="text-nowrap fs-3">{formatoFecha(r.fecha)}</td>
                              {CAMPOS.map(({ campo }) => (
                                <td key={campo} className="text-center fs-3">{numero(r[campo])}</td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatusNutricion;
