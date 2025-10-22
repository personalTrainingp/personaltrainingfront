import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { reservasApi } from "../../../api/reservasApi";
import { PTApi } from "@/common";

const fmt = (s) => (s ? new Date(s).toLocaleString("es-PE") : "");

const toISO = (v) => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v.toISOString();
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : d.toISOString();
  }
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (m) {
    const [, dd, MM, yyyy, hh = "00", mm = "00"] = m;
    const d = new Date(+yyyy, +MM - 1, +dd, +hh, +mm, 0, 0);
    return isNaN(d) ? null : d.toISOString();
  }
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString();
};

const API_HOST = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");
const logoUrl = (name) => `${API_HOST}/api/file/logo/${name}`;

function ModalReservaMonkFit({ show, onHide, initial, onSaved }) {
  const [saving, setSaving] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [estados, setEstados] = useState([]);

  const [form, setForm] = useState({
    id_pgm: "",
    fecha: "",
    id_estado_param: null, 
    flag: true,
  });

  const ID_EMPRESA = 598;
 const mapClienteToOption = (c) => ({
  value: Number(c.value ?? c.id_cli),
  label:
    c.label ||
    c.nombres_apellidos_cli ||
    [c.nombre_cli, c.apPaterno_cli, c.apMaterno_cli].filter(Boolean).join(" ") ||
    String(c.numDoc_cli || c.id_cli || c.value),
});

  const loadClientes = async (inputValue) => {
const { data } = await PTApi.get(`/parametros/get_params/clientes/${ID_EMPRESA}`);
const source = extractClientes(data);
    const txt = (inputValue || "").toLowerCase();
    const filtered = txt
      ? source.filter((c) =>
          [c.label, c.nombres_apellidos_cli, c.numDoc_cli, c.nombre_cli, c.apPaterno_cli, c.apMaterno_cli]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(txt))
        )
      : source.slice(0, 30);
    return filtered.map(mapClienteToOption);
  };

  useEffect(() => {
    (async () => {
      try {
      const { data } = await PTApi.get(`/parametros/get_params/clientes/${ID_EMPRESA}`);
 const source = extractClientes(data);
         setClientes(source.map(mapClienteToOption));
      } catch {
        setClientes([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await PTApi.get("/programaTraining/get_tb_pgm");
        const opts = (data || [])
          .filter((p) => p?.estado_pgm !== false)
          .map((p) => ({
            value: p.id_pgm ?? p.id ?? p.p_id_pgm,
            label: p.name_pgm || p.sigla_pgm || "Programa",
            image: p?.tb_image?.name_image ? logoUrl(p.tb_image.name_image) : undefined,
            raw: p,
          }));
        setProgramas(opts);
      } catch {
        setProgramas([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const rows = await reservasApi.listEstados(); 
         const opts = (Array.isArray(rows) ? rows : []).map((r) => {
            if (r && r.value !== undefined && r.label !== undefined) {
                 return { value: Number(r.value), label: String(r.label) };
                  }
                   return { value: Number(r.id_param), label: String(r.label_param) };
                   });
+        setEstados(opts);
      } catch {
        setEstados([]);
      }
    })();
  }, []);

  useEffect(() => {
    const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");
    if (initial) {
      setForm({
        id_cli: initial.id_cli ?? "",
        id_pgm: initial.id_pgm ?? "",
        fecha: toLocalInput(initial.fecha),
        id_estado_param:
          initial.id_estado_param ??
          (initial.estado?.id_param ? Number(initial.estado.id_param) : null),
        flag: !!initial.flag,
      });
    } else {
      setForm({ id_cli: "", id_pgm: "", fecha: "", id_estado_param: null, flag: true });
    }
  }, [initial, show]);

  const [clienteSel, setClienteSel] = useState(null);
  useEffect(() => {
    if (!initial?.id_cli) { setClienteSel(null); return; }
    (async () => {
      try {
       const { data } = await PTApi.get(`/parametros/get_params/clientes/${ID_EMPRESA}`);
        const list = Array.isArray(data?.clientes) ? data.clientes : [];
 const found = list.find((c) => Number(c.value ?? c.id_cli) === Number(initial.id_cli));
         setClienteSel(found ? mapClienteToOption(found) : { value: Number(initial.id_cli), label: `Cliente ${initial.id_cli}` });
      } catch {
        setClienteSel({ value: Number(initial.id_cli), label: `Cliente ${initial.id_cli}` });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id_cli]);

  const selPgm = programas.find((o) => o.value === Number(form.id_pgm)) || null;
  const selEstado = estados.find((o) => Number(o.value) === Number(form.id_estado_param)) || null;

const extractClientes = (data) =>
   Array.isArray(data) ? data : Array.isArray(data?.clientes) ? data.clientes : [];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
    const id_cli = clienteSel?.value != null ? Number(clienteSel.value) : null;
const id_pgm = (form.id_pgm !== "" && !isNaN(form.id_pgm))
 ? Number(form.id_pgm)
 : null;
      const payload = {
        id_cli,
        id_pgm,
        fecha: toISO(form.fecha),
        id_estado_param: form.id_estado_param ? Number(form.id_estado_param) : null,
        flag: !!form.flag,
      };
 console.log("[ReservaMonkFit] payload FINAL →", payload, { clienteSel });
      if (!id_cli || !id_pgm || !payload.fecha) {
        alert("Cliente, programa y fecha son obligatorios.");
        setSaving(false);
        return;
      }

      if (initial && initial.id) await reservasApi.update(initial.id, payload);
      else await reservasApi.create(payload);

      onSaved(initial ? "Reserva actualizada" : "Reserva creada");
      onHide();
    } catch (err) {
      console.error("❌ Error al guardar reserva:", err);
      onSaved("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>{initial ? "Editar reserva" : "Nueva reserva"}</Modal.Header>
      <Modal.Body>
        <Row>
          <Col xl={12}>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xl={4}>
                  <div className="mb-2">
                    <label className="form-label">Cliente*</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={clientes}
                      loadOptions={loadClientes}
                      placeholder="Buscar cliente por nombre o DNI"
                      value={clienteSel}
                      onChange={(opt) => {
const norm = opt ? { value: Number(opt.value), label: String(opt.label) } : null;
                      setClienteSel(norm);}}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                        menu: (b) => ({ ...b, zIndex: 9999 }),
                      }}
                    />
                  </div>
                </Col>

                <Col xl={4}>
                  <div className="mb-2">
                    <label className="form-label">Programa*</label>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Selecciona programa"
                      options={programas}
                      value={selPgm}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (b) => ({ ...b, zIndex: 2000 }), menu: (b) => ({ ...b, zIndex: 2000 }) }}
                      closeMenuOnScroll={false}
                      onChange={(opt) => setForm((f) => ({ ...f, id_pgm: opt ? Number(opt.value) : "" }))}
                      isClearable
                    />
                  </div>
                </Col>

                <Col xl={4}>
                  <div className="mb-2">
                    <label className="form-label">Fecha*</label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      value={form.fecha}
                      onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                      required
                    />
                  </div>
                </Col>

                <Col xl={4}>
                  <div className="mb-2">
                    <label className="form-label">Estado</label>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Selecciona estado"
                      options={estados}
                      value={selEstado}
                      onChange={(opt) => setForm((f) => ({ ...f, id_estado_param: opt ? Number(opt.value) : null }))}
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (b) => ({ ...b, zIndex: 2000 }), menu: (b) => ({ ...b, zIndex: 2000 }) }}
                    />
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
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default function ReservaMonkFitPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const pages = useMemo(() => Math.max(1, Math.ceil(count / limit)), [count, limit]);
  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const load = async () => {
    const data = await reservasApi.list({ limit, offset, search });
    setRows(data.rows ?? []);
    setCount(data.count ?? 0);
  };
  useEffect(() => { load(); }, [limit, offset, search]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setModalOpen(true); };
  const onSaved = async (message) => { setToast(message); await load(); setTimeout(() => setToast(""), 1600); };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar (borrado lógico)?")) return;
    try { await reservasApi.remove(id); setToast("Reserva eliminada"); await load(); }
    catch { setToast("Error al eliminar"); }
    finally { setTimeout(() => setToast(""), 1600); }
  };

  const onSeed = async () => {
    try { await reservasApi.seed(); setToast("Reserva de prueba creada"); await load(); }
    catch { setToast("No se pudo crear la reserva de prueba"); }
    finally { setTimeout(() => setToast(""), 1600); }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="m-0">Reservas MonkFit</h3>
        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            placeholder="Buscar (id_cli o #id)"
            style={{ minWidth: 220 }}
            value={search}
            onChange={(e) => { setOffset(0); setSearch(e.target.value); }}
          />
          <Button className="bg-secondary" onClick={load}>Buscar</Button>
          <Button className="bg-primary"  onClick={openCreate}>Nueva reserva</Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Programa</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.id_cli}</td>
                <td>{r.id_pgm}</td>
                <td>{r?.estado?.label_param || "—"}</td>
                <td>{fmt(r.fecha)}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(r)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">Sin datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center">
        <div>Total: {count}</div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select" style={{ width: 90 }} value={limit} onChange={(e) => { setOffset(0); setLimit(Number(e.target.value)); }}>
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}/pág</option>)}
          </select>
          <nav>
            <ul className="pagination m-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setOffset(Math.max(0, (currentPage - 2) * limit))}>«</button>
              </li>
              {Array.from({ length: pages }).map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setOffset(i * limit)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === pages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setOffset(currentPage * limit)}>»</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalReservaMonkFit
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          initial={editing}
          onSaved={onSaved}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast show position-fixed bottom-0 end-0 m-3 text-bg-dark" role="alert" style={{ zIndex: 1080 }}>
          <div className="d-flex">
            <div className="toast-body">{toast}</div>
            <button className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast("")}></button>
          </div>
        </div>
      )}
    </div>
  );
}
