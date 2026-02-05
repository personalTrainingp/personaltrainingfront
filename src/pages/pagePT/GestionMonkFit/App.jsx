import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import { reservasApi } from "@/api/reservasApi";
import { PTApi } from "@/common";
import { ModalReservaMonkFit } from "./ModalReservaMonkFit";
import { PageBreadcrumb } from "@/components";

import dayjs from "dayjs";

const fmtFechaLocal = (s) => {
  if (!s) return "—";
  let d = new Date(String(s).replace("T", " ").replace(/\.\d+Z?$/, ""));
  return isNaN(d) ? "—" : d.toLocaleString("es-PE", { hour12: true });
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
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [totalMonto, setTotalMonto] = useState(0);

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
      let from = null;
      let to = null;
      // Solo aplicamos filtro de fecha SI NO hay búsqueda
      if (!search && selectedMonth) {
        const d = dayjs(selectedMonth);
        from = d.startOf('month').format('YYYY-MM-DD');
        to = d.endOf('month').format('YYYY-MM-DD');
      }

      // Si hay search, from y to van nulos => Trae todo el historial
      const data = await reservasApi.list({ limit, offset, search, from, to });
      setRows(Array.isArray(data?.rows) ? data.rows : []);
      setCount(Number(data?.count ?? 0));
      setTotalMonto(Number(data?.totalMonto ?? 0));
    } catch (e) {
      console.error("❌ Error cargando reservas:", e);
      setRows([]);
      setCount(0);
      setTotalMonto(0);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search, selectedMonth]);

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
      <PageBreadcrumb title={'Reservas MonkFit'} />
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h4 className="m-0">Reservas MonkFit</h4>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={(() => {
              // Helper para el valor del select
              if (!selectedMonth) return "";
              return dayjs(selectedMonth).format("YYYY-MM");
            })()}
            onChange={(e) => {
              const val = e.target.value; // "2025-02"
              if (!val) {
                setSelectedMonth(null);
                return;
              }
              // Fijamos el día 1 para evitar problemas
              const d = dayjs(`${val}-01`).toDate();
              setSelectedMonth(d);
              setOffset(0); // Reset paginación al cambiar filtro
            }}
          >
            {/* Generamos opciones dinámicas anteriores y futuras */}
            {(() => {
              const opts = [];
              // 24 meses atrás + actual + 12 meses adelante
              const start = dayjs().subtract(13, 'month');
              for (let i = 0; i <= 36; i++) {
                const m = start.add(i, 'month');
                opts.push(
                  <option key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>
                    {m.format('MMMM YYYY').toUpperCase()}
                  </option>
                );
              }
              return opts;
            })()}
          </select>

          <input
            className="form-control"
            placeholder="Buscar (Nombre, #id, id_cli, código)"
            style={{ width: 220 }}
            value={search}
            onChange={(e) => {
              setOffset(0);
              setSearch(e.target.value);
            }}
          />

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
                      <td>
                        {r.cliente
                          ? `${r.cliente.nombre_cli} ${r.cliente.apPaterno_cli}`
                          : (r.id_cli ?? "—")}
                      </td>
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
              <tfoot className="table-light">
                <tr>
                  <td colSpan={6} className="text-end fw-bold">TOTAL:</td>
                  <td className="text-end fw-bold">
                    {totalMonto ? totalMonto.toFixed(2) : "0.00"}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            {/* ======= PAGINACIÓN ======= */}
            {!loading && count > limit && (
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <div>
                  Mostrando {offset + 1}–{Math.min(offset + limit, count)} de {count} registros
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                  >
                    ← Anterior
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={offset + limit >= count}
                    onClick={() => setOffset(offset + limit)}
                  >
                    Siguiente →
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {
        modalOpen && (
          <ModalReservaMonkFit
            show={modalOpen}
            onHide={() => setModalOpen(false)}
            initial={editing}
            onSaved={onSaved}
            programas={programas}
          />
        )
      }

      {
        toast && (
          <div className="toast show position-fixed bottom-0 end-0 m-3 text-bg-dark">
            <div className="d-flex">
              <div className="toast-body">{toast}</div>
              <button
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast("")}
              ></button>
            </div>
          </div>
        )
      }
    </div >
  );
}
