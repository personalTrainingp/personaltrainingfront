import React, { useEffect, useState } from 'react'
import { TableEgresos } from './TableEgresos'
import { Col, Row } from 'react-bootstrap'
import { usePuntoEquilibrio } from '../hook/usePuntoEquilibrio'
import { TableResumen } from './TableResumen'
import { FechaRangeMES } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { PageBreadcrumb } from '@/components'
import { ModalConceptos } from './ModalConceptos'

export const ViewPuntoEquilibrio = ({id_empresa, bgTotal, rangeDate}) => {
    const { obtenerEgresos, dataGastosxFecha, dataIngresosxFecha, obtenerIngresos } = usePuntoEquilibrio()
    const [isOpenModalConceptos, setisOpenModalConceptos] = useState({isOpen: false, data:[], headerGrupo:''})
  const { RANGE_DATE } = useSelector(e => e.DATA)
    useEffect(() => {
        obtenerEgresos(RANGE_DATE, id_empresa)
        obtenerIngresos(RANGE_DATE, id_empresa)
    }, [RANGE_DATE])
    const withHeaderVertical=240
    const onOpenModalConceptos=(data=[], headerGrupo)=>{
        
        setisOpenModalConceptos({data, isOpen: true, headerGrupo})
    }
    const onCloseModalConceptos=()=>{
        setisOpenModalConceptos({data:[], isOpen: false, headerGrupo: ''})
    }
    const dataIngresosMembresias = dataIngresosxFecha.find(f=>f.grupo==='INGRESOS')?.conceptos?.find(g=>g.concepto==='MEMBRESIA')?.data
    const dataIngresosProductos = dataIngresosxFecha.find(f=>f.grupo==='INGRESOS')?.conceptos.filter(d=>d.concepto!=='MEMBRESIA')
    const membresiasRenovaciones = dataIngresosMembresias?.filter(f=>f.id_origen===691)
    const membresiasReinscripciones = dataIngresosMembresias?.filter(f=>f.id_origen===692)
    const membresiasNuevas = dataIngresosMembresias?.filter(f=>f.id_origen!==692 && f.id_origen!==691)
    const dataMembresias = [
        {
            grupo: 'NUEVO', data: membresiasNuevas, items: [], 
            conceptos: [
                {concepto: 'CHANGE', data: [], items: []}, 
                {concepto: 'FISIO MUSCLE', data: [], items: []}, 
                {concepto: 'FS 45', data: [], items: []}
            ]
        },
        {
            grupo: 'REINSCRIPCIONES', data: membresiasReinscripciones, items: [], 
            conceptos: [
                {concepto: 'CHANGE', data: [], items: []}, 
                {concepto: 'FISIO MUSCLE', data: [], items: []}, 
                {concepto: 'FS 45', data: [], items: []}
            ]
        },
        {
            grupo: 'RENOVACIONES', data: membresiasRenovaciones, items: [], 
            conceptos: [
                {concepto: 'CHANGE', data: [], items: []}, 
                {concepto: 'FISIO MUSCLE', data: [], items: []}, 
                {concepto: 'FS 45', data: [], items: []}
            ]
        },
    ]
    const productosMAP  = dataIngresosProductos?.map(m=>{
        return {
            grupo: m?.detalle_productos || ''
        }
    })
    console.log({dataIngresosMembresias, dataIngresosProductos, productosMAP, dataMembresias, membresiasNuevas, dif: dataIngresosxFecha.find(f=>f.grupo==='INGRESOS')});
  return (
    <div>
        <PageBreadcrumb title={'PUNTO DE EQUILIBRIO'}/>
        <FechaRangeMES rangoFechas={RANGE_DATE}/>
        <Row>
            <Col lg={7}>
                <TableEgresos 
                    onOpenModalConceptos={onOpenModalConceptos} 
                    withHeaderVertical={withHeaderVertical} 
                    data={dataGastosxFecha} 
                    bgTotal={bgTotal}
                    nombreHeader='EGRESO'
                />
            </Col>
            <Col lg={5}>
                <TableEgresos 
                    onOpenModalConceptos={onOpenModalConceptos} 
                    id_empresa={id_empresa} 
                    withHeaderVertical={withHeaderVertical} 
                    bgTotal={bgTotal} 
                    nombreHeader='INGRESOS'
                    data={dataMembresias}
                />
                <TableEgresos 
                    onOpenModalConceptos={onOpenModalConceptos} 
                    id_empresa={id_empresa} 
                    withHeaderVertical={withHeaderVertical} 
                    bgTotal={bgTotal} 
                    nombreHeader='PRODUCTOS'
                    data={dataMembresias}
                />
                <TableResumen 
                    id_empresa={id_empresa} 
                    withHeaderVertical={withHeaderVertical} 
                    bgTotal={bgTotal} 
                    dataEgresos={dataGastosxFecha} 
                    dataIngresos={dataIngresosxFecha}
                />
            </Col>
        </Row>
        <ModalConceptos 
            show={isOpenModalConceptos.isOpen} 
            headerGrupo={isOpenModalConceptos.headerGrupo} 
            onHide={onCloseModalConceptos} 
            dataConceptos={isOpenModalConceptos.data} 
        />
    </div>
  )
}
