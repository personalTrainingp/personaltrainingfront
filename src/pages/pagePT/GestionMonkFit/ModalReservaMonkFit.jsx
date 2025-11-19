import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { reservasApi } from "@/api/reservasApi";
import { clienteApi } from "@/api/clienteApi";
import { PTApi } from "@/common";

const toClienteOptions = (rows = []) =>
  rows.map((r) => ({
    value: Number(r.value),
    label: `${String(r.label).trim()}${r.email_cli ? " - " + String(r.email_cli).trim() : ""}${
      r.tel_cli ? " (" + String(r.tel_cli).trim() + ")" : ""
    }`,
    raw: r,
  }));

export function ModalReservaMonkFit({ show, onHide, initial, onSaved, programas }) {
  const [saving, setSaving] = useState(false);
  const [clienteSel, setClienteSel] = useState(null);
  const [estados, setEstados] = useState([]);
  const [pgmOpts, setPgmOpts] = useState(programas || []);
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
        const opts = (Array.isArray(rows) ? rows : Array.isArray(rows?.data) ? rows.data : []).map((r) =>
          r?.value !== undefined && r?.label !== undefined
            ? { value: Number(r.value), label: String(r.label) }
            : { value: Number(r.id_param), label: String(r.label_param) }
        );
        setEstados(opts);
      } catch {
        setEstados([]);
      }
    })();
  }, []);
  
  useEffect(() => {
    if (programas?.length) {
      setPgmOpts(programas);
      return;
    }
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

  useEffect(() => {
    const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");
    if (initial) {
      const idInicial = initial.id_cli ?? initial.id_cliente_mf; 
      setClienteSel(idInicial ? { value: Number(idInicial), label: `Cliente ${idInicial}` } : null);
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

  const selPgm = useMemo(() => pgmOpts.find((o) => o.value === Number(form.id_pgm)) || null, [pgmOpts, form.id_pgm]);
  const selEstado = useMemo(
    () => estados.find((o) => Number(o.value) === Number(form.id_estado_param)) || null,
    [estados, form.id_estado_param]
  );

  const loadClientes = useCallback(async (inputValue, loadedOptions, { page }) => {
    const limit = 30;
    const p = page || 1;
    const { rows, hasMore } = await clienteApi.search({ term: inputValue || "", page: p, limit });
    return {
      options: toClienteOptions(rows),
      hasMore,
      additional: { page: p + 1 },
    };
  }, []);
const toMssqlLocal = (v) => {
  if (!v) return null;
  const d = (v instanceof Date) ? v : new Date(v);       
  if (isNaN(d)) return null;
  const pad = (n) => String(n).padStart(2, "0");
  const y  = d.getFullYear();
  const mo = pad(d.getMonth() + 1);
  const da = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds()); 
  return `${y}-${mo}-${da} ${hh}:${mm}:${ss}.000`;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id_cli  = Number(clienteSel?.value);
      const id_pgm  = Number(form.id_pgm);
      const payload = {
        id_cli,
        id_pgm,
        fecha: toMssqlLocal(form.fecha),
        id_estado_param: form.id_estado_param ? Number(form.id_estado_param) : null,
        flag: !!form.flag,
        codigo_reserva: form.codigo_reserva?.trim() || null,
        monto_total: form.monto_total !== "" ? Number(form.monto_total) : 0,
      };
      console.log("[POST] /reserva_monk_fit payload ->", payload);

      if (!id_cli || !id_pgm || !payload.fecha || !payload.monto_total ) {
        alert("Cliente, programa y fecha son obligatorios.");
        setSaving(false);
        return;
      }
      if (initial?.id) await reservasApi.update(initial.id, payload);
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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <strong>{initial ? "Editar reserva" : "Nueva reserva"}</strong>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <label className="form-label">Cliente*</label>
              <AsyncPaginate
                value={clienteSel}
                onChange={(opt) => setClienteSel(opt ? { value: Number(opt.value), label: String(opt.label) } : null)}
                loadOptions={loadClientes}
                defaultOptions // carga inicial (llama loadOptions con "")
                additional={{ page: 1 }}
                debounceTimeout={300}
                isClearable
                placeholder="Buscar por DNI, nombre, correo o teléfono"
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
                onChange={(opt) => setForm((f) => ({ ...f, id_pgm: opt ? Number(opt.value) : "" }))}
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
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
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
                onChange={(opt) => setForm((f) => ({ ...f, id_estado_param: opt ? Number(opt.value) : null }))}
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
                onChange={(e) => setForm((f) => ({ ...f, codigo_reserva: e.target.value }))}
              />
            </Col>

            <Col md={6}>
              <label className="form-label">Monto total (S/)</label>
              <input
                className="form-control"
                type="number"
                min="0"
                step="0.01"
                placeholder=""
                value={form.monto_total}
                onChange={(e) => setForm((f) => ({ ...f, monto_total: e.target.value }))}
              />
            </Col>
          </Row>
          <div className="mt-3 d-flex gap-2 justify-content-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
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
