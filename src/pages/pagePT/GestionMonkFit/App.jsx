import React, { useEffect, useMemo, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { reservasApi } from "@/api/reservasApi";
import { clienteMfApi } from "@/api/clienteMfApi";
import { PTApi } from "@/common";

// ===== Utils de fecha =====
const fmtFechaLocal = (s) => {
  if (!s) return "—";
  // tolerar "YYYY-MM-DD HH:mm:ss.000"
  let d = new Date(s);
  if (isNaN(d)) {
    const t = String(s).replace(" ", "T").replace(/\.\d+$/, "");
    d = new Date(t);
  }
  return isNaN(d) ? "—" : d.toLocaleString("es-PE");
};

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

// Helpers para convertir la respuesta de /api/cliente_mf en opciones del Select
const toClienteOptionsMF = (data) => {
  const rows = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : [];
  return rows.map(r => {
    const id = Number(r.id_cliente_mf);
    const nombre = [r.nombre_cli, r.apellido_cli].filter(Boolean).join(" ")
                  || r.email_cli
                  || `Cliente #${id}`;
    const badge = Number.isFinite(Number(r.cant_reservas))
      ? ` (${Number(r.cant_reservas)} reservas)`
      : "";
    return {
      value: id,
      label: `${nombre}${badge}`,
      raw: r,
    };
  });
};

function ModalReservaMonkFit({ show, onHide, initial, onSaved, programas }) {
  const [saving, setSaving] = useState(false);
  const [clienteSel, setClienteSel] = useState(null);
  const [estados, setEstados] = useState([]);
  const [clientesOpts, setClientesOpts] = useState([]); // ✅ <-- agrega esto
  const [form, setForm] = useState({
    id_pgm: "",
    fecha: "",
    id_estado_param: null,
    flag: true,
    codigo_reserva: "",
    monto_total: "",
  });


  useEffect(() => {
    (async () => {
      try {
        const rows = await reservasApi.listEstados();
        const opts = (Array.isArray(rows) ? rows : Array.isArray(rows?.data) ? rows.data : [])
          .map(r => r?.value !== undefined && r?.label !== undefined
            ? { value: Number(r.value), label: String(r.label) }
            : { value: Number(r.id_param), label: String(r.label_param) }
          );
        setEstados(opts);
      } catch {
        setEstados([]);
      }
    })();
  }, []);

  // carga inicial programas (si no vienen por props)
  const [pgmOpts, setPgmOpts] = useState(programas || []);
  useEffect(() => {
    if (programas?.length) { setPgmOpts(programas); return; }
    (async () => {
      try {
        const { data } = await PTApi.get("/programaTraining/get_tb_pgm");
        const opts = (data || [])
          .filter((p) => p?.estado_pgm !== false)
          .map((p) => ({
            value: p.id_pgm ?? p.id ?? p.p_id_pgm,
            label: p.name_pgm || p.sigla_pgm || "Programa",
          }));
        setPgmOpts(opts);
      } catch {
        setPgmOpts([]);
      }
    })();
  }, [programas]);

const loadClientes = useCallback(async (inputValue) => {
  try {
    const data = await clienteMfApi.list({ limit: 30, page: 1, search: inputValue || "" });
    return toClienteOptionsMF(data);
  } catch (e) {
    console.error("❌ No se pudo cargar clientes:", e);
    return [];
  }
}, []);

// Carga inicial (defaultOptions)
useEffect(() => {
  (async () => {
    try {
      const data = await clienteMfApi.list({ limit: 30, page: 1, search: "" });
      setClientesOpts(toClienteOptionsMF(data));
    } catch {
      setClientesOpts([]);
    }
  })();
}, []);


  // editar vs crear
  useEffect(() => {
    const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");
    if (initial) {
      setClienteSel(initial.id_cliente_mf ? { value: Number(initial.id_cliente_mf), label: `Cliente ${initial.id_cliente_mf}` } : null);
      setForm({
        id_pgm: initial.id_pgm ?? "",
        fecha: toLocalInput(initial.fecha),
        id_estado_param: initial.id_estado_param ?? (initial.estado?.id_param ? Number(initial.estado.id_param) : null),
        flag: !!initial.flag,
        codigo_reserva: initial.codigo_reserva ?? "",
        monto_total: (initial.monto_total ?? "") + "",
      });
    } else {
      setClienteSel(null);
      setForm({ id_pgm: "", fecha: "", id_estado_param: null, flag: true, codigo_reserva: "", monto_total: "" });
    }
  }, [initial, show]);

  const selPgm   = pgmOpts.find(o => o.value === Number(form.id_pgm)) || null;
  const selEstado= estados.find(o => Number(o.value) === Number(form.id_estado_param)) || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id_cli = clienteSel?.value != null ? Number(clienteSel.value) : null;
      const id_pgm = form.id_pgm !== "" && !isNaN(form.id_pgm) ? Number(form.id_pgm) : null;
      const payload = {
  id_cliente_mf: id_cli,
  id_pgm,
fecha: new Date(form.fecha).toLocaleString("sv-SE").replace("T", " ") + ":00.000",
  id_estado_param: form.id_estado_param ? Number(form.id_estado_param) : null,
  flag: !!form.flag,
  codigo_reserva: form.codigo_reserva?.trim() || null,
  monto_total: form.monto_total !== "" ? Number(form.monto_total) : null,
};

      if (!id_cli || !id_pgm || !payload.fecha) {
        alert("Cliente, programa y fecha son obligatorios.");
        setSaving(false);
        return;
      }

      if (initial?.id) await reservasApi.update(initial.id, payload);
      else             await reservasApi.create(payload);

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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><strong>{initial ? "Editar reserva" : "Nueva reserva"}</strong></Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <label className="form-label">Cliente*</label>
              <AsyncSelect
                cacheOptions
                defaultOptions={clientesOpts}
                loadOptions={loadClientes}
                placeholder="Buscar por nombre, DNI o correo"
                value={clienteSel}
                onChange={(opt) => setClienteSel(opt ? { value: Number(opt.value), label: String(opt.label) } : null)}
                isClearable
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Programa*</label>
              <Select
                classNamePrefix="react-select"
                placeholder="Selecciona programa"
                options={pgmOpts}
                value={selPgm}
                onChange={(opt) => setForm(f => ({ ...f, id_pgm: opt ? Number(opt.value) : "" }))}
                isClearable
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 2000 }) }}
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Fecha*</label>
              <input
                className="form-control"
                type="datetime-local"
                value={form.fecha}
                onChange={(e) => setForm(f => ({ ...f, fecha: e.target.value }))}
                required
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Estado</label>
              <Select
                classNamePrefix="react-select"
                placeholder="Selecciona estado"
                options={estados}
                value={selEstado}
                onChange={(opt) => setForm(f => ({ ...f, id_estado_param: opt ? Number(opt.value) : null }))}
                isClearable
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 2000 }) }}
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Código (opcional)</label>
              <input
                className="form-control"
                placeholder="Ej: FI70 / QTOK / C3C7"
                value={form.codigo_reserva}
                onChange={(e) => setForm(f => ({ ...f, codigo_reserva: e.target.value }))}
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Monto total (S/)</label>
              <input
                className="form-control"
                type="number"
                min="0" step="0.01"
                placeholder="19.00"
                value={form.monto_total}
                onChange={(e) => setForm(f => ({ ...f, monto_total: e.target.value }))}
              />
            </Col>
          </Row>

          <div className="mt-3 d-flex gap-2 justify-content-end">
            <Button type="submit" disabled={saving}>
              {saving ? (<><Spinner size="sm" className="me-2" />Guardando...</>) : "Guardar"}
            </Button>
            <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

// ===== Página principal =====
export default function ReservaMonkFitPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  // programas cache para mostrar label en la tabla
  const [programas, setProgramas] = useState([]);
  const pgmById = useMemo(
    () => Object.fromEntries(programas.map(o => [Number(o.value), o.label])),
    [programas]
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await PTApi.get("/programaTraining/get_tb_pgm");
        const opts = (data || [])
          .filter((p) => p?.estado_pgm !== false)
          .map((p) => ({ value: p.id_pgm ?? p.id ?? p.p_id_pgm, label: p.name_pgm || p.sigla_pgm || "Programa" }));
        setProgramas(opts);
      } catch {
        setProgramas([]);
      }
    })();
  }, []);

  const pages = useMemo(() => Math.max(1, Math.ceil(count / limit)), [count, limit]);
  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reservasApi.list({ limit, offset, search });
      setRows(Array.isArray(data?.rows) ? data.rows : []);
      setCount(Number(data?.count ?? 0));
    } catch (e) {
      console.error("❌ Error cargando reservas:", e);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit   = (r) => { setEditing(r);   setModalOpen(true); };
  const onSaved    = async (msg) => { setToast(msg); await load(); setTimeout(()=>setToast(""), 1600); };
  const onDelete   = async (id) => {
    if (!window.confirm("¿Eliminar (borrado lógico)?")) return;
    try { await reservasApi.remove(id); setToast("Reserva eliminada"); await load(); }
    catch { setToast("Error al eliminar"); }
    finally { setTimeout(()=>setToast(""), 1600); }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h4 className="m-0">Reservas MonkFit</h4>
        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            placeholder="Buscar (#id, id_cli, código)"
            style={{ minWidth: 260 }}
            value={search}
            onChange={(e) => { setOffset(0); setSearch(e.target.value); }}
          />
          <Button variant="secondary" onClick={load}>Buscar</Button>
          <Button onClick={openCreate}>Nueva reserva</Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{width:80}}>ID</th>
                  <th>Cliente</th>
                  <th>Programa</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Código</th>
                  <th className="text-end">Monto (S/)</th>
                  <th className="text-end" style={{width:160}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <Spinner animation="border" size="sm" className="me-2" /> Cargando...
                    </td>
                  </tr>
                )}

                {!loading && rows.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-muted py-4">Sin datos</td></tr>
                )}

                {!loading && rows.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.id_cli ?? "—"}</td>
                    <td>{pgmById[Number(r.id_pgm)] || r.id_pgm || "—"}</td>
                    <td>{r?.estado?.label_param || "—"}</td>
                    <td>{fmtFechaLocal(r.fecha)}</td>
                    <td>{r.codigo_reserva || "—"}</td>
                    <td className="text-end">{r.monto_total != null ? Number(r.monto_total).toFixed(2) : "—"}</td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(r)}>Editar</Button>
                      <Button size="sm" variant="outline-danger"  onClick={() => onDelete(r.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>Total: {count}</div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select"
              style={{ width: 90 }}
              value={limit}
              onChange={(e) => { setOffset(0); setLimit(Number(e.target.value)); }}
            >
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
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalReservaMonkFit
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          initial={editing}
          onSaved={onSaved}
          programas={programas}
        />
      )}

      {/* Toast simple */}
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
