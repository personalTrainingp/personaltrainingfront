import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useMemo } from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalTableItems = ({show, onHide, id, items={}, onOpenModalCustom, bgHeader}) => {
    const columns = [
        {id: 0, header: '', render: (row)=>{
            return (
                <div onClick={() => onOpenModalCustom(row.id)}>
                    <i className='pi pi-pencil fw-bold text-primary cursor-pointer p-2 rounded hover-bg-light' title="Editar" />
                </div>
            )
        }},
        {id: 1, header: (<>Instituto /<br/> Colaborador</>), render:(row)=>{
            return (
                <>
                {row.tb_Proveedor?.razon_social_prov}
                </>
            )
        }},
        {id: 2, header: (<>Descripción /<br/> Eventos</>), render:(row)=>{
            return (
                <>
                {row.descripcion}
                </>
            )
        }},
        {id: 3, header: (<>FECHA <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_comprobante, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 3, header: (<>FECHA <br/> PAGO</>), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_pago, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 4, header: (<>MONTO</>), render:(row)=>{
            return (
                <>
                <NumberFormatMoney amount={row.monto}/>
                </>
            )
        }},
        {id: 5, header: (<>DOCUMENTO</>), render:(row)=>{
            return (
                <>
                {row.parametro_comprobante?.label_param}
                </>
            )
        }},
        {id: 6, header: (<>FORMA <br/> PAGO</>), render:(row)=>{
            return (
                <>
                {row.parametro_forma_pago?.label_param}
                </>
            )
        }},
        {id: 7, header: (<>N° <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <>
                {row.n_comprabante}
                </>
            )
        }},
        {id: 8, header: (<>N° <br/> OPERACION</>), render:(row)=>{
            return (
                <>
                {row.n_operacion}
                </>
            )
        }},
    ]
  return (
    <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton >
            <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <DataTableCR
                columns={columns}
                data={items}
                responsive
                stickyHeight={'80vh'}
                bgHeader={bgHeader}
                stickyHeader
            />
            <div className='d-flex'>
                <ProveedorResumen data={items} header='GASTOS PROVEEDORES'/>
                <div className='border-2 bg-change'>
                </div>
            </div>
        </Modal.Body>
    </Modal>
  )
}

const ProveedorResumen = ({ data = [], header='GASTOS' }) => {
  const proveedores = useMemo(() => {
    const map = {};

    data.forEach((item) => {
      const nombre = item.tb_Proveedor?.razon_social_prov || "SIN NOMBRE";

      const montoSoles = item.monto;

      if (!map[nombre]) {
        map[nombre] = {
          razon_social_prov: nombre,
          acumulado: 0,
          items: [],
        };
      }

      map[nombre].acumulado += montoSoles;
      map[nombre].items.push(item);
    });

    return Object.values(map);
  }, [data]);

  return (
    <div>
        <span className='bg-change text-white px-1 fs-2'>{header}</span>
      {proveedores.map((prov, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <strong>
            <span className='text-change mr-2'>
                {prov.razon_social_prov}: 
            </span>
            S/. {prov.acumulado.toFixed(2)} ({prov.items?.length})
          </strong>

        </div>
      ))}
    </div>
  );
};

export default ProveedorResumen;