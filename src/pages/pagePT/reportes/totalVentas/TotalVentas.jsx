import { PageBreadcrumb } from '@/components'
import React, { useEffect, useRef, useState } from 'react'
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import Tarjetas from './Tarjetas'
import { tarjetasCredito, tarjetasDebito } from '../../data'
import { TarjetasPago } from './TarjetasPago'
import { CardTotal } from './CardTotal'
import { CardProdServ } from './CardProdServ'
import { Calendar } from 'primereact/calendar'
import { useForm } from '@/hooks/useForm'
import { Toast } from 'primereact/toast'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { MoneyFormatter } from '@/components/CurrencyMask'

const filtrarCalendario={
dates:[]
}
function contarVentas(data) {
  let totalVentas = 0;

  data.forEach(cliente => {
      if (cliente.tipo_cli === 0 || cliente.tipo_cli === 84) {
          totalVentas += cliente.venta.length;
      }
  });

  return totalVentas;
}
  function contarVentasEspeciales(data) {
    let totalVentas = 0;

    data.forEach(cliente => {
        if (cliente.tipo_cli !== 0 && cliente.tipo_cli !== 84) {
            totalVentas += cliente.venta.length;
        }
    });

    return totalVentas;
}

export const TotalVentas = () => {
  const {onInputChange, onResetForm, formState, onInputChangeReact, dates} = useForm(filtrarCalendario)
  const toast = useRef(null)
  const [rangoFechas, setrangoFechas] = useState([new Date(new Date().getFullYear(), 0, 1), new Date()])
  const { reporteFormasDePagos, obtenerReporteDeFormasDePagos, obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor, reporteTotalVentasPorTipoCliente, obtenerVentas, reporteVentas, reporteDeDetalleVenta, 
    reporteDeVentasPorEmpleados} = useReporteStore()
  
  useEffect(() => {
    if(rangoFechas[0]===null) return;
    if(rangoFechas[1]===null) return;
    obtenerVentas(rangoFechas)
    obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor(rangoFechas)
    obtenerReporteDeFormasDePagos(rangoFechas)
  }, [rangoFechas])
  const showToast = (severity, summary, detail, label) => {
    toast.current.show({ severity, summary, detail, label });
  };
  console.log(reporteFormasDePagos.reduce((total, item) => total + item.cantidad_ventas, 0));
  return (
    <>
    <PageBreadcrumb title="Total de ventas" subName="Ventas" />
    <Toast ref={toast}/>
    <div className='flex-auto mb-2'>
      <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      RANGO DE FECHAS
      </label>
      <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/>
    </div>
    {/* <Row className='mb-4'>
      <Col xxl={2} md={4} xs={6}>
      <Calendar value={dates} onChange={onInputChange} selectionMode="range" readOnlyInput hideOnRangeSelection placeholder='dd/mm/yyyy' />

      </Col>
    </Row> */}
    <Row>
      <Col xxl={3}>
        <CardTotal title={'Total de venta'} body={<MoneyFormatter amount={reporteVentas}/>} span={`${contarVentas(reporteTotalVentasPorTipoCliente)} ventas | ${contarVentasEspeciales(reporteTotalVentasPorTipoCliente)} Canjes`}/>
      </Col>
      <Col xxl={9}>
        <CardProdServ data={reporteDeDetalleVenta}/>
      </Col>
    </Row>
    <Row>
      <Col xxl={4} md={6}>
      <Tarjetas tasks={reporteFormasDePagos} title={'Metodos de pago'} dataSumaTotal={reporteFormasDePagos.reduce((total, item) => total + item.monto, 0)}/>
      </Col>
      <Col xxl={8} md={6}>
        <TarjetasPago tasks={reporteDeVentasPorEmpleados} title={'Ranking de vendedores'} dataSumaTotal={reporteDeVentasPorEmpleados.reduce((total, item) => total + item.cantidad_ventas, 0)}/>
      </Col>
    </Row>
    </>
  )
}
