import { PageBreadcrumb } from '@/components'
import React, { useEffect, useRef } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { CardCliente } from './CardCliente'
import { CardVenta } from './CardVenta'
import { CardPago } from './CardPago'
import { useSelector } from 'react-redux'
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'
import { Divider } from 'primereact/divider'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button'

export const NuevaVenta2 = () => {

	const refToast= useRef(null)
	const { venta, detalle_cli_modelo, datos_pagos } = useSelector(e=>e.uiNuevaVenta)
  const showToastVenta = (severity, summary, detail, label, life)=>{
    refToast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      label: label,
      life: life
    });
  }
  // Convertir la fecha a una cadena usando toLocaleDateString() con configuración regional y opciones
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    // const fechaFormateada = fecha.toLocaleDateString('es-PE', opciones);
  // console.log(new Date("2030-02-06T00:00:00.000Z"));
  return (
    <>
		<Toast ref={refToast}/>
    <PageBreadcrumb title="Nueva venta" subName="ventas" />
      <Row>
        <Col lg={3}>
            <CardPago venta={venta} dataPagos={datos_pagos}/>
            
            <CardCliente dataCliente={detalle_cli_modelo}/>
        </Col>
        <Col lg={9}>
        <div>
              {/* <Button label='AGREGAR CLIENTE' className='float-end'/> */}
              <CardVenta dataVenta={venta} detalle_cli_modelo={detalle_cli_modelo} datos_pagos={datos_pagos} funToast={showToastVenta}/>
        </div>
        </Col>
      </Row>
      
    {/* <Row>
        <Col lg={3}>
            
        </Col>
        <Col lg={9}>
            <CardVenta dataVenta={venta} detalle_cli_modelo={detalle_cli_modelo} datos_pagos={datos_pagos}/>
        </Col>
    </Row> */}
    </>
  )
}
