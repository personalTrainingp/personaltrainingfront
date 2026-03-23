import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useMemo } from 'react'
import { Col, Modal, Row, Table } from 'react-bootstrap'

export const ModalTableItems = ({show, onHide, id, items={}, onOpenModalCustom, bgTotal, textEmpresa, id_empresa, mes, anio}) => {
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
          <TabView>
            <TabPanel header={<div className='fs-1'>ITEMS</div>}>
              <DataTableCR
                  columns={columns}
                  bgHeader={bgTotal}
                  data={items}
                  responsive
                  stickyHeight={'80vh'}
                  stickyHeader
              />
            </TabPanel>
            <TabPanel header={<div className='fs-1'>RESUMEN DE PROVEEDORES</div>}>
              <div className='d-flex'>
                  <ProveedorResumen data={items} header='RESUMEN DE PROVEEDORES' bg={bgTotal} text={textEmpresa} id_empresa={id_empresa}/>
                  <div className='border-2 bg-change'>
                  </div>
              </div>

            </TabPanel>
          </TabView>
        </Modal.Body>
    </Modal>
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
    <div>
        <div className={`${bg}  text-center px-1 fs-2 mb-3`}>{header} <br/> {dayjs(data[0].fecha_primaria.split('T')[0], 'YYYY-MM-DD').format('MMMM YYYY')}</div>
        <Row>
          {proveedores.map((prov, i) => (
            <Col  key={i} lg={4}>
              <div style={{ marginBottom: 14 }} className={`d-flex justify-content-center flex-column border-${id_empresa}`}>
                  <span className={`${text} fs-2 text-center  p-0 border-bottom-${id_empresa}`}>
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