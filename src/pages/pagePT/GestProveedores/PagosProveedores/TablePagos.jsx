import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button as Btn } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { usePagoProveedoresStore } from './usePagoProveedoresStore';
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { useImageStore } from '@/hooks/hookApi/useImageStore';
import config from '@/config';
import { ModalCustomDescuentos } from './ModalCustomDescuentos';
import dayjs from 'dayjs';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

// Descarga segura
const safeDownload = (url, filename) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || '';
  a.rel = 'noopener';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const switchApiImg = (key) => {
  switch (key) {
    case 'presupuesto':
      return `${config.API_IMG.FILES_PRESUPUESTOS_PROV}`;
    case 'contrato':
      return `${config.API_IMG.FILES_CONTRATO_PROV}`;
    case 'compromisoPago':
      return `${config.API_IMG.FILES_COMPROMISO_PAGO_PROV}`;
    default:
      return 'any';
  }
};

export const TablePagos = ({ id_empresa, onOpenModalCustomPagosProv, bgEmpresa, classNameTablePrincipal }) => {
  const { obtenerTrabajosPendientes, obtenerContratosPendientes, deleteContratoxId } = usePagoProveedoresStore();
  const { obtenerImages, images } = useImageStore();
  const { obtenerProveedores } = useProveedorStore();
  const { dataProveedores, dataContratoProv, dataPagosProv } = useSelector((s) => s.prov);

  const [pending, setPending] = useState(null); // {tipo:'presupuesto'|'contrato'|'compromisoPago'}
  const [isOpenModalCustomDescuentos, setisOpenModalCustomDescuentos] = useState({
    isOpen: false,
    nombreTrabajo: null,
    idContrato: 0
  });

  // Dialog de contratos por proveedor
  const [dialogProv, setDialogProv] = useState({
    visible: false,
    grupo: null,           // { id_prov, items[] }
    proveedor: null,       // proveedor completo
    resumen: { contratos: 0, monto: 0, pagado: 0, saldo: 0 }
  });

  // Subacordeón: abrir pagos por contrato
  const [openContrato, setOpenContrato] = useState({}); // { [id_contrato]: boolean }

  useEffect(() => {
    if (!pending || !Array.isArray(images) || images.length === 0) return;
    const file = images[0];
    const base = switchApiImg(pending.tipo);
    safeDownload(`${base}${encodeURIComponent(file.name_image)}`, file.name_image);
    setPending(null);
  }, [images, pending]);

  useEffect(() => {
    obtenerContratosPendientes(id_empresa);
    obtenerTrabajosPendientes(id_empresa);
    obtenerProveedores(true, true, id_empresa);
  }, [id_empresa]);

  // 1) Une contrato + pagos + sumaPagos
  const contratosConPagos = useMemo(() => {
    const pagos = dataPagosProv ?? [];
    return (dataContratoProv ?? []).map((contrato) => {
      const dataPagos = pagos.filter((g) => g?.id_contrato_prov === contrato?.id);
      const sumaPagos = dataPagos.reduce((t, it) => t + (Number(it?.monto) || 0), 0);
      return { ...contrato, dataPagos, sumaPagos };
    });
  }, [dataContratoProv, dataPagosProv]);

  // 2) Agrupa por proveedor
  const grupos = useMemo(() => {
    const map = new Map();
    for (const c of contratosConPagos) {
      const idp = c?.id_prov;
      if (!map.has(idp)) map.set(idp, []);
      map.get(idp).push(c);
    }
    return Array.from(map.entries()).map(([id_prov, items]) => ({ id_prov, items }));
  }, [contratosConPagos]);

  const fmt = (n) => <NumberFormatMoney amount={n} />;

  const toggleContrato = (id_contrato) =>
    setOpenContrato((prev) => ({ ...prev, [id_contrato]: !prev[id_contrato] }));

  const onClickOpenFileContrato = async (uid) => {
    if (!uid) return;
    setPending({ tipo: 'contrato' });
    await obtenerImages(uid);
  };

  const onClickOpenFileCompromisoPago = async (uid) => {
    if (!uid) return;
    setPending({ tipo: 'compromisoPago' });
    await obtenerImages(uid);
  };

  const onClickOpenModalCustomDescuentos = async (nombreTrabajo, idContrato) => {
    setisOpenModalCustomDescuentos({ isOpen: true, nombreTrabajo: nombreTrabajo, idContrato });
  };

  const onDeleteContrato = (id) => {
    confirmDialog({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de eliminar este contrato?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        deleteContratoxId(id, id_empresa);
      },
      reject: () => {
        // nothing
      }
    });
  };

  // Abrir dialog para un proveedor (grupo)
  const handleOpenDialog = (grupo) => {
    const proveedor = (dataProveedores ?? []).find((p) => p.id === grupo.id_prov);
    const montoContratos = grupo.items.reduce((t, it) => t + (Number(it?.monto_contrato) || 0), 0);
    const sumarPagos = grupo.items.reduce((t, it) => t + (Number(it?.sumaPagos) || 0), 0);
    const saldo = montoContratos - sumarPagos;
    setDialogProv({
      visible: true,
      grupo,
      proveedor,
      resumen: {
        contratos: grupo.items.length,
        monto: montoContratos,
        pagado: sumarPagos,
        saldo
      }
    });
  };

  const handleHideDialog = () => {
    setDialogProv({ visible: false, grupo: null, proveedor: null, resumen: { contratos: 0, monto: 0, pagado: 0, saldo: 0 } });
  };

  return (
    <div>
      
      {/* <pre>
        {JSON.stringify(grupos, null, 2)}
      </pre> */}
      {/* Tabla principal por proveedor (sin acordeón) */}
      <Table bordered responsive hover className="align-middle">
        <thead className={classNameTablePrincipal}>
          <tr>
            <th className="text-white" style={{ width: 44 }}>
              HISTORIAL DE <br /> CONTRATOS
            </th>
            <th>
              <div className="text-white  text-center" style={{ width: '400px' }}>
                Nombres y apellidos / Razon social
              </div>
            </th>
            <th>
              <div className="text-white text-center">RUC</div>
            </th>
            <th className="text-center">
              <div className="text-white">CONTRATO <br /> PENDIENTES</div>
            </th>
            <th className="text-center">
              <div className="text-white">MONTO <br /> CONTRATO</div>
            </th>
            <th className="text-center">
              <div className="text-white">ABONOS</div>
            </th>
            <th className="text-center">
              <div className="text-white">SALDO</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => {
            const grupoFiltro = grupo.items.filter(e=>new Date(e.fecha_fin)>new Date())
            const proveedor = (dataProveedores ?? []).find((p) => p.id === grupo.id_prov);
            const razon = proveedor?.razon_social_prov ? `${grupo.id_prov} / ${proveedor?.razon_social_prov}` : `Prov #${grupo.id_prov}`;
            const ruc = proveedor?.ruc_prov ?? `Prov #${grupo.id_prov}`;
            const montoContratos = grupo.items.reduce((t, it) => t + (Number(it?.monto_contrato) || 0), 0);
            const sumarPagos = grupo.items.reduce((t, it) => t + (Number(it?.sumaPagos) || 0), 0);
            const saldo = montoContratos - sumarPagos;

            return (
              <tr key={grupo.id_prov}>
                <td className="text-center">
                  <Btn
                    variant="link"
                    size="sm"
                    onClick={() => handleOpenDialog(grupo)}
                    style={{ textDecoration: 'none' }}
                  >
                    VER <br /> CONTRATOS ({grupo.items.length})
                  </Btn>
                </td>
                <td className="fs-3">
                  <div style={{ width: '400px' }}>{razon}</div>
                </td>
                <td className="fs-3">{ruc}</td>
                <td className="text-end fs-3">
                  <div className='' style={{width: '50px'}}>
                    {grupoFiltro.length}
                  </div>
                </td>
                <td className="text-end fs-3">{fmt(montoContratos)}</td>
                <td className="text-end fs-3">{fmt(sumarPagos)}</td>
                <td className="text-end fs-3 fw-bold">{fmt(saldo)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Dialog: Tabla de contratos del proveedor */}
      <Dialog
        header={
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5">
              Contratos del proveedor {dialogProv?.proveedor?.razon_social_prov ? `#${dialogProv.grupo?.id_prov} / ${dialogProv.proveedor.razon_social_prov}` : `#${dialogProv.grupo?.id_prov}`}
            </span>
            <small className="text-muted">
              Contratos: {dialogProv.resumen.contratos} · Monto: <b>{fmt(dialogProv.resumen.monto)}</b> · Pagado: <b>{fmt(dialogProv.resumen.pagado)}</b> · Saldo:{' '}
              <b>{fmt(dialogProv.resumen.saldo)}</b>
            </small>
          </div>
        }
        visible={dialogProv.visible}
        onHide={handleHideDialog}
        dismissableMask
        style={{ width: '100vw', maxWidth: 1800 }}
        contentStyle={{ paddingTop: 0 }}
      >
        {dialogProv.grupo && (
          <div className="mt-2">
            <Table size="sm" bordered responsive className="mb-2">
              <thead className={`fs-3 ${classNameTablePrincipal}`}>
                <tr>
                  <th className="text-white bg-secondary">
                    <div className="text-center">
                      ID
                    </div>
                  </th>
                  <th className="text-white text-center">
                    CONTRATO <br />
                    <div className="d-flex justify-content-center" style={{ position: 'sticky', top: '60px' }}>
                      <div className="text-center border-2" style={{ width: '40px' }}></div>
                    </div>
                    <br /> PRESUPUESTO
                  </th>
                  <th className="text-white text-center">
                    <div className="text-center">Fecha inicio</div>
                  </th>
                  <th className="text-white">
                    <div className="text-center">Fecha fin</div>
                  </th>
                  <th className="text-white">
                    <div className="text-center">CONCEPTOS</div>
                  </th>
                  <th className="text-end text-white">
                    <div className="text-center">Monto <br /> contrato</div>
                  </th>
                  <th className="text-end text-white">
                    <div className="text-center">ABONOS</div>
                  </th>
                  <th className="text-center text-white">PENALIDAD</th>
                  <th className="text-center text-white">Saldo <br /> A pagar</th>
                  <th className="text-white">
                    <div className="text-center">
                      COMPROMISO <br />DE PAGO <br />
                      <div className="d-flex justify-content-center" style={{ position: 'sticky', top: '100px' }}>
                        <div className="text-center border-2" style={{ width: '40px' }}></div>
                      </div>
                      <br /> LETRA
                    </div>
                  </th>
                  <th className="text-white"></th>
                </tr>
              </thead>
              <tbody>
                {dialogProv.grupo.items
                  .slice()
                  .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))
                  .map((c) => {
                    const saldoContrato = (Number(c?.monto_contrato) || 0) - (Number(c?.sumaPagos) || 0);
                    const isOpenContrato = !!openContrato[c.id];
                    const totalPagos = c.dataPagos?.length || 0;
                    const totalPagado = Number(c?.sumaPagos) || 0;

                    return (
                      <React.Fragment key={c.id}>
                        <tr className="fs-3">
                          <td onClick={() => toggleContrato(c.id)} className="cursor-pointer text-center">
                            <div className="p-0 m-0" style={{ width: '70px' }}>{c.id}</div>
                          </td>
                          <td onClick={() => onClickOpenFileContrato(c.uid_contrato)}>
                            <div className="text-center">
                              <i className="pi pi-file-pdf bg-change p-1 rounded-3 text-white cursor-pointer" style={{ fontSize: '90px' }}></i>
                            </div>
                          </td>
                          <td>
                            <div style={{ width: '200px' }}>
                              {dayjs.utc(c.fecha_inicio, 'YYYY-MM-DD').format('dddd DD [DE] MMMM [DEL] YYYY')}
                            </div>
                          </td>
                          <td>
                            <div style={{ width: '200px' }}>
                              {dayjs.utc(c.fecha_fin, 'YYYY-MM-DD').format('dddd DD [DE] MMMM [DEL] YYYY')}
                            </div>
                          </td>
                          <td>
                            <div style={{ width: '600px' }}>{c?.observacion ?? '-'}</div>
                          </td>
                          <td className="text-end">
                            {fmt(c?.monto_contrato)}</td>
                          <td className="text-end">
                            <div className='' style={{width: '110px'}}>
                              {fmt(totalPagado)}
                            </div>
                          </td>
                          <td className="text-end">
                            <div style={{width: '110px'}}>
                              {0}
                            </div>
                            </td>
                          <td className="text-end fw-semibold">
                            <div style={{width: '110px'}}>
                              {fmt(saldoContrato)}
                            </div>
                          </td>
                          <td onClick={() => onClickOpenFileCompromisoPago(c?.uid_compromisoPago)}>
                            <div className="text-center">
                              <i className="pi pi-file-pdf bg-change p-1 rounded-3 text-white cursor-pointer" style={{ fontSize: '90px' }}></i>
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="d-flex gap-4">
                              <div>
                                <Button icon="pi pi-trash" rounded outlined onClick={() => onDeleteContrato(c.id)}/>
                                {/* <i className="pi pi-trash fs-2" onClick={() => onDeleteContrato(c.id)}></i> */}
                              </div>
                              <div>
                                <Button icon="pi pi-pencil" rounded outlined onClick={() => onOpenModalCustomPagosProv(c.id, id_empresa)}/>
                                {/* <i className="pi pi-pencil fs-2" onClick={() => onOpenModalCustomPagosProv(c.id, id_empresa)}></i> */}
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* Sub-acordeón: pagos del contrato (dentro del Dialog) */}
                        {isOpenContrato && totalPagos > 0 && (
                          <tr id={`pagos-${c.id}`}>
                            <td colSpan={8}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="fw-semibold">Pagos del contrato (#{c.id}) — {totalPagos} registro(s)</div>
                                <div className="text-end">
                                  <small>Total pagado: <strong>{fmt(totalPagado)}</strong></small>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="fw-semibold">
                                  <Btn onClick={() => onClickOpenModalCustomDescuentos(c?.observacion, c.id)}>AGREGAR PENALIDAD</Btn>
                                </div>
                              </div>
                              <Table size="sm" bordered responsive>
                                <thead>
                                  <tr>
                                    <th>ID Pago</th>
                                    <th>Fecha Pago</th>
                                    <th>Descripción</th>
                                    <th>Moneda</th>
                                    <th className="text-end">Monto</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {c.dataPagos.map((pago) => (
                                    <tr key={pago.id}>
                                      <td>{pago.id}</td>
                                      <td>{pago?.fec_pago ?? '-'}</td>
                                      <td>{pago?.descripcion ?? '-'}</td>
                                      <td>{pago?.moneda ?? '-'}</td>
                                      <td className="text-end">{fmt(pago?.monto)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        )}
      </Dialog>

      <ModalCustomDescuentos
        idContrato={isOpenModalCustomDescuentos.idContrato}
        trabajo={isOpenModalCustomDescuentos.nombreTrabajo}
        show={isOpenModalCustomDescuentos.isOpen}
        onHide={() => setisOpenModalCustomDescuentos({ isOpen: false, nombreTrabajo: null })}
      />
    </div>
  );
};
