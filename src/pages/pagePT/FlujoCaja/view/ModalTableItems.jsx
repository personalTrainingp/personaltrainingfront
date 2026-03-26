import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useMemo, useState } from 'react'
import { Col, Modal, Row, Table } from 'react-bootstrap'
import { ModalCustomGasto } from '../../GestGastos/ModalCustomGasto';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';
import { Button } from 'primereact/button';

export const ModalTableItems = ({show, onHide, items={}, link, bgHeader, textEmpresa, id_empresa}) => {
    const [isOpenModalCustomGasto, setisOpenModalCustomGasto] = useState({isOpen: false, id: 0})
    const [isClickProveedores, setisClickProveedores] = useState({indexTab: 0, prov: ''})
    const onOpenModalCustomGasto = (id=0)=>{
        setisOpenModalCustomGasto({isOpen: true, id: id})
    }
    const onCloseModalCustomGasto = ()=>{
        setisOpenModalCustomGasto({isOpen: false, id: 0})
        setisClickProveedores({indexTab: 0, prov: ''})
        onHide()
    }
    const columns = [
        {id: 0, header: '', render: (row)=>{
            return (
                <div onClick={() => onOpenModalCustomGasto(row.id)}>
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
                </div>
            )
        }},
        {id: 1, header: (<>ID</>), render:(row)=>{
            return (
                <div>
                {row.id}
                </div>
            )
        }},
        {id: 2, header: (<>Instituto /<br/> Colaborador</>), render:(row)=>{
            return (
                <div>
                    {row.tb_Proveedor?.razon_social_prov}
                </div>
            )
        }},
        {id: 3, header: (<>Descripción / Eventos</>), render:(row)=>{
            return (
                <div>
                {row.descripcion}
                </div>
            )
        }},
        {id: 4, header: (<>FECHA <br/> COMPROBANTE</>), sortable: true, accessor: (row) => new Date(row.fecha_comprobante).getTime(), render:(row)=>{
            return (
                <div>
                {DateMaskStr(row.fecha_comprobante, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </div>
            )
        }},
        {id: 5, header: (<>FECHA <br/> PAGO</>), sortable: true, accessor: (row) => new Date(row.fecha_pago).getTime(), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                {DateMaskStr(row.fecha_pago, 'dddd DD [DE] MMMM [DEL] YYYY')}
                </div>
            )
        }},
        {id: 6, header: (<>MONTO</>), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                {row.tc===1?'':row.tc}
                {row.tc!==1&& (<br/>)}
                <NumberFormatMoney amount={row.monto}/>
                </div>
            )
        }},
        {id: 7, header: (<>DOCUMENTO</>), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                {row.parametro_comprobante?.label_param}
                </div>
            )
        }},
        {id: 8, header: (<>FORMA <br/> PAGO</>), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                {row.parametro_forma_pago?.label_param}
                </div>
            )
        }},
        {id: 9, header: (<>N° <br/> COMPROBANTE</>), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                {row.n_comprabante}
                </div>
            )
        }},
        {id: 10, header: (<>N° <br/> OPERACION</>), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                {row.n_operacion}
                </div>
            )
        }},
    ]
    const clickProv = (i, prov)=>{
        setisClickProveedores({indexTab: i, prov})
    }
  return (
    <>
        <Modal show={show} onHide={onCloseModalCustomGasto} fullscreen>
            <Modal.Header closeButton >
                <Modal.Title>{id_empresa}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <div className={link}>
                    <TabView onTabChange={(e) => clickProv(e.index)} activeIndex={isClickProveedores.indexTab} >
                        <TabPanel header={<div className='fs-1'>ITEMS</div>}>
                            <DataTableCR
                                columns={columns}
                                data={items}
                                responsive
                                stickyHeight={'80vh'}
                                bgHeader={bgHeader}
                                stickyHeader
                                defaultSearch={isClickProveedores.prov}
                            />
                        </TabPanel>
                        <TabPanel header={<div className='fs-1'>GASTOS POR PROVEEDOR</div>}>
                            <div className='d-flex'>
                                <ProveedorResumen onClickProv={clickProv} data={items} header='GASTOS POR PROVEEDOR' bg={bgHeader} text={textEmpresa} id_empresa={id_empresa}/>
                            </div>
                        </TabPanel>
                    </TabView>

                </div>
            </Modal.Body>
        </Modal>
                    <ModalCustomGasto id={isOpenModalCustomGasto.id} id_enterprice={id_empresa} isCopy={false} onHide={onCloseModalCustomGasto} onOpenModalGasto={onOpenModalCustomGasto} show={isOpenModalCustomGasto.isOpen}/>
    </>
  )
}


const ProveedorResumen = ({ data = [], onClickProv, header='GASTOS', bg='bg-change', text='text-change', id_empresa }) => {
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
              <div onClick={()=>onClickProv(0, prov.razon_social_prov)} style={{ marginBottom: 14 }} className={`d-flex justify-content-center flex-column border-black-6`}>
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