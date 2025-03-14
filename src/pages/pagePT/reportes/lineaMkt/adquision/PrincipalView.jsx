import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ItemTable } from './ItemTable'
import { useAdquisicionStore } from './useAdquisicionStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { GrafLineal } from './GrafLineal'
const sumarTarifaMonto = (items)=>{
      const ventas = items.reduce((accum, item) => accum + (item.detalle_ventaMembresium?.tarifa_monto || 0), 0)
    return ventas
}
const propsResumen = (items)=>{
  console.log({items});
  
  const numero_cierre = items.length
  const ventas = sumarTarifaMonto(items)
  const ticket_medio = ventas / numero_cierre || 0
  return {
    numero_cierre,
    ventas, ticket_medio
  }
}
function transformarArray(datos) {
    return datos.map(({ mes, anio, items }) => {
      const numero_cierre = items.length
      const ventas = sumarTarifaMonto(items)
      const ticket_medio = ventas / numero_cierre || 0
      const cartera_renovacion = items.filter(f=>f.detalle_ventaMembresium.tb_ventum.id_origen===691)
      const cartera_reinscripciones = items.filter(f=>f.detalle_ventaMembresium.tb_ventum.id_origen===692)
      const nuevos = items.filter(f=>f.detalle_ventaMembresium.tb_ventum.id_origen!==692 && f.detalle_ventaMembresium.tb_ventum.id_origen!==691)
      return {
        anio: anio,
        header: [
            { celda: <div className='text-white w-100 text-center fs-1'>{mes.toUpperCase()}</div>, colSpan: 2 },
        ],
        body: [
          [{ celda: 'SOCIOS' }, { celda: <div className='text-center' style={{fontSize: '30px'}}>{propsResumen(items).numero_cierre}</div> }],
            [{ celda: 'VENTAS' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(items).ventas}/>}/>}],
            [{ celda: 'TICKET MEDIO' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(items).ticket_medio}/>}/> }],
            [{ celda: <div className='bg-primary text-white text-center p-2 font-bold fs-3'>NUEVOS</div>, colSpan: 2 }],
            [{ celda: 'SOCIOS' }, { celda: <div className='text-center' style={{fontSize: '30px'}}>{propsResumen(nuevos).numero_cierre}</div> }],
            [{ celda: 'VENTAS' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(nuevos).ventas}/>}/> }],
            [{ celda: 'TICKET MEDIO' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(nuevos).ticket_medio}/>}/> }],
            [{ celda: <div className='bg-primary text-white text-center p-2 font-bold fs-3'>RENOVACIONES</div>, colSpan: 2 }],
            [{ celda: 'SOCIOS' }, { celda: <div className='text-center' style={{fontSize: '30px'}}>{propsResumen(cartera_renovacion).numero_cierre}</div>}],
            [{ celda: 'VENTAS' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(cartera_renovacion).ventas}/>}/> }],
            [{ celda: 'TICKET MEDIO' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(cartera_renovacion).ticket_medio}/>}/> }],
            [{ celda: <div className='bg-primary text-white text-center p-2 font-bold fs-3'>REINSCRIPCIONES</div>, colSpan: 2 }],
            [{ celda: 'SOCIOS' }, { celda: <div className='text-center' style={{fontSize: '30px'}}>{propsResumen(cartera_reinscripciones).numero_cierre}</div> }],
            [{ celda: 'VENTAS' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(cartera_reinscripciones).ventas}/>}/> }],
            [{ celda: 'TICKET MEDIO' }, { celda: <SymbolSoles fontSizeS={`font-18`} numero={<NumberFormatMoney amount={propsResumen(cartera_reinscripciones).ticket_medio}/>}/> }],
        ]
      }
    });
}
export const PrincipalView = () => {
  const { obtenerTodoVentas, data } = useAdquisicionStore()
  useEffect(() => {
    obtenerTodoVentas()
  }, [])
  return (
    <>
    <PageBreadcrumb title={'VENTAS COMPARATIVAS POR AÑO'}/>
    <Row>
      <Col lg={12}>
        <Card>
          <h1 className='text-center' style={{fontSize: '70px'}}>2024</h1>
          <Card.Body>
              <ItemTable dataF={transformarArray(data).filter(f=>f.anio==='2024')}/>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12}>
        <Card>
          <h1 className='text-center' style={{fontSize: '70px'}}>2025</h1>
          <Card.Body>
              <ItemTable dataF={transformarArray(data).filter(f=>f.anio==='2025')}/>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={12}>
      <GrafLineal data={data}/>
      </Col>
    </Row>
    </>
  )
}
