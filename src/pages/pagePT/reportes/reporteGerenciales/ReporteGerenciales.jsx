import React, { useEffect, useRef, useState } from 'react'
import { ResumenReporteGeneral } from './ResumenReporteGeneral/ResumenReporteGeneral'
import { PageBreadcrumb } from '@/components'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Calendar } from 'primereact/calendar'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { ResumenUtilidadesProgramas } from './ResumenReporteGeneral copy/ResumenUtilidadesProgramas'
import { CardEstimado } from '@/components/CardTab/CardEstimado'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { BtnExportExcelFlujoCaja } from '../../GestGastos/BtnExportExcelFlujoCaja'
import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore'
import { UtilidadesMes } from './UtilidadesMes'
import { UtilidadesProgramas } from './UtilidadesProgramas'
import { ItemTotales } from './ItemTotales'
import { UtilidadesProductos } from './UtilidadesProductos'
import { UtilidadesCitas } from './UtilidadesCitas'
import SimpleBar from 'simplebar-react'
import { SelectButton } from 'primereact/selectbutton'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useDispatch } from 'react-redux';
import { useReportePuntoEquilibrioStore } from './useReportePuntoEquilibrioStore'

export const ReporteGerenciales = () => {
  // const {  } = useReportePuntoEquilibrioStore()
  return (
    <>
    <PageBreadcrumb title="Reporte gerencial" subName="reporte-gerenciales" />
    <TabView>
      <TabPanel header='CHANGE'>
        <Row>
          <Col xxl={4}>
          </Col>
          <Col xxl={4}>
          </Col>
          <Col xxl={4}>
          </Col>
        </Row>
        <Row>
          <Col xxl={12}>
            <Row>
              <Col>
                <ItemTotales itemLabel={'Ingresos'} itemTotal={<MoneyFormatter amount={600000}/>}/>
              </Col>
              <Col>
                <ItemTotales itemLabel={'Egresos'} itemTotal={<MoneyFormatter amount={200000}/>}/>
              </Col>
              <Col>
                <ItemTotales itemLabel={'Utilidad'} itemTotal={<MoneyFormatter amount={400000}/>}/>
              </Col>
              <Col>
                <ItemTotales itemLabel={'Margen'} itemTotal={`${(400000/600000).toFixed(2)}%`}/>
              </Col>
            </Row>
          </Col>
          <Col xxl={6}>
            <SimpleBar style={{height: '700px'}}>
              <Card>
                <Card.Header>
                  <Card.Title className='text-center font-20'>Total de utilidades por mes</Card.Title>
                </Card.Header>
                <Card.Body>
                  <UtilidadesMes/>
                </Card.Body>
              </Card>
            </SimpleBar>
          </Col>
          <Col xxl={6}>
          </Col>
        </Row>
      </TabPanel>
      <TabPanel header='CIRCUS'>
      </TabPanel>
      <TabPanel header='PERSONAL TRAINING'>

      </TabPanel>
    </TabView>
    </>
  )
}
