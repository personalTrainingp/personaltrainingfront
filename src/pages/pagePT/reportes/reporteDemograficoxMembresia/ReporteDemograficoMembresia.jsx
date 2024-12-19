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
import { arrayEstadoCivil, arraySexo, clasesVentasSeparadas } from '@/types/type'
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha'
import { HistorialVentas } from './HistorialVentas'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import dayjs from 'dayjs'
import { ReportCard } from './ReportCard'


function sumarTarifaMonto(detalles) {
	return [
	  detalles.detalle_membresia&&detalles.detalle_membresia,
	  detalles.detalle_cita_nut&&detalles.detalle_cita_nut,
	  detalles.detalle_cita_tratest&&detalles.detalle_cita_tratest,
	  detalles.detalle_prodAccesorios&&detalles.detalle_prodAccesorios,
	  detalles.detalle_prodSuplementos&&detalles.detalle_prodSuplementos
	]
	  .flat() // Aplana los arrays para unirlos en uno solo
	  .reduce((total, item) => total + (item?.tarifa_monto || 0), 0); // Suma los valores de tarifa_monto
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
  
  function agrupar(data) {
    // Usamos un objeto auxiliar para agrupar por distrito y ubigeo
    const agrupado = {};
    
    data.forEach(({ label, value, tarifa_venta }) => {
      const clave = `${label}-${value}`;
    
      if (!agrupado[clave]) {
      agrupado[clave] = {
        label,
        value,
        suma_tarifa_venta: 0,
        items: []
      };
      }
    
      agrupado[clave].suma_tarifa_venta += tarifa_venta;
      agrupado[clave].items.push({ label, value, tarifa_venta });
    });
    
    // Convertimos el objeto agrupado a un array
    return Object.values(agrupado);
    }   
export const ReporteDemograficoMembresia = () => {


    const { obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor, reporteTotalVentasPorTipoCliente, obtenerVentas, reporteVentas, reporteDeDetalleVenta, 
        reporteDeVentasPorEmpleados, obtenerReporteDeTotalDeVentasActuales, reporteVentaActual, repoVentasPorSeparado, loading,
        obtenerVentasDeHoy, ventasHoy
      } = useReporteStore()
    
      const { obtenerVentas:obtenerVentasHoy, reporteVentas:reporteVentasHoy, reporteDeVentas:reporteDeVentasHOY } = useReporteStore()
    
      const [clickServProd, setclickServProd] = useState("mem")
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
      
      const TotalDeVentasxProdServ = (prodSer)=>{
        // if(prodSer)
        switch (prodSer) {
          case "mem":
            return {
              data: repoVentasPorSeparado?.dataProgramas?.data,
              sumaTotal: repoVentasPorSeparado?.dataProgramas?.SumaMonto,
              forma_pago: repoVentasPorSeparado?.dataProgramas?.forma_pago_monto,
              asesores_pago: repoVentasPorSeparado?.dataProgramas?.empl_monto
            }
        }
      }
      console.log(TotalDeVentasxProdServ(clickServProd).data);
      
      const dataDemografic_GENERO = TotalDeVentasxProdServ(clickServProd).data?.map(n=>{
        const match = arraySexo.find(i=>i.value===n.tb_cliente.sexo_cli)
        return {
          value: n.tb_cliente.sexo_cli,
          label: match.label,
          tarifa_venta: sumarTarifaMonto(n)
        }
      })
      const dataDemografic_ESTCIVIL = TotalDeVentasxProdServ(clickServProd).data?.map(n=>{
        const match = arrayEstadoCivil.find(i=>i.value===n.tb_cliente.estCivil_cli)
        return {
          value: n.tb_cliente.estCivil_cli,
          label: match.label,
          tarifa_venta: sumarTarifaMonto(n)
        }
      })
      
            const dataDemografic_TIPOCLI = TotalDeVentasxProdServ('mem').data?.map(n=>{
              const match = arrayTipoCliente.find(i=>i.value===n.tb_cliente.tipoCli_cli)
              return {
                value: n.tb_cliente.tipoCli_cli,
                label: match.label,
                tarifa_venta: sumarTarifaMonto(n)
              }
            })

      return (
        <>
        <PageBreadcrumb title="REPORTE DEMOGRAFICO POR MEMBRESIA" subName="Ventas" />
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
            <CardProdServ setclickServProd={setclickServProd} data={reporteDeDetalleVenta} dataGen={reporteVentas}/>
          </Col>
        </Row>
        <Row>
          
          <Col xxl={6} md={6}>
            <ReportCard titlo={'GENERO'} data={agrupar(dataDemografic_GENERO)}/>
          </Col>
          <Col xxl={6} md={6}>
            <ReportCard titlo={'ESTADO CIVIL'} data={agrupar(dataDemografic_ESTCIVIL)}/>
          </Col>
          
                    <Col xxl={12} md={6}>
                      <ReportCard titlo={'TIPO DE CLIENTE'} data={agrupar(dataDemografic_TIPOCLI)}/>
                    </Col>
{/*           
          <Col xxl={3} md={6}>
            <ReportCard titlo={'ESTADO CIVIL'}/>
          </Col>
          
          <Col xxl={6} md={6}>
            <ReportCard titlo={'TIPO DE SOCIO'}/>
          </Col> */}
          <Col xxl={12} md={6}>
          <Tarjetas tasks={TotalDeVentasxProdServ(clickServProd).data} title={'VENTAS POR DISTRITOS'} dataSumaTotal={0}/>
          </Col>
          <Col xxl={12} md={6}>
            <TarjetasPago tasks={TotalDeVentasxProdServ(clickServProd).asesores_pago} title={'PROXIMO CUMPLEAÑOS DE SOCIOS'} dataSumaTotal={TotalDeVentasxProdServ(clickServProd).asesores_pago.reduce((total, item) => total + item.monto, 0)}/>
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
