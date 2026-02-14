import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'
import { Dialog } from 'primereact/dialog'
import React, { useState, useMemo } from 'react'
import { Table } from 'react-bootstrap'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { ModalCustomAporte } from '../GestionAportes/ModalCustomAporte'

export const ModalDetalleIngresosxItem = ({
  bgMultiValue,
  id_enterprice,
  show,
  onHide,
  data,
  bgEmpresa
}) => {
  const [isModalDetalleGasto, setIsModalDetalleGasto] = useState({ isOpen: false, id: 0 })
  // Extraemos isLoading por si quieres agregar un spinner luego
  const { obtenerGastoxID, isLoading } = useGf_GvStore()

  const onOpenModalDetalleGasto = (idGasto) => {
    setIsModalDetalleGasto({ isOpen: true, id: idGasto });
    onHide();
    obtenerGastoxID(idGasto);
  }

  const onCloseModalDetalleGasto = () => {
    setIsModalDetalleGasto({ isOpen: false, id: 0 });
  }

  // 1. OPTIMIZACIÓN: Memorizar la lista ordenada para no recalcular en cada render
  const sortedItems = useMemo(() => {
    if (!data?.items) return [];
    return [...data.items].sort((a, b) => new Date(a.fec_comprobante) - new Date(b.fec_comprobante));
  }, [data?.items]);

  // 2. OPTIMIZACIÓN: Memorizar las agrupaciones
  const proveedoresAgrupados = useMemo(() => agruparPorProveedor(data?.items), [data?.items]);
  const comprobantesAgrupados = useMemo(() => agruparPorComprobante(data?.items), [data?.items]);

  return (
    <>
      {/* MEJORA UI: Ancho responsivo en lugar de 120rem fijos */}
      <Dialog
        visible={show}
        style={{ width: '90vw', maxWidth: '1400px' }}
        onHide={onHide}
        header={`DETALLE - ${data?.grupo || ''} - ${data?.concepto || ''}`}
      >
        <Table responsive hover striped className="align-middle">
          <thead>
            <tr className={`${bgEmpresa} text-white text-center text-uppercase fs-4`}>
              <th className='p-2 text-white'>Acciones</th>
              <th className='p-2 text-white' style={{ minWidth: '200px' }}>Instituto / Colaborador</th>
              <th className='p-2 text-white' style={{ minWidth: '250px' }}>Descripción / Eventos</th>
              <th className='p-2 text-white'>Fecha<br /> Comprobante</th>
              <th className='p-2 text-white'>Fecha<br /> Pago</th>
              <th className='p-2 text-end text-white'>Monto</th>
              <th className='p-2 text-white'>Documento</th>
              <th className='p-2 text-white'>Forma Pago</th>
              <th className='p-2 text-white'>N° Comprobante</th>
              <th className='p-2 text-white'>N° Operación</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length > 0 ? (
              sortedItems.map(f => {
                const isSinDoc = f.parametro_comprobante?.label_param === 'SIN DOCUMENTO';
                const textColorClass = isSinDoc ? 'text-primary' : 'text-dark';

                return (
                  // MEJORA REACT: Prop key obligatoria para listas
                  <tr key={f.id} className="text-center fs-3">
                    <td onClick={() => onOpenModalDetalleGasto(f.id)}>
                      <i className='pi pi-pencil fw-bold text-primary cursor-pointer p-2 rounded hover-bg-light' title="Editar" />
                    </td>
                    <td className={textColorClass}>{f.tb_Proveedor?.razon_social_prov || '-'}</td>
                    <td className={textColorClass}>{f.descripcion || '-'}</td>
                    <td className={textColorClass}>{dayjs(f.fec_comprobante).format('DD/MM/YYYY')}</td>
                    <td className={textColorClass}>{dayjs(f.fec_pago).format('DD/MM/YYYY')}</td>

                    {/* MEJORA UI: Montos alineados a la derecha para fácil lectura */}
                    <td className={`text-end ${isSinDoc ? 'text-primary' : 'text-success'} fw-bold`}>
                      {f.moneda === 'USD' ? (
                        <>
                          <SymbolDolar numero={<NumberFormatMoney amount={f.monto} />} />
                          <div className="text-muted fs-4">T.C.: {f.tc}</div>
                        </>
                      ) : (
                        <SymbolSoles numero={<NumberFormatMoney amount={f.monto} />} />
                      )}
                    </td>

                    <td className="text-primary fw-bold">{f.parametro_comprobante?.label_param || '-'}</td>
                    <td className={textColorClass}>{f.parametro_forma_pago?.label_param || '-'}</td>
                    <td className={textColorClass}>{f.n_comprabante || '-'}</td>
                    <td className={textColorClass}>{f.n_operacion || 'EFECTIVO'}</td>
                  </tr>
                )
              })
            ) : (
              // MEJORA UX: Empty state
              <tr>
                <td colSpan="10" className="text-center p-4 fs-3 text-muted">
                  No se encontraron registros para este detalle.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {data?.grupo === 'PRESTAMOS' && (
          <div className='alert alert-warning fs-3 mt-3'>
            <strong>Nota:</strong> Podría haber una diferencia entre el importe de publicidad digital vs préstamos RAL, porque Facebook emite la factura antes del cargo en la tarjeta de crédito.
          </div>
        )}

        <hr className="my-4" />

        {/* MEJORA UI: Resúmenes en Grid para mejor distribución */}
        <div className='row mt-4'>
          <div className='col-md-5'>
            <h5 className={`text-white ${bgEmpresa} p-2 rounded`}>GASTOS PROVEEDORES</h5>
            <ul className="list-unstyled mt-2">
              {proveedoresAgrupados.map((m, i) => (
                <li key={i} className='fs-3 mb-1'>
                  <strong style={{ color: bgMultiValue }}>{i + 1}. {formatearNombreLargo(m.nombre_fp)}:</strong> {FUNMoneyFormatter(m.monto_total)} <span className="text-muted">({m.items.length})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='col-md-1 d-none d-md-block'>
            <div className={`h-100 mx-auto ${bgEmpresa}`} style={{ width: '2px' }}></div>
          </div>

          <div className='col-md-6'>
            <h5 className={`text-white ${bgEmpresa} p-2 rounded`}>FORMA DE PAGO</h5>
            <ul className="list-unstyled mt-2">
              {comprobantesAgrupados.map((m, i) => {
                const formasPago = agruparPorFormaPago(m?.items)
                  .map(item => `${item.nombre_fp}: ${FUNMoneyFormatter(item.monto_total)}`)
                  .join(' | ');

                return (
                  <li key={i} className='fs-3 mb-2'>
                    <strong style={{ color: bgMultiValue }}>{i + 1}. {m.nombre_com} ({m.items?.length}):</strong>
                    <span className="ms-2 fw-bold text-success"><SymbolSoles numero={<NumberFormatMoney amount={m.monto_total} />} /></span>
                    <div className="text-muted fs-4 ms-3 mt-1">↳ {formasPago}</div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Dialog>

      <ModalCustomAporte
        onHide={onCloseModalDetalleGasto}
        id={isModalDetalleGasto?.id}
        idEmpresa={id_enterprice}
        show={isModalDetalleGasto?.isOpen}
      />
    </>
  )
}

// ================= FUNCIONES AUXILIARES =================

// Helper para evitar lógica compleja en el render
function formatearNombreLargo(nombre) {
  const palabras = nombre.split(' ');
  if (palabras.length >= 3) {
    return `${palabras[0]} ${palabras[1]} ${palabras[2]}...`; // Simplificado para la UI
  }
  return nombre;
}

function agruparPorComprobante(data) {
  if (!data) return [];
  const grupos = {};
  data.forEach(item => {
    const nombre_com = item?.parametro_comprobante?.label_param || 'SIN DOCUMENTO';
    if (!grupos[nombre_com]) {
      grupos[nombre_com] = { nombre_com, monto_total: 0, items: [] };
    }
    grupos[nombre_com].monto_total += (item.monto * (item.tc || 1)) || 0;
    grupos[nombre_com].items.push(item);
  });
  return Object.values(grupos);
}

function agruparPorFormaPago(data) {
  if (!data) return [];
  const grupos = {};
  data.forEach(item => {
    const nombre_fp = item?.parametro_forma_pago?.label_param || 'SIN DOCUMENTO';
    if (!grupos[nombre_fp]) {
      grupos[nombre_fp] = { nombre_fp, monto_total: 0, items: [] };
    }
    grupos[nombre_fp].monto_total += (item.monto * (item.tc || 1)) || 0;
    grupos[nombre_fp].items.push(item);
  });
  return Object.values(grupos);
}

function agruparPorProveedor(data) {
  if (!data) return [];
  const grupos = {};
  data.forEach(item => {
    const nombre_fp = item?.tb_Proveedor?.razon_social_prov || 'SIN DOCUMENTO';
    if (!grupos[nombre_fp]) {
      grupos[nombre_fp] = { nombre_fp, monto_total: 0, items: [] };
    }
    grupos[nombre_fp].monto_total += (item.monto * (item.tc || 1)) || 0;
    grupos[nombre_fp].items.push(item);
  });
  return Object.values(grupos);
}