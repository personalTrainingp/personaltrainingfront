import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Badge, Table, Form, Row, Col, Button, Accordion } from "react-bootstrap";
import { TabView, TabPanel } from "primereact/tabview";
import { confirmDialog } from "primereact/confirmdialog";
import { useSelector } from "react-redux";
import { useAlertasUsuarios } from "./useAlertasUsuarios";
import { useTerminoStore } from "@/hooks/hookApi/useTerminoStore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ModalEditarMensajeAlerta } from "./ModalEditarMensajeAlerta";
dayjs.extend(utc);
dayjs.extend(timezone);

const PAGE_SIZE = 10;

export const ViewDataTable = () => {
  const { dataView = [] } = useSelector((s) => s.DATA);

  // hooks externos
  const {
    obtenerAlertasUsuarios,
    obtenerUsuarios,
    dataUsuarios = [],
    onDeleteAlertaUsuario,
    onConfirmarPago,
  } = useAlertasUsuarios();

  const {
    DataGeneral: dataTipoAlerta = [],
    obtenerParametroPorEntidadyGrupo: obtenerTipoAlerta,
  } = useTerminoStore();

  const [isOpenModalEditarMensaje, setisOpenModalEditarMensaje] = useState({ isOpen: false, mensaje: '' });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openGroupsByTab, setOpenGroupsByTab] = useState({ 1: [], 2: [], 3: [] });

  useEffect(() => {
    obtenerAlertasUsuarios();
    obtenerUsuarios();
    obtenerTipoAlerta("alertas-wsp", "usuarios");
  }, []);

  // helpers de lookup
  const getLabelTipoAlerta = useCallback((value) =>
    dataTipoAlerta.find((f) => f.value === value)?.label || "-", [dataTipoAlerta]);

  const getLabelUsuario = useCallback((idUser) =>
    dataUsuarios.find((f) => f.value == idUser)?.label || "-", [dataUsuarios]);

  // CORRECCIÓN 1 y 2: Función declarada correctamente
  const getEstadoBadge = (estado) => {
    return (
      <Badge className="fs-6" bg={estado === 1 ? "success" : "danger"}>
        {estado === 1 ? "ACTIVO" : "INACTIVO"}
      </Badge>
    );
  };

  const onConfirmDialogDelete = (id) => {
    confirmDialog({
      message: "Seguro que quiero eliminar el item?",
      header: "Eliminar item",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => onDeleteAlertaUsuario(id),
    });
  };

  const onConfirmDialogConfirmarPago = (id) => {
    confirmDialog({
      message: "¿Confirmar que el cliente ya realizó el pago? Esto cancelará las alertas mensuales pendientes de este mes.",
      header: "Confirmar Pago",
      icon: "pi pi-check-circle",
      defaultFocus: "accept",
      acceptClassName: "p-button-success",
      accept: () => onConfirmarPago(id),
    });
  };

  const onConfirmDialogEditarMensaje = (msg) => {
    setisOpenModalEditarMensaje({ isOpen: true, mensaje: msg });
  };

  // CORRECCIÓN 4: Eliminada la línea duplicada
  const onCancelDialogEditarMensaje = () => {
    setisOpenModalEditarMensaje({ isOpen: false, mensaje: '' });
  };

  // Filtros y Agrupadores
  const dataFiltrada = useMemo(() => {
    if (!search.trim()) return dataView;
    const term = search.toLowerCase();
    return dataView.filter((d) => {
      const tipoTxt = getLabelTipoAlerta(d?.tipo_alerta).toLowerCase();
      const userTxt = getLabelUsuario(d?.id_user).toLowerCase();
      const fechaTxt = (d?.fecha || "").toLowerCase();
      const msgTxt = (d?.mensaje || "").toLowerCase();
      const estadoTxt = d?.id_estado === 1 ? "activo" : "inactivo";

      return tipoTxt.includes(term) || userTxt.includes(term) ||
        fechaTxt.includes(term) || msgTxt.includes(term) || estadoTxt.includes(term);
    });
  }, [search, dataView, getLabelTipoAlerta, getLabelUsuario]);

  const groupBy = (arr, keyFn) => {
    return arr.reduce((map, item) => {
      const key = keyFn(item);
      if (!map[key]) map[key] = [];
      map[key].push(item);
      return map;
    }, {});
  };

  const dataPorMensaje = useMemo(() => {
    const groups = groupBy(dataFiltrada, (d) => d.mensaje || "(sin mensaje)");
    return Object.entries(groups).map(([mensaje, items]) => ({ groupKey: mensaje, rows: items }));
  }, [dataFiltrada]);

  const dataPorFecha = useMemo(() => {
    const groups = groupBy(dataFiltrada, (d) => d.fecha || "(sin fecha)");
    return Object.entries(groups)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([fecha, items]) => ({
        groupKey: dayjs.utc(fecha).tz("America/Lima").format("dddd DD [DE] MMMM [DEL] YYYY [a las] HH:mm"),
        rows: items,
      }));
  }, [dataFiltrada]);

  const dataPorUsuario = useMemo(() => {
    const groups = groupBy(dataFiltrada, (d) => getLabelUsuario(d.id_user));
    return Object.entries(groups).map(([usuario, items]) => ({ groupKey: usuario, rows: items }));
  }, [dataFiltrada, getLabelUsuario]);

  const usePaginationGroups = (groupsArr) => {
    const totalPages = Math.ceil(groupsArr.length / PAGE_SIZE) || 1;
    const pageFixed = Math.min(page, totalPages - 1);
    const slice = groupsArr.slice(pageFixed * PAGE_SIZE, pageFixed * PAGE_SIZE + PAGE_SIZE);
    return { totalPages, pageFixed, slice };
  };

  const pagMensaje = usePaginationGroups(dataPorMensaje);
  const pagFecha = usePaginationGroups(dataPorFecha);
  const pagUsuario = usePaginationGroups(dataPorUsuario);

  const handleTabChange = (e) => {
    setActiveIndex(e.index);
    setPage(0);
  };

  const renderPagination = (totalPages, currentPage) => (
    <div className="d-flex justify-content-between align-items-center my-2">
      <div className="small">Página {currentPage + 1} de {totalPages}</div>
      <div className="d-flex gap-2">
        <Button size="sm" variant="outline-secondary" disabled={currentPage === 0} onClick={() => setPage((p) => Math.max(p, 1) - 1)}>‹ Anterior</Button>
        <Button size="sm" variant="outline-secondary" disabled={currentPage + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente ›</Button>
      </div>
    </div>
  );

  const toggleAccordionItem = useCallback((tabKey, itemKey) => {
    setOpenGroupsByTab((prev) => {
      const currentOpen = prev[tabKey] || [];
      const isOpen = currentOpen.includes(itemKey);
      const nextOpen = isOpen ? currentOpen.filter((k) => k !== itemKey) : [...currentOpen, itemKey];
      return { ...prev, [tabKey]: nextOpen };
    });
  }, []);

  // CORRECCIÓN 3: Convertidas a funciones normales de render para evitar problemas de re-montaje
  const renderTableBody = (rows) => (
    <tbody>
      {rows.map((d, i) => (
        <tr key={d.id_alerta ?? `${d.id_user}-${i}`}>
          <td>{d.rowNumber ?? i + 1}</td>
          <td>{getLabelTipoAlerta(d?.tipo_alerta)}</td>
          <td>{getLabelUsuario(d?.id_user)}</td>
          <td>{dayjs.utc(d?.fecha).tz("America/Lima").format("dddd DD [DE] MMMM [DEL] YYYY [a las] HH:mm")}</td>
          <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>{d?.mensaje}</td>
          <td>{getEstadoBadge(d?.id_estado)}</td>
          <td>
            {d.id_estado === 1 && (
              <i className="pi pi-check-circle cursor-pointer text-success me-3" title="Confirmar Pago" onClick={() => onConfirmDialogConfirmarPago(d.id)} />
            )}
            <i className="pi pi-trash cursor-pointer text-danger" onClick={() => onConfirmDialogDelete(d.id)} />
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderAccordionGroups = (groups, tabKey) => {
    const activeKeys = openGroupsByTab[tabKey] || [];
    return (
      <Accordion activeKey={activeKeys} alwaysOpen>
        {groups.map((grp, idx) => {
          const eventKey = String(idx);
          return (
            <Accordion.Item eventKey={eventKey} key={`${grp.groupKey}-${idx}`} className="mb-2 border rounded shadow-sm">
              <Accordion.Header onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleAccordionItem(tabKey, eventKey);
              }}>
                <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-start align-items-md-center gap-2">
                  <div className="fw-semibold text-start">{grp.groupKey || "(sin valor)"}</div>
                  <div className="d-flex flex-row"><Badge bg="dark">{grp.rows.length}</Badge></div>
                </div>
              </Accordion.Header>
              {activeKeys.includes(eventKey) && (
                <Accordion.Body className="bg-white">
                  <div className="d-flex gap-2 mb-2">
                    <Button size="sm" onClick={() => onConfirmDialogEditarMensaje(grp.rows[0]?.mensaje)}>EDITAR MENSAJE</Button>
                  </div>
                  {grp.rows[0].mensaje}
                  <Table bordered size="sm" responsive>
                    <thead>
                      <tr className="table-light">
                        <th>#</th>
                        <th>Tipo de alerta</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Mensaje</th>
                        <th>Estado</th>
                        <th />
                      </tr>
                    </thead>
                    {renderTableBody(grp.rows.map((r, i) => ({ ...r, rowNumber: i + 1 })))}
                  </Table>
                </Accordion.Body>
              )}
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };

  // RETURN PRINCIPAL DEL COMPONENTE
  return (
    <div className="p-3">
      <Row className="mb-3">
        <Col md={4} sm={12}>
          <Form.Control size="sm" placeholder="Buscar por tipo, usuario, fecha, mensaje o estado..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </Col>
        <Col className="d-flex align-items-center text-muted small">
          <div className="ms-2">
            Total filtrado: {
              activeIndex === 0 ? dataFiltrada.length :
                activeIndex === 1 ? dataPorMensaje.length :
                  activeIndex === 2 ? dataPorFecha.length : dataPorUsuario.length
            }
          </div>
        </Col>
      </Row>

      <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
        <TabPanel header="Agrupado por mensaje">
          {renderPagination(pagMensaje.totalPages, pagMensaje.pageFixed)}
          {renderAccordionGroups(pagMensaje.slice, 1)}
          {renderPagination(pagMensaje.totalPages, pagMensaje.pageFixed)}
        </TabPanel>

        <TabPanel header="Agrupado por fecha">
          {renderPagination(pagFecha.totalPages, pagFecha.pageFixed)}
          {renderAccordionGroups(pagFecha.slice, 2)}
          {renderPagination(pagFecha.totalPages, pagFecha.pageFixed)}
        </TabPanel>

        <TabPanel header="Agrupado por usuario">
          {renderPagination(pagUsuario.totalPages, pagUsuario.pageFixed)}
          {renderAccordionGroups(pagUsuario.slice, 3)}
          {renderPagination(pagUsuario.totalPages, pagUsuario.pageFixed)}
        </TabPanel>
      </TabView>

      <ModalEditarMensajeAlerta data={{ mensaje: isOpenModalEditarMensaje.mensaje }} onHide={onCancelDialogEditarMensaje} show={isOpenModalEditarMensaje.isOpen} />
    </div>
  );
};