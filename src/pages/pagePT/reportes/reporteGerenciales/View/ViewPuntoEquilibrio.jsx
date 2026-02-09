import React, { useEffect } from 'react'
import { TableEgresos } from './TableEgresos'
import { Col, Row } from 'react-bootstrap'
import { TableIngresos } from './TableIngresos'
import { usePuntoEquilibrio } from '../hook/usePuntoEquilibrio'
import { TableResumen } from './TableResumen'

export const ViewPuntoEquilibrio = ({id_empresa, bgTotal, rangeDate}) => {
    const { obtenerEgresos, obtenerVentas, dataEgresos, dataVentas } = usePuntoEquilibrio()
    useEffect(() => {
        obtenerEgresos(rangeDate, id_empresa)
        obtenerVentas(rangeDate, id_empresa)
    }, [])
    console.log({dataVentas});
    const withHeaderVertical=240
  return (
    <div>
        <Row>
            <Col lg={7}>
                <TableEgresos withHeaderVertical={withHeaderVertical} data={dataEgresos} bgTotal={bgTotal}/>
            </Col>
            <Col lg={5}>
                <TableIngresos withHeaderVertical={withHeaderVertical} bgTotal={bgTotal} dataMF={dataVentas.dataMFMap} dataNuevos={dataVentas.dataNuevos} dataReinscripciones={dataVentas.dataReinscripcion}  dataRenovaciones={dataVentas.dataRenovaciones} dataProductos17={dataVentas.dataProductos17} dataProductos18={dataVentas.dataProductos18}/>
                <TableResumen withHeaderVertical={withHeaderVertical} bgTotal={bgTotal} dataEgresos={dataEgresos} dataIngresos={[...dataVentas.dataNuevos, ...dataVentas.dataProductos17, ...dataVentas.dataProductos18, ...dataVentas.dataReinscripcion, ...dataVentas.dataRenovaciones, ...dataVentas.dataMFMap]}/>
            </Col>
        </Row>
    </div>
  )
}
