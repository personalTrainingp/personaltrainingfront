import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useMemo, useState } from 'react'
import { Modal, Table } from 'react-bootstrap'
import { ModalCustomGasto } from '../../GestGastos/ModalCustomGasto';
import { ModalCustomAporte } from '../../GestionAportes/ModalCustomAporte';

export const ModalTableItemsIngresos = ({show, onHide, items={}, bgHeader, textEmpresa, id_empresa}) => {
    const [isOpenModalCustomGasto, setisOpenModalCustomGasto] = useState({isOpen: false, id: 0})
    const onOpenModalCustomGasto = (id=0)=>{
        setisOpenModalCustomGasto({isOpen: true, id: id})
    }
    const onCloseModalCustomGasto = ()=>{
        setisOpenModalCustomGasto({isOpen: false, id: 0})
    }
    const columns = [
        {id: 0, header: '', render: (row)=>{
            return (
                <div onClick={() => onOpenModalCustomGasto(row.id)}>
                    <i className='pi pi-pencil fw-bold text-primary cursor-pointer p-2 rounded hover-bg-light' title="Editar" />
                </div>
            )
        }},
        {id: 1, header: (<>ID</>), render:(row)=>{
            return (
                <>
                {row.id}
                </>
            )
        }},
        {id: 2, header: (<>Instituto /<br/> Colaborador</>), render:(row)=>{
            return (
                <>
                {row.tb_Proveedor?.razon_social_prov}
                </>
            )
        }},
        {id: 3, header: (<>Descripción /<br/> Eventos</>), render:(row)=>{
            return (
                <>
                {row.descripcion}
                </>
            )
        }},
        {id: 4, header: (<>FECHA <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_comprobante, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 5, header: (<>FECHA <br/> PAGO</>), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_pago, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 6, header: (<>MONTO</>), render:(row)=>{
            return (
                <>
                    {row.tc===1?'':row.tc}
                    {row.tc!==1&& (<br/>)}
                    <NumberFormatMoney amount={row.monto}/>
                </>
            )
        }},
        {id: 7, header: (<>DOCUMENTO</>), render:(row)=>{
            return (
                <>
                {row.parametro_comprobante?.label_param}
                </>
            )
        }},
        {id: 8, header: (<>FORMA <br/> PAGO</>), render:(row)=>{
            return (
                <>
                {row.parametro_forma_pago?.label_param}
                </>
            )
        }},
        {id: 9, header: (<>N° <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <>
                {row.n_comprabante}
                </>
            )
        }},
        {id: 10, header: (<>N° <br/> OPERACION</>), render:(row)=>{
            return (
                <>
                {row.n_operacion}
                </>
            )
        }},
    ]
  return (
    <>
        <Modal show={show} onHide={onHide} fullscreen>
            <Modal.Header closeButton >
                <Modal.Title>{id_empresa}</Modal.Title>
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
                  <ProveedorResumen data={items} header='GASTOS POR PROVEEDOR' bg={'bgTotal'} text={textEmpresa} id_empresa={id_empresa}/>
              </div>
            </Modal.Body>
        </Modal>
                    <ModalCustomAporte id={isOpenModalCustomGasto.id} id_enterprice={id_empresa} isCopy={false} onHide={onCloseModalCustomGasto} show={isOpenModalCustomGasto.isOpen}/>
    </>
  )
}

const ProveedorResumen = ({ data = [], header='GASTOS', bg='bg-change', text='text-change' }) => {
  const proveedores = useMemo(() => {
    return Object.values(
      data.reduce((acc, item) => {
        const nombre =
          item.tb_Proveedor?.razon_social_prov || "SIN NOMBRE";

        const montoSoles =item.monto;

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
        <span className={`${bg} text-white px-1 fs-2`}>{header}</span>
      {proveedores.map((prov, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <strong>
            <span className={`${text} mr-2 fs-4`}>
                {prov.razon_social_prov}: 
            </span>
                        S/. <NumberFormatMoney amount={prov.acumulado}/> <span className='fs-3'>({prov.items?.length})</span>
          </strong>

        </div>
      ))}
    </div>
  );
};

export default ProveedorResumen;