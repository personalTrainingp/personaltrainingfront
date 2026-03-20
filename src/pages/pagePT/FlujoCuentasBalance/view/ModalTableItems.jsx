import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useMemo } from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalTableItems = ({show, onHide, id, items={}, onOpenModalCustom, bgTotal}) => {
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
        {id: 4, header: (<>MONTO <br/> S/.</>), render:(row)=>{
            return (
                <>
                <NumberFormatMoney amount={row.monto}/>
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
                bgHeader={bgTotal}
                data={items}
                responsive
                stickyHeight={'80vh'}
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
    return Object.values(
      data.reduce((acc, item) => {
        const nombre =
          item.tb_Proveedor?.razon_social_prov || "SIN NOMBRE";

        const montoSoles =
          item.moneda === "USD"
            ? item.monto * item.tc
            : item.monto;

        if (!acc[nombre]) {
          acc[nombre] = {
            razon_social_prov: nombre,
            acumulado: 0,
            items: [],
          };
        }

        acc[nombre].acumulado += montoSoles;
        acc[nombre].items.push(item);

        return acc;
      }, {})
    );
  }, [data]);

  return (
    <div>
      {proveedores.map((prov) => (
        <div key={prov.razon_social_prov} style={{ marginBottom: 20 }}>
          <strong>
            {prov.razon_social_prov}: S/. {prov.acumulado.toFixed(2)}
          </strong>

          {/* prueba visual clara */}
          <div>
            Cantidad registros: {prov.items.length}
          </div>
        </div>
      ))}
    </div>
  );
};