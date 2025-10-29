import React, { useEffect, useMemo, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Spinner } from "react-bootstrap";
import { reservasApi } from "@/api/reservasApi";
import { PTApi } from "@/common";
import { ModalReservaMonkFit } from "./ModalReservaMonkFit";
import { PageBreadcrumb } from "@/components";

const fmtFechaLocal = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d) ? "—" : d.toLocaleString("es-PE");
};

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
  const [programas, setProgramas] = useState([]);

  // Cargar programas disponibles
  useEffect(() => {
    (async () => {
      try {
        const { data } = await PTApi.get("/programaTraining/get_tb_pgm");
        const opts = (data || [])
          .filter((p) => p?.estado_pgm !== false)
          .map((p) => ({
            value: p.id_pgm ?? p.id ?? p.p_id_pgm,
            label: p.name_pgm || p.sigla_pgm || "Programa",
          }));
        setProgramas(opts);
      } catch {
        setProgramas([]);
      }
    })();
  }, []);

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

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setModalOpen(true);
  };
  const onSaved = async (msg) => {
    setToast(msg);
    await load();
    setTimeout(() => setToast(""), 1600);
  };
  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar (borrado lógico)?")) return;
    try {
      await reservasApi.remove(id);
      setToast("Reserva eliminada");
      await load();
    } catch {
      setToast("Error al eliminar");
    } finally {
      setTimeout(() => setToast(""), 1600);
    }
  };

  const pgmById = useMemo(
    () => Object.fromEntries(programas.map((o) => [Number(o.value), o.label])),
    [programas]
  );

  return (
    <div className="container py-4">
      <PageBreadcrumb title={'Reservas MonkFit'}/>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Reservas MonkFit</h4>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Buscar (#id, id_cli, código)"
            style={{ minWidth: 260 }}
            value={search}
            onChange={(e) => {
              setOffset(0);
              setSearch(e.target.value);
            }}
          />
          <Button variant="secondary" onClick={load}>
            Buscar
          </Button>
          <Button onClick={openCreate}>Nueva reserva</Button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Programa</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Código</th>
                  <th className="text-end">Monto (S/)</th>
                  <th className="text-end">Acciones</th>
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

                {!loading &&
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.id_cli ?? "—"}</td>
                      <td>{pgmById[Number(r.id_pgm)] || "—"}</td>
                      <td>{r?.estado?.label_param || "—"}</td>
                      <td>{fmtFechaLocal(r.fecha)}</td>
                      <td>{r.codigo_reserva || "—"}</td>
                      <td className="text-end">
                        {r.monto_total != null
                          ? Number(r.monto_total).toFixed(2)
                          : "—"}
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openEdit(r)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => onDelete(r.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      Sin datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ModalReservaMonkFit
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          initial={editing}
          onSaved={onSaved}
          programas={programas}
        />
      )}

      {toast && (
        <div className="toast show position-fixed bottom-0 end-0 m-3 text-bg-dark">
          <div className="d-flex">
            <div className="toast-body">{toast}</div>
            <button
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast("")}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}
