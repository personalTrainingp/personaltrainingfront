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
  const dataNueva = data.map(d=>{
    return {
      ...d,
      
			itemsxDia: dataAgrupadoPorDIAMESANIO(d.items),
    }
  })
  console.log(transformarArray(data).filter(f=>f.anio==='2024'), data, dataNueva, "dataventa");
  
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



function dataAgrupadoPorDIAMESANIO(data) {

// Obtener el rango de fechas (mínimo y máximo)
const startDate = new Date(Math.min(...data.map(item => new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta))));
const endDate = new Date(Math.max(...data.map(item => new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta))));

// Crear el array de días de un mes
const getDaysOfMonth = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // Total de días en el mes
  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day); // Solo el día
  }
  return days;
};

// Agrupar los datos por día
const groupedByMonth = data.reduce((acc, item) => {
  const fecha = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Mes es 0-indexed, sumamos 1
  const anio = fecha.getFullYear();

  const param = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;

  let monthGroup = acc.find(group => group.mes === mes && group.anio === anio);

  if (!monthGroup) {
    monthGroup = {
      param: `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`,
      mes: mes.toString().padStart(2, '0'),
      anio,
      items: getDaysOfMonth(anio, mes).map(day => ({
        dia: day,
        items: [] // Inicializamos con un array vacío para cada día
      }))
    };
    acc.push(monthGroup);
  }

  const dayGroup = monthGroup.items.find(day => day.dia === dia);
  if (dayGroup) {
    dayGroup.items.push(item); // Agregar el item correspondiente al día
  }

  return acc;
}, []);

// Asegurarse de que cada día tenga el formato correcto
groupedByMonth.forEach(monthGroup => {
  monthGroup.items.forEach(day => {
    day.param = `${day.dia.toString().padStart(2, '0')}-${monthGroup.mes}-${monthGroup.anio}`;
  });
});
return groupedByMonth;
}
