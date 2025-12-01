import { PageBreadcrumb } from '@/components';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';

import Tarjetas from './Tarjetas';
import { TarjetasPago } from './TarjetasPago';
import { CardTotal } from './CardTotal';
import { CardProdServ } from './CardProdServ';
import { FechaRange } from '@/components/RangeCalendars/FechaRange';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useSelector } from 'react-redux';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { clasesVentasSeparadas } from '@/types/type';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { HistorialVentas } from './HistorialVentas';

import { Toast } from 'primereact/toast'; // 👈 IMPORT NECESARIO

import dayjs, { utc } from 'dayjs';
import "dayjs/locale/es";
dayjs.extend(utc);

// helpers que ya tenías
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
  // OJO: usamos el hook SOLO UNA VEZ
  const {
    obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor,
    reporteTotalVentasPorTipoCliente,
    obtenerVentas,
    reporteVentas,
    reporteDeDetalleVenta,
    reporteDeVentasPorEmpleados,
    obtenerReporteDeTotalDeVentasActuales,
    reporteVentaActual,
    repoVentasPorSeparado,
    loading,
    obtenerVentasDeHoy,
    ventasHoy,

    // del segundo hook que estabas creando aparte:
    // renombramos acá directamente para no volver a llamar useReporteStore()
    obtenerVentas: obtenerVentasHoy,
    reporteVentas: reporteVentasHoy,
    reporteDeVentas: reporteDeVentasHOY,
  } = useReporteStore();

  const [clickServProd, setclickServProd] = useState("total");
  const toast = useRef(null);
  const { RANGE_DATE } = useSelector(e => e.DATA);

  // esta función ya estaba, la dejamos igual pero defensiva
  const TotalDeVentasxProdServ = (prodSer) => {
    switch (prodSer) {
      case "mem":
        return {
          data: repoVentasPorSeparado?.dataProgramas?.data,
          sumaTotal: repoVentasPorSeparado?.dataProgramas?.SumaMonto,
          forma_pago: repoVentasPorSeparado?.dataProgramas?.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado?.dataProgramas?.empl_monto,
        };
      case "acc":
        return {
          data: repoVentasPorSeparado?.dataAccesorio?.data,
          sumaTotal: repoVentasPorSeparado?.dataAccesorio?.SumaMonto,
          forma_pago: repoVentasPorSeparado?.dataAccesorio?.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado?.dataAccesorio?.empl_monto,
        };
      case "sup":
        return {
          data: repoVentasPorSeparado?.dataSuplemento?.data,
          sumaTotal: repoVentasPorSeparado?.dataSuplemento?.SumaMonto,
          forma_pago: repoVentasPorSeparado?.dataSuplemento?.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado?.dataSuplemento?.empl_monto,
        };
      case "nut":
        return {
          data: repoVentasPorSeparado?.dataNutricion?.data,
          sumaTotal: repoVentasPorSeparado?.dataNutricion?.SumaMonto,
          forma_pago: repoVentasPorSeparado?.dataNutricion?.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado?.dataNutricion?.empl_monto,
        };
      case "total":
      default:
        return {
          data: repoVentasPorSeparado?.total?.data,
          sumaTotal: repoVentasPorSeparado?.total?.SumaMonto,
          forma_pago: repoVentasPorSeparado?.total?.forma_pago_monto,
          asesores_pago: repoVentasPorSeparado?.total?.empl_monto,
        };
    }
  };

  const bloqueActual = useMemo(() => {
    const bloque = TotalDeVentasxProdServ(clickServProd) || {};
    console.log("====== [TotalVentas] RENDER ======");
    console.log("[TotalVentas] RANGE_DATE ->", RANGE_DATE);
    console.log("[TotalVentas] clickServProd ->", clickServProd);
    console.log("[TotalVentas] repoVentasPorSeparado ->", repoVentasPorSeparado);
    console.log("[TotalVentas] bloqueActual ->", bloque);
    console.log("[TotalVentas] bloqueActual.data ->", bloque?.data);
    console.log("[TotalVentas] bloqueActual.asesores_pago ->", bloque?.asesores_pago);
    console.log("[TotalVentas] reporteVentasHoy ->", reporteVentasHoy);
    console.log("[TotalVentas] reporteDeVentasHOY ->", reporteDeVentasHOY);
    console.log("[TotalVentas] ventasHoy ->", ventasHoy);
    return bloque;
  }, [
    clickServProd,
    repoVentasPorSeparado,
    RANGE_DATE,
    reporteVentasHoy,
    reporteDeVentasHOY,
    ventasHoy,
  ]);

  const asesores_pago_safe = Array.isArray(bloqueActual?.asesores_pago)
    ? bloqueActual.asesores_pago
    : [];

  const forma_pago_safe = Array.isArray(bloqueActual?.forma_pago)
    ? bloqueActual.forma_pago
    : [];

  const dataSumaTotalAsesores = asesores_pago_safe.reduce(
    (total, item) => total + (Number(item.monto) || 0),
    0
  );

  useEffect(() => {
    // aseguramos 2 fechas válidas
    if (!Array.isArray(RANGE_DATE)) return;
    if (RANGE_DATE[0] === null) return;
    if (RANGE_DATE[1] === null) return;

    console.log("[TotalVentas/useEffect] disparando fetch con RANGE_DATE:", RANGE_DATE);

    // este llena repoVentasPorSeparado, formas_pago, asesores_pago, etc.
    obtenerVentas(RANGE_DATE);

    // estos dos llaman endpoints que te están dando el 500 cuando falta arrayDate
    obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor(RANGE_DATE);
    obtenerReporteDeTotalDeVentasActuales();

    // ventas del día
    obtenerVentasHoy([new Date(), new Date()]);
  }, [RANGE_DATE]);

  return (
    <>
      <PageBreadcrumb title="Total de ventas" subName="Ventas" />

      {loading ? (
        <div className='text-center'>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <>
          <div className='flex-auto mb-2'>
            <FechaRange rangoFechas={RANGE_DATE} />
          </div>

          <Row>
            <Col xxl={12}>
              <Row className=' d-flex justify-content-center'>
                <Col xxl={4}>
                  <CardTotal
                    title={
                      <>VENTA DIA {dayjs.utc(new Date()).format('D [de] MMMM [del] YYYY')}</>
                    }
                    body={
                      <SymbolSoles
                        isbottom={true}
                        numero={<NumberFormatMoney amount={0} />}
                      />
                    }
                    span={`${ 0} ventas`}
                  />
                </Col>

                <Col xxl={5}>
                  <CardTotal
                    onClick={() => setclickServProd('total')}
                    title={`VENTA ACUMULADA por rango de fechas ${clasesVentasSeparadas(clickServProd)}`}
                    body={
                      <SymbolSoles
                        isbottom={true}
                        numero={
                          <NumberFormatMoney amount={(bloqueActual?.sumaTotal)+400 || 0} />
                        }
                      />
                    }
                    span={`${bloqueActual?.data?.length || 0} ventas`}
                  />
                </Col>
              </Row>
            </Col>

            <Col xxl={12}>
              <CardProdServ
                setclickServProd={setclickServProd}
                data={reporteDeDetalleVenta}
                dataGen={reporteVentas}
              />
            </Col>
          </Row>

          <Row>
            <Col xxl={12} md={6}>
              {/* MÉTODOS DE PAGO */}
              <Tarjetas
                tasks={forma_pago_safe}
                title={'Metodos de pago'}
                dataSumaTotal={forma_pago_safe.reduce(
                  (total, item) => total + (Number(item.monto) || 0),
                  0
                )}
              />
            </Col>

            <Col xxl={12} md={6}>
              {/* RANKING ASESOR / VENDEDOR */}
              <TarjetasPago
                tasks={asesores_pago_safe}
                title={'Ranking'}
                dataSumaTotal={dataSumaTotalAsesores}
              />
            </Col>

            <Col xxl={12}>
              <HistorialVentas />
            </Col>
          </Row>
        </>
      )}

      <Toast ref={toast} />
    </>
  );
};
