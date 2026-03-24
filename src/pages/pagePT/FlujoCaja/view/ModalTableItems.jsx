import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useMemo, useState } from 'react'
import { Col, Modal, Row, Table } from 'react-bootstrap'
import { ModalCustomGasto } from '../../GestGastos/ModalCustomGasto';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';

export const ModalTableItems = ({show, onHide, items={}, bgHeader, textEmpresa, id_empresa}) => {
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
        {id: 3, header: (<>Descripción / Eventos</>), render:(row)=>{
            return (
                <>
                {row.descripcion}
                </>
            )
        }},
        {id: 4, header: (<>FECHA <br/> COMPROBANTE</>), sortable: true, accessor: (row) => new Date(row.fecha_comprobante).getTime(), render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_comprobante, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </>
            )
        }},
        {id: 5, header: (<>FECHA <br/> PAGO</>), sortable: true, accessor: (row) => new Date(row.fecha_pago).getTime(), render:(row)=>{
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
                <TabView>
                    <TabPanel header={<div className='fs-1'>ITEMS</div>}>
                        <DataTableCR
                            columns={columns}
                            data={items}
                            responsive
                            stickyHeight={'80vh'}
                            bgHeader={bgHeader}
                            stickyHeader
                        />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1'>GASTOS POR PROVEEDOR</div>}>
                        <div className='d-flex'>
                            <ProveedorResumen data={items} header='GASTOS POR PROVEEDOR' bg={bgHeader} text={textEmpresa} id_empresa={id_empresa}/>
                        </div>
                    </TabPanel>
                </TabView>
            </Modal.Body>
        </Modal>
                    <ModalCustomGasto id={isOpenModalCustomGasto.id} id_enterprice={id_empresa} isCopy={false} onHide={onCloseModalCustomGasto} onOpenModalGasto={onOpenModalCustomGasto} show={isOpenModalCustomGasto.isOpen}/>
    </>
  )
}


const ProveedorResumen = ({ data = [], header='GASTOS', bg='bg-change', text='text-change', id_empresa }) => {
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
    ).sort((b, a)=>a.acumulado-b.acumulado);
  }, [data]);
  return (
    <div className='w-100'>
        <div className={`${bg}  text-center px-1 fs-2 mb-3`}>{header} - {dayjs(data[0]?.fecha_primaria?.split('T')[0], 'YYYY-MM-DD').format('MMMM YYYY')}</div>
        <Row>
          {proveedores.map((prov, i) => (
            <Col  key={i} lg={4}>
              <div style={{ marginBottom: 14 }} className={`d-flex justify-content-center flex-column border-black-6`}>
                  <span className={`${text} fs-2 text-center  p-0 border-bottom-black-6`}>
                      {prov.razon_social_prov}
                  </span>
                <strong className='text-center text-black'>
                  S/. <NumberFormatMoney amount={prov.acumulado}/> <span className='fs-3'>({prov.items?.length})</span>
                </strong>

              </div>
            </Col>
          ))}
        </Row>
    </div>
  );
};
export default ProveedorResumen;