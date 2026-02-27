import React, { useEffect } from 'react'
import { TableEgresos } from './TableEgresos'
import { Col, Row } from 'react-bootstrap'
import { TableIngresos } from './TableIngresos'
import { usePuntoEquilibrio } from '../hook/usePuntoEquilibrio'
import { TableResumen } from './TableResumen'
import { FechaRange, FechaRangeMES } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { PageBreadcrumb } from '@/components'

export const ViewPuntoEquilibrio = ({id_empresa, bgTotal, rangeDate}) => {
    const { obtenerEgresos, dataGastosxFecha, dataIngresosxFecha, obtenerIngresos } = usePuntoEquilibrio()
  const { RANGE_DATE } = useSelector(e => e.DATA)
    useEffect(() => {
        obtenerEgresos(RANGE_DATE, id_empresa)
        obtenerIngresos(RANGE_DATE, id_empresa)
    }, [RANGE_DATE])
    const withHeaderVertical=240
    
  return (
    <div>
        <PageBreadcrumb title={'PUNTO DE EQUILIBRIO'}/>
        <FechaRangeMES rangoFechas={RANGE_DATE}/>
        <Row>
            <Col lg={7}>
                <TableEgresos withHeaderVertical={withHeaderVertical} data={dataGastosxFecha} bgTotal={bgTotal}/>
            </Col>
            <Col lg={5}>
                <TableIngresos id_empresa={id_empresa} withHeaderVertical={withHeaderVertical} bgTotal={bgTotal} dataIngresos={dataIngresosxFecha}/>
                <TableResumen 
                    id_empresa={id_empresa} 
                    withHeaderVertical={withHeaderVertical} 
                    bgTotal={bgTotal} 
                    dataEgresos={dataGastosxFecha} 
                    dataIngresos={dataIngresosxFecha}/>
            </Col>
        </Row>
    </div>
  )
}
