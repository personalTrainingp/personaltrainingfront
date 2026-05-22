import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useMemo, useState } from 'react'
import { Col, Modal, Row, Table } from 'react-bootstrap'
import { ModalCustomGasto } from '../../GestGastos/ModalCustomGasto';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { agruparPorDia, agruparPorGrupoYConcepto } from '../helpers/agrupamientosOficiales';

export const ModalTableItems = ({show, onHide, items={}, isShowConceptos=false, link, bgHeader, textEmpresa, itemsAcumulados, mes=0, anio=0, id_empresa}) => {
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
    const clickProv = (i, prov)=>{
        setisClickProveedores({indexTab: i, prov})
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
        {id: 2, header: (<>Instituto /<br/> Colaborador</>), accessor: (row)=>row.tb_Proveedor?.razon_social_prov, render:(row)=>{
            return (
                <div>
                    {row.tb_Proveedor?.razon_social_prov}
                </div>
            )
        }},
        {id: 2, header: (<>CARGO</>), accessor: (row)=>row.tb_Proveedor?.parametro_oficio?.label_param, render:(row)=>{
            return (
                <div>
                    {row.tb_Proveedor?.parametro_oficio?.label_param}
                </div>
            )
        }},
        {id: 6, header: (<>MONTO</>), render:(row)=>{
            return (
                <div className={`${row.id_estado_gasto===1424 && 'text-change'}`}>
                    {
                        row?.impuesto_igv && (
                            <>
                            <div style={{width: '140px'}} className={ `${row.moneda === 'PEN'?'':'text-color-dolar'} text-center d-flex align-items-center justify-content-center text-change`}>
                            <span className='mx-1'>
                                IGV.
                            </span>
                                            {row?.moneda === 'PEN' ? <SymbolSoles /> : <SymbolDolar fontSizeS={'font-15'}/>}
                                            <NumberFormatMoney amount=
                            {row?.monto - row?.monto/1.18}
                                            />
                                    </div>
                            </>
                        )
                    }
                {row.tc===1?'':row.tc}
                {row.tc!==1&& (<br/>)}
                {row.tc!==1 && (
                    <span className='text-ISESAC'>
                        <NumberFormatMoney amount={row.monto/row.tc}/>
                    </span>
                )}
                {row.tc!==1&& (<br/>)}
                <NumberFormatMoney amount={row.monto}/>
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
  return (
    <>
        <Modal show={show} onHide={onCloseModalCustomGasto} fullscreen>
            <Modal.Header closeButton >
                <Modal.Title>{id_empresa}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <div className={link}>
                    <TabView onTabChange={(e) => clickProv(e.index)} activeIndex={isClickProveedores.indexTab} >
                        {
                            isShowConceptos && (
                                <TabPanel header={<div className='fs-1'>AUDITORIA GASTOS COMPARATIVOS</div>}>
                                    <div className='d-flex'>
                                        <ConceptoResumen mes={mes} itemsAcumulados={itemsAcumulados} anio={anio} onClickProv={clickProv} data={items} header='GASTOS POR PROVEEDOR' bg={bgHeader} text={textEmpresa} id_empresa={id_empresa}/>
                                    </div>
                                </TabPanel>
                            )
                        }
                        <TabPanel header={<div className='fs-1'>AUDITORIA GASTOS PROVEEDORES</div>}>
                            <div className='d-flex'>
                                <ProveedorResumen onClickProv={clickProv} data={items} header='GASTOS POR PROVEEDOR' bg={bgHeader} text={textEmpresa} id_empresa={id_empresa}/>
                            </div>
                        </TabPanel>
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
        const nombre = item.id_prov || 0;
        if (!acc[nombre]) {
          acc[nombre] = {
            id_prov: nombre,
            items: [],
          };
        }

        acc[nombre].items.push(item);

        return acc;
      }, {})
    ).map((m, i, arr)=>{
        return {
            data_no_pagado: m.items.filter(f=>f.id_estado_gasto===1424),
            data_pagado: m.items.filter(f=>f.id_estado_gasto===1423),
            montoSuma: m.items.filter(f=>f.id_estado_gasto===1423).reduce((total, item)=>item.monto+total,0),
            montoSumaTotal: m.items.reduce((total, item)=>item.monto+total,0),
            montoSuma_no_pagado:  m.items.filter(f=>f.id_estado_gasto===1424).reduce((total, item)=>item.monto+total,0),
            ...m,
        }
    }).sort((a,b)=>a.montoSumaTotal-b.montoSumaTotal);
  }, [data]);

  return (
    <div className='w-100'>
        <div className={`${bg}  text-center px-1 mb-3`} style={{fontSize: '50px'}}> {dayjs(data[0]?.fecha_primaria?.split('T')[0], 'YYYY-MM-DD').format('MMMM YYYY')}</div>
        <Row className='mt-5'>
          {proveedores.map((prov, i) => (
            <Col  key={i} lg={4}>
                <pre>
                </pre>
              <div onClick={()=>onClickProv(1, prov.razon_social_prov)} style={{ marginBottom: 14 }} className={`d-flex justify-content-center flex-column border-black-6 m-4`}>
                  <span className={`${text} fs-2 text-center  border-bottom-black-6 ${bg} text-white`} style={{height: '80px'}}>
                      {i+1}. {prov.items[0].tb_Proveedor.razon_social_prov}
                  </span>
                  <div className='d-flex flex-row text-center justify-content-center'>
                    {
                        prov.montoSuma!==0 && (
                            <div className='text-center text-black fs-2'>
                            S/. <NumberFormatMoney className='fs-1' amount={prov.montoSuma}/> <span className='fs-2 ml-4'>({prov.data_pagado?.length})</span>
                            </div>
                        )
                    }
                    {
                        prov.montoSuma_no_pagado !==0 && (
                            <div className='text-center text-change fs-2'>
                            S/. <NumberFormatMoney className='fs-1 text-change' amount={prov.montoSuma_no_pagado}/> <span className='fs-2 ml-4'>({prov.data_no_pagado?.length})</span>
                            </div>
                        )
                    }
                  </div>

              </div>
            </Col>
          ))}
        </Row>
    </div>
  );
};

const ConceptoResumen = ({ data = [], mes, anio, itemsAcumulados={}, onClickProv, header='GASTOS', bg='bg-change', text='text-change', id_empresa }) => {
  const proveedores = useMemo(() => {
    return Object.values(
      data.reduce((acc, item) => {
        const nombre = item.id_gasto || 0;
        if (!acc[nombre]) {
          acc[nombre] = {
            id_gasto: nombre,
            items: [],
          };
        }
        acc[nombre].items.push(item);
        return acc;
      }, {})
    ).map((m, i, arr)=>{
        return {
            data_no_pagado: m.items.filter(f=>f.id_estado_gasto===1424),
            data_pagado: m.items.filter(f=>f.id_estado_gasto===1423),
            montoSumaTotal: m.items.reduce((total, item)=>item.monto+total,0),
            montoSuma: m.items.filter(f=>f.id_estado_gasto===1423).reduce((total, item)=>item.monto+total,0),
            montoSuma_no_pagado:  m.items.filter(f=>f.id_estado_gasto===1424).reduce((total, item)=>item.monto+total,0),
            ...m,
        }
    }).sort((a,b)=>b.montoSumaTotal-a.montoSumaTotal);
  }, [data]);
  const itemsAcumuladosMenosMesSeleccionable = itemsAcumulados?.items
  const agrupadoXdia = agruparPorDia(itemsAcumuladosMenosMesSeleccionable)
  return (
    <div className='w-100'>
        <Row>
            <Col>
                <div className={`${bg}  text-center px-1 mb-3`} style={{fontSize: '50px'}}>
                    {dayjs(`2026-${mes}-15`, 'YYYY-M-DD').format('MMMM YYYY')}
                    <br/>
                    GASTOS
                </div>
                    {
                        agrupadoXdia.filter(f=>f.mes===mes).map(m=>{
                            const conceptos = agruparPorGrupoYConcepto(itemsAcumulados?.items, itemsAcumulados.terminologiasUsadas).flatMap(f=>f.parametro_grupo_gasto)
                                .map(p=>{
                                    const { itemsxDia, gasto, agrupadoxDia, monto_pro, ...rest } = p

                                    return {
                                        monto_pro: itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto,
                                        mes: m.mes,
                                        nombre_gasto: p.nombre_gasto,
                                        nombre_grupo: `${p.nombre_grupo}`,
                                        id_grupo: p.id_grupo,
                                        orden_grupo: p.orden_grupo
                                    }
                                }).filter(f=>f.id_grupo!==153 && f.id_grupo!==155).sort((a, b)=>a.orden_grupo-b.orden_grupo)
                            return (
                                <TableResume conceptos={conceptos.filter(f=>f.monto_pro>=0)} bg={'bg-change'} text={text}/>
                            )
                        })
                    }
                    {
                        agrupadoXdia.filter(f=>f.mes===mes).map(m=>{
                            const conceptos = agruparPorGrupoYConcepto(itemsAcumulados?.items, itemsAcumulados.terminologiasUsadas).flatMap(f=>f.parametro_grupo_gasto)
                                .map(p=>{
                                    const { itemsxDia, gasto, agrupadoxDia, monto_pro, ...rest } = p

                                    return {
                                        monto_pro: itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto_pro,
                                        mes: m.mes,
                                        nombre_gasto: p.nombre_gasto,
                                        nombre_grupo: p.nombre_grupo,
                                        orden_grupo: p.orden_grupo,
                                        id_grupo: p.id_grupo
                                    }
                                }).filter(f=>f.id_grupo===153 && f.id_grupo!==155).sort((a, b)=>a.orden_grupo-b.orden_grupo)
                            return (
                                <TableResume conceptos={conceptos} bg={'bg-change'} text={text}/>
                            )
                        })
                    }
            </Col>
            <Col>
                <div className={`bg-orange text-white text-center px-1 mb-3`} style={{fontSize: '50px'}}> 
                    {dayjs(`2026-${mes}-15`, 'YYYY-M-DD').format('MMMM YYYY')}
                    <br/>
                    GASTOS PROYECTADOS
                </div>
                    {
                        agrupadoXdia.filter(f=>f.mes===mes).map(m=>{
                            const conceptos = agruparPorGrupoYConcepto(itemsAcumulados?.items, itemsAcumulados.terminologiasUsadas).flatMap(f=>f.parametro_grupo_gasto)
                                .map(p=>{
                                    const { itemsxDia, gasto, agrupadoxDia, monto_pro, ...rest } = p

                                    return {
                                        monto_pro: itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto_pro,
                                        mes: m.mes,
                                        nombre_gasto: p.nombre_gasto,
                                        nombre_grupo: p.nombre_grupo,
                                        orden_grupo: p.orden_grupo,
                                        id_grupo: p.id_grupo
                                    }
                                }).filter(f=>f.id_grupo!==153 && f.id_grupo!==155).sort((a, b)=>a.orden_grupo-b.orden_grupo)
                            return (
                                <TableResume conceptos={conceptos.filter(f=>f.monto_pro>=0)} bg={'bg-orange'} text={text}/>
                            )
                        })
                    }
            </Col>
            {
                mes!==1 && (
                    <Col>
                        <div className={`bg-circus text-white text-center px-1 mb-3`} style={{fontSize: '50px'}}>
                            <span className='text-black'>
                                {dayjs(`2026-${mes-1}-15`, 'YYYY-M-DD').format('MMMM YYYY')}
                            <br/>
                            GASTOS COMPARATIVO
                            </span>
                        </div>
                        {
                            agrupadoXdia.filter(f=>f.mes===mes).map(m=>{
                                const conceptos = agruparPorGrupoYConcepto(itemsAcumulados?.items, itemsAcumulados.terminologiasUsadas).flatMap(f=>f.parametro_grupo_gasto)
                                    .map(p=>{
                                        const { itemsxDia, gasto, agrupadoxDia, monto_pro, ...rest } = p

                                        return {
                                            monto_pro: itemsxDia.find(i=>i.mes===Number(m.mes-1) && i.anio===m.anio).monto-itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto,
                                            monto_anterior: itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto,
                                            mes: m.mes,
                                            nombre_gasto: p.nombre_gasto,
                                            nombre_grupo: p.nombre_grupo,
                                            orden_grupo: p.orden_grupo,
                                            id_grupo: p.id_grupo
                                        }
                                    }).filter(f=>f.id_grupo!==153 && f.id_grupo!==155).sort((a, b)=>a.orden_grupo-b.orden_grupo)
                                return (
                                    <TableResume conceptos={conceptos.filter(f=>f.monto_anterior>=0)} bg={'bg-circus'} text={text}/>
                                )
                            })
                        }
                        {
                        agrupadoXdia.filter(f=>f.mes===(mes)).map((m, i, a)=>{
                            const conceptos = agruparPorGrupoYConcepto(itemsAcumulados?.items, itemsAcumulados.terminologiasUsadas).flatMap(f=>f.parametro_grupo_gasto)
                                .map(p=>{
                                    const { itemsxDia, gasto, agrupadoxDia, monto_pro, ...rest } = p

                                    return {
                                        monto_pro: itemsxDia.find(i=>i.mes===Number(m.mes-1) && i.anio===m.anio).monto-(itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto+itemsxDia.find(i=>i.mes===Number(m.mes) && i.anio===m.anio).monto_pro),
                                        mes: m.mes,
                                        nombre_gasto: p.nombre_gasto,
                                        nombre_grupo: `${p.nombre_grupo}`,
                                        orden_grupo: p.orden_grupo,
                                        id_grupo: p.id_grupo
                                    }
                                }).filter(f=>f.id_grupo==153).sort((a, b)=>a.orden_grupo-b.orden_grupo)
                            return (
                                <>
                                <TableResume conceptos={conceptos} bg={'bg-circus'} text={text}/>
                                </>
                            )
                            })
                        }
                    </Col>
                )
            }
        </Row>
    </div>
  );
};


const TableResume = ({conceptos=[], text='', bg=''})=>{
    return (
        <Table className="tabla-egresos fs-3" style={{ width: '100%', marginBottom: '200px' }} bordered>
                                    <thead className={`${bg}`}>
                                        <tr >
                                            <td className='text-white'>CONCEPTOS</td>
                                            <td className='text-white'>MONTO</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conceptos?.map((c, i)=>{
                                            return (
                                            <tr>
                                                <td className={`${text} fs-2 ${bg} text-white`}  >
                                                    <div className='text-break text-black'>
                                                        {c.nombre_grupo}
                                                    </div>
                                                    <div  className='text-break'>
                                                        {c.nombre_gasto}
                                                    </div>
                                                </td>
                                                <td className='text-center justify-content-center'>
                                                    <div className={`text-center text-black fs-2 ${c.monto_pro<0?'text-change':''}`}>
                                                        <span className={`${c.monto_pro<0?'text-change':''} ${c.monto_pro===0?'text-gray':''}`}>

                                                    S/. <NumberFormatMoney className={`fs-1 ${c.monto_pro<0?'text-change':''}`} amount={c.monto_pro}/>
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            )
                                        })}
                                        <tr>
                                            <td className={`${text} fs-2 ${bg} text-white`}>
                                                TOTAL
                                            </td>
                                            <td className={`text-center ${bg} justify-content-center`}>
                                                <div  className='text-center text-white' style={{fontSize: '25px'}}>
                                                    S/. <NumberFormatMoney
                                                        style={{fontSize: '40px'}}
                                                        className=''
                                                        amount=
                                                        {conceptos?.filter(f=>f.monto_pro>0)?.reduce((total, item)=>total+item.monto_pro, 0)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
    )
}
export default ProveedorResumen;

