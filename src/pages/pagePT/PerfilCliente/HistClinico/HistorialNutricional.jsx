import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row, Table } from "react-bootstrap";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { PTApi } from "@/common";

// CRUD de tb_historial_nutricional (medidas de composicion corporal por fecha) del cliente.
// GET    /dieta/historial-nutricional/:id_cli -> { historialNutricional: [{ id, id_cli, fecha: "YYYY-MM-DD", ...medidas }] }
// POST   /dieta/historial-nutricional/:id_cli
// PUT    /dieta/historial-nutricional/:id   (reemplaza todo el registro)
// DELETE /dieta/historial-nutricional/:id   (borrado logico)
const CAMPOS = [
  { campo: "peso", label: "Peso (kg)" },
  { campo: "talla", label: "Talla" },
  { campo: "mme", label: "MME (masa muscular esquelética)" },
  { campo: "masa_magra_corporal", label: "Masa magra corporal" },
  { campo: "tasa_metabolica_basal", label: "Tasa metabólica basal" },
  { campo: "relacion_cintura_cadera", label: "Relación cintura-cadera" },
  { campo: "nivel_grasa_visceral", label: "Nivel de grasa visceral" },
  { campo: "grado_obecidad", label: "Grado de obesidad" },
];

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const formularioVacio = () => ({
  fecha: hoy(),
  ...Object.fromEntries(CAMPOS.map(({ campo }) => [campo, ""])),
});
// fecha viene como texto YYYY-MM-DD: se muestra sin pasar por Date (evita el desfase de un dia)
const formatoFecha = (f) => (f ? f.split("-").reverse().join("/") : "-");
const numero = (n) =>
  n === null || n === undefined || n === "" ? "-" : Number(n).toLocaleString("es-PE", { maximumFractionDigits: 2 });

export const HistorialNutricional = ({ id_cli }) => {
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio());
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState(null);

  const obtenerRegistros = async () => {
    if (!id_cli) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await PTApi.get(`/dieta/historial-nutricional/${id_cli}`);
      setRegistros(Array.isArray(data?.historialNutricional) ? data.historialNutricional : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener el historial nutricional");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerRegistros();
  }, [id_cli]);

  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(formularioVacio());
    setErrorFormulario(null);
    setShow(true);
  };

  const abrirEditar = (r) => {
    setEditandoId(r.id);
    setFormulario({
      fecha: r.fecha,
      ...Object.fromEntries(CAMPOS.map(({ campo }) => [campo, r[campo] ?? ""])),
    });
    setErrorFormulario(null);
    setShow(true);
  };

  const cerrar = () => {
    if (!guardando) setShow(false);
  };

  const onChange = (e) => setFormulario((f) => ({ ...f, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    if (!formulario.fecha) {
      setErrorFormulario("La fecha es obligatoria");
      return;
    }
    setGuardando(true);
    setErrorFormulario(null);
    try {
      if (editandoId) {
        await PTApi.put(`/dieta/historial-nutricional/${editandoId}`, formulario);
      } else {
        await PTApi.post(`/dieta/historial-nutricional/${id_cli}`, formulario);
      }
      setShow(false);
      obtenerRegistros();
    } catch (err) {
      console.error(err);
      setErrorFormulario(err?.response?.data?.msg ?? "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = (r) => {
    confirmDialog({
      header: "Confirmar eliminación",
      message: `¿Está seguro de eliminar la evaluación del ${formatoFecha(r.fecha)}?`,
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await PTApi.delete(`/dieta/historial-nutricional/${r.id}`);
          obtenerRegistros();
        } catch (err) {
          console.error(err);
          setError("No se pudo eliminar el registro");
        }
      },
    });
  };

  return (
    <>
      <Row className="mb-2 align-items-center">
        <Col>
          <h5 className="m-0">Historial nutricional</h5>
        </Col>
        <Col xs="auto">
          <Button label="Agregar evaluación" onClick={abrirNuevo} icon="pi pi-plus" iconPos="right" disabled={!id_cli} />
        </Col>
      </Row>
      {error && <div className="text-danger mb-2">{error}</div>}
      {isLoading && <div className="text-muted mb-2">Cargando...</div>}
      {!isLoading && !error && registros.length === 0 && (
        <div className="text-muted mb-3">No hay evaluaciones registradas</div>
      )}
      {registros.length > 0 && (
        <Table responsive hover size="sm" className="align-middle mb-4">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              {CAMPOS.map(({ campo, label }) => (
                <th key={campo} className="text-end">{label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id}>
                <td className="text-nowrap">{formatoFecha(r.fecha)}</td>
                {CAMPOS.map(({ campo }) => (
                  <td key={campo} className="text-end">{numero(r[campo])}</td>
                ))}
                <td className="text-nowrap text-end">
                  <Button icon="pi pi-pencil" rounded text aria-label="Editar" title="Editar" onClick={() => abrirEditar(r)} />
                  <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Eliminar" title="Eliminar" onClick={() => eliminar(r)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={cerrar} size="lg" centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>{editandoId ? "Editar evaluación" : "Nueva evaluación"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Fecha *</Form.Label>
                  <Form.Control type="date" name="fecha" value={formulario.fecha} onChange={onChange} required />
                </Form.Group>
              </Col>
              {CAMPOS.map(({ campo, label }) => (
                <Col md={4} key={campo}>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name={campo}
                      value={formulario[campo]}
                      onChange={onChange}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            {errorFormulario && <div className="text-danger mt-3">{errorFormulario}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" label="Cancelar" severity="secondary" outlined onClick={cerrar} disabled={guardando} />
            <Button type="submit" label={guardando ? "Guardando..." : "Guardar"} disabled={guardando} />
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
