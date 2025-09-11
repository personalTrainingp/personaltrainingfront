import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { usePagoProveedoresStore } from './usePagoProveedoresStore';
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { useImageStore } from '@/hooks/hookApi/useImageStore';
import config from '@/config';

export const TablePagos = () => {
  const {
    obtenerTrabajosPendientes,
    dataPagosContratos,
    dataContratosPendientes,
    obtenerContratosPendientes,
  } = usePagoProveedoresStore();
	const {obtenerImages, images} = useImageStore()
  const { obtenerProveedores } = useProveedorStore();
  const { dataProveedores } = useSelector((s) => s.prov);

  // acordeones
  const [openProv, setOpenProv] = useState({});       // { [id_prov]: boolean }
  const [openContrato, setOpenContrato] = useState({}); // { [id_contrato]: boolean }

  useEffect(() => {
    obtenerContratosPendientes();
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
  
  const onClickOpenFilePresupuesto = (uidPresupuesto)=>{
    obtenerImages(uidPresupuesto)
    if(images.length>0){
      const link = document.createElement("a");
      link.href = `${config.API_IMG.FILES_PRESUPUESTOS_PROV}${images[0].name_image}`;   // la URL directa o firmada de tu blob
      link.download = images[0].name_image; // nombre con el que se descargará
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
    const onClickOpenFileContrato = (uidPresupuesto)=>{
    obtenerImages(uidPresupuesto)
    if(images.length>0){
      const link = document.createElement("a");
      link.href = `${config.API_IMG.FILES_CONTRATO_PROV}${images[0].name_image}`;   // la URL directa o firmada de tu blob
      link.download = images[0].name_image; // nombre con el que se descargará
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  
  return (
    <div>
      <Table bordered responsive hover className="align-middle">
        <thead className="bg-primary">
          <tr>
            <th style={{ width: 44 }} />
            <th><div className="text-white">Proveedor</div></th>
            <th className="text-end"><div className="text-white">Contratos pendientes</div></th>
            <th className="text-end"><div className="text-white">Monto pagado</div></th>
            <th className="text-end"><div className="text-white">Monto contrato</div></th>
            <th className="text-end"><div className="text-white">Saldo a pagar</div></th>
          </tr>
        </thead>

        <tbody>
          {grupos.map((grupo) => {
            const proveedor = (dataProveedores ?? []).find((p) => p.id === grupo.id_prov);
            const razon = proveedor?.razon_social_prov ?? `Prov #${grupo.id_prov}`;

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
                  <td>{razon}</td>
                  <td className="text-end">{grupo.items.length}</td>
                  <td className="text-end">{fmt(sumarPagos)}</td>
                  <td className="text-end">{fmt(montoContratos)}</td>
                  <td className="text-end fw-bold">{fmt(saldo)}</td>
                </tr>

                {/* Detalle de contratos del proveedor */}
                {isOpen && (
                  <tr id={`row-${grupo.id_prov}`}>
                    <td colSpan={6} className="bg-light">
                      <Table size="sm" bordered responsive className="mb-2">
                        <thead>
                          <tr className="bg-black">
                            <th style={{ width: 36 }} className="text-white" />
                            <th className="text-white">ID Contrato</th>
                            <th className="text-white">PRESUPUESTO</th>
                            <th className="text-white">CONTRATO</th>
                            <th className="text-white">Descripción</th>
                            <th className="text-white">Fecha inicio</th>
                            <th className="text-white">Fecha fin</th>
                            <th className="text-end text-white">Monto contrato</th>
                            <th className="text-end text-white">Pagado</th>
                            <th className="text-end text-white">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.items.map((c) => {
                            const saldoContrato =
                              (Number(c?.monto_contrato) || 0) - (Number(c?.sumaPagos) || 0);
                            const isOpenContrato = !!openContrato[c.id];
                            const totalPagos = c.dataPagos?.length || 0;
                            const totalPagado = Number(c?.sumaPagos) || 0;
                            console.log({c});
                            
                            return (
                              <React.Fragment key={c.id}>
                                {/* Fila resumen contrato */}
                                <tr>
                                  <td className="text-center">
                                    {totalPagos > 0 ? (
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => toggleContrato(c.id)}
                                        aria-expanded={isOpenContrato}
                                        aria-controls={`pagos-${c.id}`}
                                        style={{ textDecoration: 'none' }}
                                        title="Ver pagos del contrato"
                                      >
                                        {isOpenContrato ? 'v' : '>'}
                                      </Button>
                                    ) : null}
                                  </td>
                                  <td>{c.id}</td>
                                  <td className='' onClick={()=>onClickOpenFilePresupuesto(c.uid_presupuesto)}>
                                    <i className='pi pi-file'></i>
                                    {/* {JSON.stringify(c, null,2)} */}
                                  </td>
                                  <td className='' onClick={()=>onClickOpenFileContrato(c.uid_contrato)}>
                                    <i className='pi pi-file'></i>
                                    {/* {JSON.stringify(c, null,2)} */}
                                  </td>
                                  <td>{c?.observacion ?? '-'}</td>
                                  <td>{c?.fecha_inicio ?? '-'}</td>
                                  <td>{c?.fecha_fin ?? '-'}</td>
                                  <td className="text-end">{fmt(c?.monto_contrato)}</td>
                                  <td className="text-end">{fmt(totalPagado)}</td>
                                  <td className="text-end fw-semibold">{fmt(saldoContrato)}</td>
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
    </div>
  );
};
