import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { useResumenFechas } from '../reportes/resumenEjecutivo/hooks/useResumenFechas'
import { HeaderResultados } from './HeaderResultados'
import { IngresosAnualPorOrigen } from './IngresosAnualPorOrigen'

const ResultadosGenerales = () => {
  const {
    selectedMonth, initDay, cutDay, year,
    setSelectedMonth, setInitDay, setCutDay, setYear, handleSetUltimoDiaMes,
  } = useResumenFechas()

  return (
    <>
      <PageBreadcrumb title='RESULTADOS GENERALES' subName='Ventas' />
      <Row className='mb-3'>
        <Col lg={12}>
          <HeaderResultados
            selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
            initDay={initDay} setInitDay={setInitDay}
            cutDay={cutDay} setCutDay={setCutDay}
            year={year} setYear={setYear}
            onUseLastDay={handleSetUltimoDiaMes}
          />
        </Col>
      </Row>
      {/* inicio y corte filtran por dia de fecha_venta en todos los meses */}
      <IngresosAnualPorOrigen id_empresa={598} classNameEmpresa='bg-change text-white' initDay={initDay} cutDay={cutDay} />
    </>
  )
}

export default ResultadosGenerales
