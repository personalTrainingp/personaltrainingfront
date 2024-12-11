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
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { clasesVentasSeparadas } from '@/types/type'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { HistorialVentas } from './HistorialVentas'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import dayjs from 'dayjs'


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
  

  const { obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor, reporteTotalVentasPorTipoCliente, obtenerVentas, reporteVentas, reporteDeDetalleVenta, 
    reporteDeVentasPorEmpleados, obtenerReporteDeTotalDeVentasActuales, reporteVentaActual, repoVentasPorSeparado, loading,
    obtenerVentasDeHoy, ventasHoy
  } = useReporteStore()

  const { obtenerVentas:obtenerVentasHoy, reporteVentas:reporteVentasHoy, reporteDeVentas:reporteDeVentasHOY } = useReporteStore()

  const [clickServProd, setclickServProd] = useState("total")
  const toast = useRef(null)
  const { RANGE_DATE } = useSelector(e=>e.DATA)
  
  useEffect(() => {
    if(RANGE_DATE[0]===null) return;
    if(RANGE_DATE[1]===null) return;

    obtenerVentas(RANGE_DATE)
    obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor(RANGE_DATE)
    obtenerReporteDeTotalDeVentasActuales()
    // obtenerVentasDeHoy()
    obtenerVentasHoy([new Date(), new Date()])
    // obtenerReporteDeFormasDePagos(rangoFechas)
  }, [RANGE_DATE])
  console.log(reporteDeVentasHOY, "hoyyy");
  

  const TotalDeVentasxProdServ = (prodSer)=>{
    // if(prodSer)
    switch (prodSer) {
      case "mem":
        return {
          data: repoVentasPorSeparado.dataProgramas.data,
          sumaTotal: repoVentasPorSeparado.dataProgramas.SumaMonto,
          forma_pago: repoVentasPorSeparado.dataProgramas.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado.dataProgramas.empl_monto
        }
      case "acc":
        return {
          data: repoVentasPorSeparado.dataAccesorio.data,
          sumaTotal: repoVentasPorSeparado.dataAccesorio.SumaMonto,
          forma_pago: repoVentasPorSeparado.dataAccesorio.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado.dataAccesorio.empl_monto
        }
      case 'sup':
        return {
          data: repoVentasPorSeparado.dataSuplemento.data,
          sumaTotal: repoVentasPorSeparado.dataSuplemento.SumaMonto,
          forma_pago: repoVentasPorSeparado.dataSuplemento.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado.dataSuplemento.empl_monto
        }
      // case 'tra':
      //   return {
      //     data: repoVentasPorSeparado.dataTratamientoEstetico.data,
      //     sumaTotal: repoVentasPorSeparado.dataTratamientoEstetico.SumaMonto,
      //     forma_pago: repoVentasPorSeparado.dataTratamientoEstetico.forma_pago_monto,
      //     asesores_pago: repoVentasPorSeparado.dataTratamientoEstetico.empl_monto
      //   }
      case 'nut':
        return {
          data: repoVentasPorSeparado.dataNutricion.data,
          sumaTotal: repoVentasPorSeparado.dataNutricion.SumaMonto,
          forma_pago: repoVentasPorSeparado.dataNutricion.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado.dataNutricion.empl_monto
        }
      case 'total':
        return {
          data: repoVentasPorSeparado.total?.data,
          sumaTotal: repoVentasPorSeparado.total?.SumaMonto,
          forma_pago: repoVentasPorSeparado.total?.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado.total?.empl_monto
        }
    }
  }
  
  // console.log(clickServProd, TotalDeVentasxProdServ(`${clickServProd}`).data.length, "en linea 117");
  
  return (
    <>
    <PageBreadcrumb title="Total de ventas" subName="Ventas" />
    {
      loading? (
        <div className='text-center'>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ):(
        <>
        <div className='flex-auto mb-2'>
      {/* <label htmlFor="buttondisplay" className="font-bold block mb-2">
                      RANGO DE FECHAS
      </label> */}
          <FechaRange rangoFechas={RANGE_DATE}/>
      {/* <Calendar value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection/> */}
    </div>
    <Row>
      <Col xxl={12}>
        <Row className=' d-flex justify-content-center'>
          <Col xxl={4}>
            <CardTotal title={<>VENTA DIA {dayjs(new Date()).format('D [de] MMMM [del] YYYY')}</>} body={<SymbolSoles isbottom={true} numero={<NumberFormatMoney amount={reporteVentasHoy}/>}/>} span={`${reporteDeVentasHOY.length} ventas`}/>
          </Col>
          <Col xxl={5}>
            <CardTotal onClick={()=>setclickServProd('total')} title={`VENTA ACUMULADA por rango de fechas ${clasesVentasSeparadas(clickServProd)}`} body={<SymbolSoles isbottom={true} numero={<NumberFormatMoney amount={TotalDeVentasxProdServ(clickServProd).sumaTotal}/>}/>} span={`${TotalDeVentasxProdServ(`${clickServProd}`).data?.length} ventas `}/>
          </Col>
        </Row>
      </Col>
      <Col xxl={12}>
        <CardProdServ setclickServProd={setclickServProd} data={reporteDeDetalleVenta} dataGen={reporteVentas}/>
      </Col>
    </Row>
    <Row>
      <Col xxl={12} md={6}>
      <Tarjetas tasks={TotalDeVentasxProdServ(clickServProd).forma_pago} title={'Metodos de pago'} dataSumaTotal={TotalDeVentasxProdServ(clickServProd).forma_pago.reduce((total, item) => total + item.monto, 0)}/>
      </Col>
      <Col xxl={12} md={6}>
        <TarjetasPago tasks={TotalDeVentasxProdServ(clickServProd).asesores_pago} title={'Ranking'} dataSumaTotal={TotalDeVentasxProdServ(clickServProd).asesores_pago.reduce((total, item) => total + item.monto, 0)}/>
      </Col>
      <Col xxl={12}>
        <HistorialVentas/>
      </Col>
    </Row>
        </>
      )
    }
    <Toast ref={toast}/>
    
    </>
  )
}
