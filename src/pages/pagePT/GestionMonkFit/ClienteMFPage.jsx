import React, { useState, useEffect, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { clienteMfApi } from "@/api/clienteMfApi";

const fmtFechaHora = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return "—";
  return d.toLocaleString("es-PE");
};

const toISO = (value) => {
  if (!value) return null;
  // si ya es Date
  if (value instanceof Date && !isNaN(value)) {
    return value.toISOString();
  }
  const s = String(value).trim();

  // si ya vino con T
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : d.toISOString();
  }

  // solo fecha yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00`);
    return isNaN(d) ? null : d.toISOString();
  }

  // dd/mm/yyyy hh:mm
  const m = s.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/
  );
  if (m) {
    const [, dd, MM, yyyy, hh = "00", mm = "00"] = m;
    const d = new Date(+yyyy, +MM - 1, +dd, +hh, +mm, 0, 0);
    return isNaN(d) ? null : d.toISOString();
  }

  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString();
};


function ModalClienteMF({ show, onHide, initial, onSaved }) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre_cli: "",
    apellido_cli: "",
    email_cli: "",
    telefono_cli: "",
    fecha_primera_reserva: "",
    cant_reservas: "",
    flag: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nombre_cli: initial.nombre_cli ?? "",
        apellido_cli: initial.apellido_cli ?? "",
        email_cli: initial.email_cli ?? "",
        telefono_cli: initial.telefono_cli ?? "",
        fecha_primera_reserva: initial.fecha_primera_reserva
          ? new Date(initial.fecha_primera_reserva).toISOString().slice(0, 16)
          : "",
     
        cant_reservas:
          initial.cant_reservas !== undefined &&
          initial.cant_reservas !== null
            ? String(initial.cant_reservas)
            : "",
        flag: initial.flag !== false, // default true
      });
    } else {
      setForm({
        nombre_cli: "",
        apellido_cli: "",
        email_cli: "",
        telefono_cli: "",
        fecha_primera_reserva: "",
        cant_reservas: "",
        flag: true,
      });
    }
  }, [initial, show]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        nombre_cli: form.nombre_cli?.trim() || null,
        apellido_cli: form.apellido_cli?.trim() || null,
        email_cli: form.email_cli?.trim() || null,
        telefono_cli: form.telefono_cli?.trim() || null,

        fecha_primera_reserva: toISO(form.fecha_primera_reserva),

        cant_reservas:
          form.cant_reservas !== ""
            ? Number(form.cant_reservas)
            : 0,

        flag: !!form.flag,
      };

      if (initial && initial.id_cliente_mf) {
        // editar
        await clienteMfApi.update(initial.id_cliente_mf, payload);
      } else {
        // crear
        await clienteMfApi.create(payload);
      }

      onSaved(
        initial && initial.id_cliente_mf
          ? "Cliente actualizado"
          : "Cliente creado"
      );
      onHide();
    } catch (err) {
      console.error("❌ Error guardando cliente MF:", err);
      onSaved("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        {initial ? "Editar cliente MF" : "Nuevo cliente MF"}
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col md={6}>
              <label className="form-label">Nombre*</label>
              <input
                className="form-control"
                value={form.nombre_cli}
                onChange={(e) =>
                  handleChange("nombre_cli", e.target.value)
                }
                required
              />
            </Col>
            <Col md={6}>
              <label className="form-label">Apellido*</label>
              <input
                className="form-control"
                value={form.apellido_cli}
                onChange={(e) =>
                  handleChange("apellido_cli", e.target.value)
                }
                required
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={form.email_cli}
                onChange={(e) =>
                  handleChange("email_cli", e.target.value)
                }
              />
            </Col>
            <Col md={6}>
              <label className="form-label">Teléfono</label>
              <input
                className="form-control"
                value={form.telefono_cli}
                onChange={(e) =>
                  handleChange("telefono_cli", e.target.value)
                }
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <label className="form-label">
                Fecha 1ra reserva
              </label>
              <input
                className="form-control"
                type="datetime-local"
                value={form.fecha_primera_reserva}
                onChange={(e) =>
                  handleChange(
                    "fecha_primera_reserva",
                    e.target.value
                  )
                }
              />
            </Col>
          
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <label className="form-label">
               CANTIDAD DE RESERVAS
              </label>
              <input
                className="form-control"
                type="number"
                min="0"
                step="0.01"
                placeholder="19.00"
                value={form.cant_reservas}
                onChange={(e) =>
                  handleChange("cant_reservas", e.target.value)
                }
              />
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flagClienteMF"
                  checked={form.flag}
                  onChange={(e) =>
                    handleChange("flag", e.target.checked)
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="flagClienteMF"
                >
                  Activo
                </label>
              </div>
            </Col>
          </Row>

          <div className="mt-3">
            <Button className="me-3" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="outline-secondary" onClick={onHide}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}



export default function ClienteMFPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // pagination helpers
  const pages = useMemo(
    () => Math.max(1, Math.ceil(count / limit)),
    [count, limit]
  );
  const currentPage = useMemo(
    () => Math.floor(offset / limit) + 1,
    [offset, limit]
  );

  const load = useCallback(async () => {
    const data = await clienteMfApi.list({
      limit,
      offset,
      search,
    });
    setRows(data.rows ?? data.data ?? []); 
    setCount(data.count ?? data.total ?? 0);
  }, [limit, offset, search]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (cliente) => {
    setEditing(cliente);
    setModalOpen(true);
  };

  const onSaved = async (message) => {
    setToast(message);
    await load();
    setTimeout(() => setToast(""), 1600);
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar (borrado lógico)?")) return;
    try {
      await clienteMfApi.remove(id);
      setToast("Cliente eliminado");
      await load();
    } catch {
      setToast("Error al eliminar");
    } finally {
      setTimeout(() => setToast(""), 1600);
    }
  };

  const onSeed = async () => {
    try {
      await clienteMfApi.seed();
      setToast("Cliente de prueba creado");
      await load();
    } catch {
      setToast("No se pudo crear el cliente de prueba");
    } finally {
      setTimeout(() => setToast(""), 1600);
    }
  };


  const handleImportExcel = async (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const jsonRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const ops = jsonRows.map((r) => {
        const payload = {
          nombre_cli: (r.nombre_cli || r.nombre || "").trim() || null,
          apellido_cli: (r.apellido_cli || r.apellido || "").trim() || null,
          email_cli: (r.email_cli || r.email || "").trim() || null,
          telefono_cli: (r.telefono_cli || r.telefono || "").trim() || null,
          fecha_primera_reserva: toISO(
            r.fecha_primera_reserva || r.primera_reserva || ""
          ),
    
          cant_reservas: r.cant_reservas
            ? Number(r.cant_reservas)
            : 0,
          flag: true,
        };
        return clienteMfApi
          .create(payload)
          .catch((err) => ({ error: err.message }));
      });

      const results = await Promise.allSettled(ops);

      const okCount = results.filter(
        (r) => r.status === "fulfilled" && !r.value?.error
      ).length;
      const failCount = results.length - okCount;

      setToast(
        `Importación terminada. OK: ${okCount}, errores: ${failCount}`
      );
      await load();
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error("Error importando Excel:", err);
      setToast("Error al importar Excel");
      setTimeout(() => setToast(""), 2000);
    } finally {
      evt.target.value = "";
    }
  };

  return (
    <div className="container py-4">
      {/* HEADER / ACCIONES */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="m-0">Clientes MonkFit</h3>

        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            placeholder="Buscar (nombre, apellido, tel...)"
            style={{ minWidth: 240 }}
            value={search}
            onChange={(e) => {
              setOffset(0);
              setSearch(e.target.value);
            }}
          />
          <Button className="bg-secondary" onClick={load}>
            Buscar
          </Button>

          <Button className="bg-primary" onClick={openCreate}>
            Nuevo cliente
          </Button>

          <Button
            variant="outline-dark"
            className="border-secondary text-secondary"
            onClick={onSeed}
          >
            Seed test
          </Button>

          {/* IMPORTAR EXCEL */}
          <label className="btn btn-outline-success mb-0">
            Importar Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={handleImportExcel}
            />
          </label>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>1ra Reserva</th>
              <th>Cantidad Reservas </th>
              <th>Activo</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id_cliente_mf}>
                <td>#{r.id_cliente_mf}</td>
                <td>
                  {(r.nombre_cli || "") +
                    " " +
                    (r.apellido_cli || "")}
                </td>
                <td>{r.email_cli || "—"}</td>
                <td>{r.telefono_cli || "—"}</td>
                <td>{fmtFechaHora(r.fecha_primera_reserva)}</td>
                <td>
                  {r.cant_reservas != null
                    ? Number(r.cant_reservas).toFixed(2)
                    : "0.00"}
                </td>
                <td>{r.flag === false ? "No" : "Sí"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(r)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(r.id_cliente_mf)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>Total: {count}</div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            style={{ width: 90 }}
            value={limit}
            onChange={(e) => {
              setOffset(0);
              setLimit(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}/pág
              </option>
            ))}
          </select>

          <nav>
            <ul className="pagination m-0">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setOffset(Math.max(0, (currentPage - 2) * limit))
                  }
                >
                  «
                </button>
              </li>

              {Array.from({ length: pages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setOffset(i * limit)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === pages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setOffset(currentPage * limit)}
                >
                  »
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <ModalClienteMF
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          initial={editing}
          onSaved={onSaved}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3 text-bg-dark"
          role="alert"
          style={{ zIndex: 1080 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast}</div>
            <button
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast("")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
