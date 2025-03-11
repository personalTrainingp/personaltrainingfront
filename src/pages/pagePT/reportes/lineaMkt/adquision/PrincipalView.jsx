import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ItemTable } from './ItemTable'
import { useAdquisicionStore } from './useAdquisicionStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
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
    return datos.map(({ fecha, items }) => {
      const numero_cierre = items.length
      const ventas = sumarTarifaMonto(items)
      const ticket_medio = ventas / numero_cierre || 0
      return {
        header: [
            { celda: <span className='bg-white text-black p-2'>{fecha.toUpperCase()}</span> },
            { celda: '' }
        ],
        body: [
            [{ celda: 'VENTAS' }, { celda: <SymbolSoles fontSizeS={29} numero={<NumberFormatMoney amount={propsResumen(items).ventas}/>}/>}],
            [{ celda: 'SOCIOS' }, { celda: numero_cierre }],
            [{ celda: 'TICKET MEDIO' }, { celda: <SymbolSoles fontSizeS={29} numero={<NumberFormatMoney amount={ticket_medio}/>}/> }],
            [{ celda: <div className='bg-primary text-white text-center p-2 font-bold fs-5'>NUEVOS</div>, colSpan: 2 }],
            [{ celda: 'VENTAS' }, { celda: <SymbolSoles fontSizeS={29} numero={<NumberFormatMoney amount={ticket_medio}/>}/> }],
            [{ celda: 'SOCIOS' }, { celda: <SymbolSoles fontSizeS={29} numero={<NumberFormatMoney amount={ticket_medio}/>}/> }],
            [{ celda: 'TICKET MEDIO' }, { celda: <SymbolSoles fontSizeS={29} numero={<NumberFormatMoney amount={ticket_medio}/>}/> }],
        ]
      }
    });
}
export const PrincipalView = () => {
  const { obtenerTodoVentas, data } = useAdquisicionStore()
  useEffect(() => {
    obtenerTodoVentas()
  }, [])
  console.log(transformarArray(data));
  return (
    <>
    <PageBreadcrumb title={'ADQUISICION'}/>
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Body>
              <ItemTable dataF={transformarArray(data)}/>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </>
  )
}
