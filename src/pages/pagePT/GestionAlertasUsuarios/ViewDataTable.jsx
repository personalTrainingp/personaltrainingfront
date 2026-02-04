import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Badge,
  Table,
  Form,
  Row,
  Col,
  Button,
  Accordion,
} from "react-bootstrap";
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

const PAGE_SIZE = 10; // filas / grupos por página

export const ViewDataTable = () => {
  const { dataView = [] } = useSelector((s) => s.DATA);

  // hooks externos
  const {
    obtenerAlertasUsuarios,
    obtenerUsuarios,
    dataUsuarios = [],
    onDeleteAlertaUsuario,
  } = useAlertasUsuarios();

  const {
    DataGeneral: dataTipoAlerta = [],
    obtenerParametroPorEntidadyGrupo: obtenerTipoAlerta,
  } = useTerminoStore();
  const [isOpenModalEditarMensaje, setisOpenModalEditarMensaje] = useState({ isOpen: false, mensaje: '' })
  // estado UI local
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // página actual
  const [activeIndex, setActiveIndex] = useState(0); // tab activo

  // acordeones abiertos por tab
  // key del objeto = índice del tab (1=mensaje, 2=fecha, 3=usuario)
  // valor = array de eventKeys abiertos dentro de ese tab
  const [openGroupsByTab, setOpenGroupsByTab] = useState({
    1: [], // tab "Agrupado por mensaje"
    2: [], // tab "Agrupado por fecha"
    3: [], // tab "Agrupado por usuario"
  });

  // carga inicial
  useEffect(() => {
    obtenerAlertasUsuarios();
    obtenerUsuarios();
    obtenerTipoAlerta("alertas-wsp", "usuarios");
  }, []);

  // helpers de lookup
  const getLabelTipoAlerta = (value) =>
    dataTipoAlerta.find((f) => f.value === value)?.label || "-";

  const getLabelUsuario = (idUser) =>
    dataUsuarios.find((f) => f.value == idUser)?.label || "-";

  const getEstadoBadge = (estado) => (
    <Badge className="fs-6" bg={estado == 1 ? "success" : "danger"}>
      {estado == 1 ? "ACTIVO" : "INACTIVO"}
    </Badge>
  );

  // confirm dialog eliminar
  const onConfirmDialogDelete = (id) => {
    confirmDialog({
      message: "Seguro que quiero eliminar el item?",
      header: "Eliminar item",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        onDeleteAlertaUsuario(id);
      },
    });
  };
  // confirm dialog eliminar
  const onConfirmDialogEditarMensaje = (msg) => {
    setisOpenModalEditarMensaje({ isOpen: true, mensaje: msg })
  };

  // confirm dialog eliminar
  const onCancelDialogEditarMensaje = () => {
    setisOpenModalEditarMensaje({ isOpen: false, mensaje: '' })
  };
  // ---- FILTRO GLOBAL ----
  const dataFiltrada = useMemo(() => {
    if (!search.trim()) return dataView;
    const term = search.toLowerCase();
    return dataView.filter((d) => {
      const tipoTxt = getLabelTipoAlerta(d?.tipo_alerta).toLowerCase();
      const userTxt = getLabelUsuario(d?.id_user).toLowerCase();
      const fechaTxt = (d?.fecha || "").toLowerCase();
      const msgTxt = (d?.mensaje || "").toLowerCase();
      const estadoTxt = d?.id_estado == 1 ? "activo" : "inactivo";
      return (
        tipoTxt.includes(term) ||
        userTxt.includes(term) ||
        fechaTxt.includes(term) ||
        msgTxt.includes(term) ||
        estadoTxt.includes(term)
      );
    });
  }, [search, dataView, dataTipoAlerta, dataUsuarios]);

  // ---- AGRUPADORES ----
  const groupBy = (arr, keyFn) => {
    const map = {};
    arr.forEach((item) => {
      const key = keyFn(item);
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map; // {clave: [items...]}
  };

  // agrupado por mensaje
  const dataPorMensaje = useMemo(() => {
    const groups = groupBy(dataFiltrada, (d) => d.mensaje || "(sin mensaje)");
    return Object.entries(groups).map(([mensaje, items]) => ({
      groupKey: mensaje,
      rows: items,
    }));
  }, [dataFiltrada]);

  // agrupado por fecha
  const dataPorFecha = useMemo(() => {
    const groups = groupBy(dataFiltrada, (d) => d.fecha || "(sin fecha)");
    return Object.entries(groups)
      .sort(([a], [b]) => (a < b ? 1 : -1)) // desc opcional
      .map(([fecha, items]) => ({
        groupKey: dayjs
          .utc(fecha)
          .tz("America/Lima")
          .format("dddd DD [DE] MMMM [DEL] YYYY [a las] HH:mm"),
        rows: items,
      }));
  }, [dataFiltrada]);

  // agrupado por usuario
  const dataPorUsuario = useMemo(() => {
    const groups = groupBy(dataFiltrada, (d) => getLabelUsuario(d.id_user));
    return Object.entries(groups).map(([usuario, items]) => ({
      groupKey: usuario,
      rows: items,
    }));
  }, [dataFiltrada, dataUsuarios]);

  // ---- PAGINACIÓN ----
  // NORMAL => paginamos por fila
  const totalPagesNormal = Math.ceil(dataFiltrada.length / PAGE_SIZE) || 1;
  const pageFixedNormal = Math.min(page, totalPagesNormal - 1);
  const sliceNormal = dataFiltrada.slice(
    pageFixedNormal * PAGE_SIZE,
    pageFixedNormal * PAGE_SIZE + PAGE_SIZE
  );

  // AGRUPADOS => paginamos por grupo
  const usePaginationGroups = (groupsArr) => {
    const totalPages = Math.ceil(groupsArr.length / PAGE_SIZE) || 1;
    const pageFixed = Math.min(page, totalPages - 1);
    const slice = groupsArr.slice(
      pageFixed * PAGE_SIZE,
      pageFixed * PAGE_SIZE + PAGE_SIZE
    );
    return { totalPages, pageFixed, slice };
  };

  const pagMensaje = usePaginationGroups(dataPorMensaje);
  const pagFecha = usePaginationGroups(dataPorFecha);
  const pagUsuario = usePaginationGroups(dataPorUsuario);

  // cambiar tab => reset page y también reseteamos acordeones abiertos
  const handleTabChange = (e) => {
    setActiveIndex(e.index);
    setPage(0);
    // no forzamos cerrar acordeones del tab nuevo, pero si quisieras vaciar:
    // setOpenGroupsByTab((prev) => ({ ...prev, [e.index]: [] }));
  };

  // paginación UI
  const renderPagination = (totalPages, currentPage) => (
    <div className="d-flex justify-content-between align-items-center my-2">
      <div className="small">
        Página {currentPage + 1} de {totalPages}
      </div>
      <div className="d-flex gap-2">
        <Button
          size="sm"
          variant="outline-secondary"
          disabled={currentPage === 0}
          onClick={() => setPage((p) => Math.max(p, 1) - 1)}
        >
          ‹ Anterior
        </Button>
        <Button
          size="sm"
          variant="outline-secondary"
          disabled={currentPage + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente ›
        </Button>
      </div>
    </div>
  );

  // ---- TABLA REUTILIZABLE ----
  const RenderTableBody = ({ rows }) => {
    return (
      <tbody>
        {rows.map((d, i) => (
          <tr key={d.id_alerta ?? `${d.id_user}-${i}`}>
            <td>{d.rowNumber ?? i + 1}</td>
            <td>{getLabelTipoAlerta(d?.tipo_alerta)}</td>
            <td>{getLabelUsuario(d?.id_user)}</td>
            <td>
              {dayjs
                .utc(d?.fecha)
                .tz("America/Lima")
                .format("dddd DD [DE] MMMM [DEL] YYYY [a las] HH:mm")}
            </td>
            <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
              {d?.mensaje}
            </td>
            <td>{getEstadoBadge(d?.id_estado)}</td>
            <td>
              <i
                className="pi pi-trash cursor-pointer text-danger"
                onClick={() => onConfirmDialogDelete(d.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  // ---- TOGGLE DE UN PANEL DEL ACORDEÓN ----
  // tabKey = índice del tab (1,2,3)
  // itemKey = eventKey del acordeón ("0","1","2"...)
  const toggleAccordionItem = useCallback((tabKey, itemKey) => {
    setOpenGroupsByTab((prev) => {
      const currentOpen = prev[tabKey] || [];
      const isOpen = currentOpen.includes(itemKey);
      const nextOpen = isOpen
        ? currentOpen.filter((k) => k !== itemKey) // si estaba abierto -> lo cierro
        : [...currentOpen, itemKey]; // si estaba cerrado -> lo abro
      return {
        ...prev,
        [tabKey]: nextOpen,
      };
    });
  }, []);

  // ---- ACORDEÓN CONTROLADO ----
  // groups = [{groupKey, rows}]
  // tabKey = 1 | 2 | 3 (para llevar el estado separado por tab)
  const RenderAccordionGroups = ({ groups, tabKey }) => {
    const activeKeys = openGroupsByTab[tabKey] || [];

    return (
      <Accordion
        activeKey={activeKeys} // array controlado
        alwaysOpen // permite múltiples abiertos a la vez
      >
        {groups.map((grp, idx) => {
          const eventKey = String(idx);

          return (
            <Accordion.Item
              eventKey={eventKey}
              key={`${grp.groupKey}-${idx}`}
              className="mb-2 border rounded shadow-sm"
            >
              <Accordion.Header
                onClick={(e) => {
                  // Bootstrap también intenta abrir/cerrar,
                  // pero como estamos en modo controlado, nosotros mandamos.
                  // Evitamos que el click haga toggle interno duplicado:
                  e.preventDefault();
                  e.stopPropagation();
                  toggleAccordionItem(tabKey, eventKey);
                }}
              >
                <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-start align-items-md-center gap-2">
                  <div className="fw-semibold text-start">
                    {grp.groupKey || "(sin valor)"}
                  </div>
                  <div className="d-flex flex-row">
                    <Badge bg="dark">{grp.rows.length}</Badge>
                  </div>
                </div>
              </Accordion.Header>

              {/* mostramos body sólo si este panel está abierto en nuestro estado */}
              {activeKeys.includes(eventKey) && (
                <Accordion.Body className="bg-white">
                  <div>
                    <Button onClick={() => { onConfirmDialogEditarMensaje(grp.rows[0]?.mensaje) }}>EDITAR MENSAJE</Button>
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
                    <RenderTableBody
                      rows={grp.rows.map((r, i) => ({
                        ...r,
                        rowNumber: i + 1,
                      }))}
                    />
                  </Table>
                </Accordion.Body>
              )}
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };

  return (
    <div className="p-3">
      {/* BUSCADOR */}
      <Row className="mb-3">
        <Col md={4} sm={12}>
          <Form.Control
            size="sm"
            placeholder="Buscar por tipo, usuario, fecha, mensaje o estado..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset pag cuando cambias la búsqueda
            }}
          />
        </Col>

        <Col className="d-flex align-items-center text-muted small">
          <div className="ms-2">
            Total filtrado:{" "}
            {activeIndex === 0
              ? dataFiltrada.length
              : activeIndex === 1
                ? dataPorMensaje.length
                : activeIndex === 2
                  ? dataPorFecha.length
                  : dataPorUsuario.length}
          </div>
        </Col>
      </Row>

      {/* TABS */}
      <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
        {/* TAB 0: NORMAL */}
        {/* <TabPanel header="Normal">
          {renderPagination(totalPagesNormal, pageFixedNormal)}

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
            <RenderTableBody
              rows={sliceNormal.map((r, idx) => ({
                ...r,
                rowNumber: pageFixedNormal * PAGE_SIZE + idx + 1,
              }))}
            />
          </Table>

          {renderPagination(totalPagesNormal, pageFixedNormal)}
        </TabPanel> */}

        {/* TAB 1: AGRUPADO POR MENSAJE */}
        <TabPanel header="Agrupado por mensaje">
          {renderPagination(pagMensaje.totalPages, pagMensaje.pageFixed)}

          <RenderAccordionGroups
            groups={pagMensaje.slice}
            tabKey={1} // estado propio para este tab
          />

          {renderPagination(pagMensaje.totalPages, pagMensaje.pageFixed)}
        </TabPanel>

        {/* TAB 2: AGRUPADO POR FECHA */}
        <TabPanel header="Agrupado por fecha">
          {renderPagination(pagFecha.totalPages, pagFecha.pageFixed)}

          <RenderAccordionGroups
            groups={pagFecha.slice}
            tabKey={2} // estado propio para este tab
          />

          {renderPagination(pagFecha.totalPages, pagFecha.pageFixed)}
        </TabPanel>

        {/* TAB 3: AGRUPADO POR USUARIO */}
        <TabPanel header="Agrupado por usuario">
          {renderPagination(pagUsuario.totalPages, pagUsuario.pageFixed)}

          <RenderAccordionGroups
            groups={pagUsuario.slice}
            tabKey={3} // estado propio para este tab
          />

          {renderPagination(pagUsuario.totalPages, pagUsuario.pageFixed)}
        </TabPanel>
      </TabView>
      <ModalEditarMensajeAlerta data={{ mensaje: isOpenModalEditarMensaje.mensaje }} onHide={onCancelDialogEditarMensaje} show={isOpenModalEditarMensaje.isOpen} />
    </div>
  );
};
