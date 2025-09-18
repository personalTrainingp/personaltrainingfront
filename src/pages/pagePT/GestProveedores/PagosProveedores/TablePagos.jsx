import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { usePagoProveedoresStore } from './usePagoProveedoresStore';
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { useImageStore } from '@/hooks/hookApi/useImageStore';
import config from '@/config';
import { ModalCustomPagosProveedores } from './ModalCustomPagosProveedores';
import { ModalCustomDescuentos } from './ModalCustomDescuentos';
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
  const switchApiImg = (key)=>{
    switch (key) {
      case 'presupuesto':
        return `${config.API_IMG.FILES_PRESUPUESTOS_PROV}`
        break;
      case 'contrato':
        return `${config.API_IMG.FILES_CONTRATO_PROV}`
        break;
      case 'compromisoPago':
        return `${config.API_IMG.FILES_COMPROMISO_PAGO_PROV}`
        break;
      default:
        return 'any'
        break;
    }
  }
export const TablePagos = ({id_empresa}) => {
  const {
    obtenerTrabajosPendientes,
    dataPagosContratos,
    dataContratosPendientes,
    obtenerContratosPendientes,
  } = usePagoProveedoresStore();
	const {obtenerImages, images} = useImageStore()
  const { obtenerProveedores } = useProveedorStore();
  const { dataProveedores } = useSelector((s) => s.prov);
const [pending, setPending] = useState(null); // {tipo:'presupuesto'|'contrato'}
  const [isOpenModalCustomDescuentos, setisOpenModalCustomDescuentos] = useState({isOpen: false, nombreTrabajo: null, idContrato: 0})

  // acordeones
  const [openProv, setOpenProv] = useState({});       // { [id_prov]: boolean }
  const [openContrato, setOpenContrato] = useState({}); // { [id_contrato]: boolean }
useEffect(() => {
  if (!pending || !Array.isArray(images) || images.length === 0) return;
  const file = images[0];
  const base = switchApiImg(pending.tipo)
  safeDownload(`${base}${encodeURIComponent(file.name_image)}`, file.name_image);
  setPending(null);
}, [images, pending]);

  useEffect(() => {
    obtenerContratosPendientes(id_empresa);
    obtenerTrabajosPendientes();
    obtenerProveedores(true, true);
  }, []);

  // 1) Une contrato + pagos + sumaPagos
  const contratosConPagos = useMemo(() => {
    const pagos = dataPagosContratos ?? [];
    return (dataContratosPendientes ?? []).map((contrato) => {
      const dataPagos = pagos.filter((g) => g?.id_contrato_prov === contrato?.id);
      const sumaPagos = dataPagos.reduce((t, it) => t + (Number(it?.monto) || 0), 0);
      return { ...contrato, dataPagos, sumaPagos };
    });
  }, [dataContratosPendientes, dataPagosContratos]);

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

  const fmt = (n) => <NumberFormatMoney amount={n}/>;

  const toggleProv = (id_prov) =>
    setOpenProv((prev) => ({ ...prev, [id_prov]: !prev[id_prov] }));

  const toggleContrato = (id_contrato) =>
    setOpenContrato((prev) => ({ ...prev, [id_contrato]: !prev[id_contrato] }));
  
  const onClickOpenFilePresupuesto = async(uid)=>{
        if (!uid) return;
        setPending({ tipo: 'presupuesto' });
        await obtenerImages(uid);
  }
    const onClickOpenFileContrato = async(uid)=>{
      if (!uid) return;
      setPending({ tipo: 'contrato' });
      await obtenerImages(uid);
  }
  
    const onClickOpenFileCompromisoPago = async(uid)=>{
      if (!uid) return;
      setPending({ tipo: 'compromisoPago' });
      await obtenerImages(uid);
  }
  const onClickOpenModalCustomDescuentos = async(nombreTrabajo, idContrato)=>{
    setisOpenModalCustomDescuentos({isOpen: true, nombreTrabajo: nombreTrabajo, idContrato})
  }
  return (
    <div>
      <Table bordered responsive hover className="align-middle">
        <thead className="bg-primary fs-2">
          <tr>
            <th style={{ width: 44 }} />
            <th><div className="text-white" style={{width: '400px'}}>Nombres y apellidos</div></th>
            <th><div className="text-white">RUC</div></th>
              <th className="text-end"><div className="text-white">CONTRATO <br/> PENDIENTES</div></th>
            <th className="text-end"><div className="text-white">MONTO <br/> CONTRATO</div></th>
            <th className="text-end"><div className="text-white">PAGO <br/> ACUMULADO</div></th>
            <th className="text-end"><div className="text-white">SALDO</div></th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => {
            const proveedor = (dataProveedores ?? []).find((p) => p.id === grupo.id_prov);
            const razon = proveedor?.nombre_contacto?? `Prov #${grupo.id_prov}`;
            const ruc = proveedor?.razon_social_prov?? `Prov #${grupo.id_prov}`;
            const montoContratos = grupo.items.reduce((t, it) => t + (Number(it?.monto_contrato) || 0), 0);
            const sumarPagos = grupo.items.reduce((t, it) => t + (Number(it?.sumaPagos) || 0), 0);
            const saldo = montoContratos - sumarPagos;
            const isOpen = !!openProv[grupo.id_prov];

            return (
              <React.Fragment key={grupo.id_prov}>
                {/* Fila resumen proveedor */}
                <tr>
                  <td className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => toggleProv(grupo.id_prov)}
                      aria-expanded={isOpen}
                      aria-controls={`row-${grupo.id_prov}`}
                      style={{ textDecoration: 'none' }}
                    >
                      {isOpen ? 'v' : '>'}
                    </Button>
                  </td>
                  <td className='fs-3'><div className='' style={{width: '400px'}}>{razon}</div></td>
                  <td className='fs-3'>{ruc}</td>
                  <td className="text-end fs-3">{grupo.items.length}</td>
                  <td className="text-end fs-3">{fmt(sumarPagos)}</td>
                  <td className="text-end fs-3">{fmt(montoContratos)}</td>
                  <td className="text-end fs-3 fw-bold">{fmt(saldo)}</td>
                </tr>

                {/* Detalle de contratos del proveedor */}
                {isOpen && (
                  <tr id={`row-${grupo.id_prov}`}>
                    <td colSpan={6} className="bg-light">
                      <Table size="sm" bordered responsive className="mb-2">
                        <thead className='fs-3'>
                          <tr className="bg-black">
                            {/* <th style={{ width: 36 }} className="text-white" /> */}
                            <th className="text-white bg-secondary">
                              <div className='text-center' style={{width: '30px'}}>
                                ID
                              </div>
                            </th>
                            {/* <th className="text-white">PRESUPUESTO</th> */}
                            <th className="text-white">CONTRATO / <br/> penalidad</th>
                            <th className="text-white">
                              <div className='' style={{width: '100px'}}>
                                Fecha inicio
                              </div>
                            </th>
                            <th className="text-white">Fecha fin</th>
                            <th className="text-white">CONCEPTOS</th>
                            <th className="text-end text-white">Monto <br/> contrato</th>
                            <th className="text-end text-white">PENALIDAD</th>
                            <th className="text-end text-white">Pago <br/> Acumulado</th>
                            <th className="text-end text-white">
                              Saldo
                            </th>
                            <th className="text-white">COMPROMISO <br/>DE PAGO / LETRA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.items.map((c) => {
                            const saldoContrato =
                              (Number(c?.monto_contrato) || 0) - (Number(c?.sumaPagos) || 0);
                            const isOpenContrato = !!openContrato[c.id];
                            const totalPagos = c.dataPagos?.length || 0;
                            const totalPagado = Number(c?.sumaPagos) || 0;
                            return (
                              <React.Fragment key={c.id}>
                                {/* Fila resumen contrato */}
                                <tr className='fs-4'>
                                  <td 
                                        onClick={() => toggleContrato(c.id)}
                                        className='cursor-pointer'
                                  >
                                    <div className='p-0 m-0' style={{width: '40px'}}>
                                      {c.id}
                                    </div>
                                    </td>
                                  <td className='' onClick={()=>onClickOpenFileContrato(c.uid_contrato)}>
                                    <i className='pi pi-file'></i>
                                    {/* {JSON.stringify(c, null,2)} */}
                                  </td>
                                  <td>{c?.fecha_inicio ?? '-'}</td>
                                  <td>{c?.fecha_fin ?? '-'}</td>
                                  <td>
                                    <div className='' style={{width: '600px'}}>
                                      {c?.observacion ?? '-'}
                                    </div>
                                  </td>
                                  <td className="text-end">{fmt(c?.monto_contrato)}</td>
                                  <td className="text-end">{12.40}</td>
                                  <td className="text-end">{fmt(totalPagado)}</td>
                                  <td className="text-end fw-semibold">{fmt(saldoContrato)}</td>
                                  <td className='' onClick={()=>onClickOpenFileCompromisoPago(c?.uid_compromisoPago)}>
                                    <i className='pi pi-file'></i>
                                  </td>
                                </tr>

                                {/* Sub-acordeón: pagos del contrato */}
                                {isOpenContrato && totalPagos > 0 && (
                                  <tr id={`pagos-${c.id}`}>
                                    <td colSpan={8}>
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="fw-semibold">
                                          Pagos del contrato (#{c.id}) — {totalPagos} registro(s)
                                        </div>
                                        <div className="text-end">
                                          <small>Total pagado: <strong>{fmt(totalPagado)}</strong></small>
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="fw-semibold">
                                          <Button className='' onClick={()=>onClickOpenModalCustomDescuentos(c?.observacion, c.id)}>AGREGAR PENALIDAD</Button>
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
      <ModalCustomDescuentos idContrato={isOpenModalCustomDescuentos.idContrato} trabajo={isOpenModalCustomDescuentos.nombreTrabajo} show={isOpenModalCustomDescuentos.isOpen} onHide={()=>setisOpenModalCustomDescuentos({isOpen: false, nombreTrabajo: null})}/>
    </div>
  );
};
