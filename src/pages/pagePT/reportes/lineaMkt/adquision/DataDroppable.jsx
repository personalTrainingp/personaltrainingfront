import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ItemTable } from './ItemTable'
import { useAdquisicionStore } from './useAdquisicionStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { GrafLineal } from './GrafLineal'
import { ModalFilterRangeFechas } from './ModalFilterRangeFechas'
import { Filtered } from './Filtered'
import Select from 'react-select'
import dayjs from 'dayjs'
import { FormatTable3 } from '../FormatTable3'
import { ItemsxFecha } from '../ItemsxFecha'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const sumarTarifaMonto = (items)=>{
      const ventas = items.reduce((accum, item) => accum + (item.detalle_ventaMembresium?.tarifa_monto || 0), 0)
    return ventas
}
export const DataDroppable = ({dataMeses, hastaOption, desdeOption}) => {
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dataTotal = dataMeses;
  const dias = []
  for (let i = 1; i <= 31; i++) {
    dias.push({dia: i, value: i, label: i});
  }
    // ... todos tus estados previos

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(resultadosFiltrados);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setResultadosFiltrados(items);
  };
  useEffect(() => {
    if (dataMeses?.length > 0) {
      onClickFilter();
    }
  }, [dataMeses, hastaOption, desdeOption]);
  const onClickFilter = ()=>{
    setIsLoading(true);
    setTimeout(() => {
      const desde = desdeOption?.value || 1;
      const hasta = hastaOption?.value || 31;
      const dataFiltrada = dataMeses.map(({ anio, mes, itemsDia }) => ({
        anio,
        mes,
        dataTotal: itemsDia,
        itemsDia: itemsDia?.filter(d => d.dia >= desde && d.dia <= hasta),
      }));
      
      setResultadosFiltrados(dataFiltrada)
      setIsLoading(false);
    }, 600);
  }
    const scrollRef = useRef(null);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };
  return (
    <>
    
    <div>
      {/* Botones de navegación */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        marginBottom: '0.5rem'
      }}>
        <button onClick={() => scroll(-300)} aria-label="Izquierda">◀</button>
        <button onClick={() => scroll(300)} aria-label="Derecha">▶</button>
      </div>
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="resultados" direction="horizontal">
      {(provided) => (
        <div
          {...provided.droppableProps}
           /* Merge refs: react-beautiful-dnd + nuestro scrollRef */
              ref={el => {
                provided.innerRef(el);
                scrollRef.current = el;
              }}
          style={{
            display: 'flex',
            overflowX: 'auto',  // scroll horizontal aquí
            gap: '1rem',
            padding: '1rem',
            flexWrap: 'nowrap'
          }}
        >
          {resultadosFiltrados.map((r, idx, array) => (
            <Draggable key={idx} draggableId={`result-${idx}`} index={idx}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    flex: '0 0 auto',
                    width: '33%',
                    ...provided.draggableProps.style
                  }}
                >
                  <ItemsxFecha i={r} arrayTotal={r.dataTotal} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext> 
    </>
  )
}

function agruparxAnio(data) {
  const resultado = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.anio]) {
        acc[item.anio] = { anio: item.anio, items: [] };
      }
      acc[item.anio].items.push(item);
      return acc;
    }, {})
  );

  return resultado
  // const resultado = [];
          
  //         data?.forEach((item) => {
  //           const { anio } = item;
            
  //         //   console.log(horario, formatHorario, "horarrrr");
  //           // Verificar si ya existe un grupo con la misma cantidad de sesiones
  //           let grupo = resultado?.find((g) => g.anio === anio);
        
  //           if (!grupo) {
  //             // Si no existe, crear un nuevo grupo
  //             grupo = { anio: anio, items: [] };
  //             resultado.push(grupo);
  //           }
  //           // Agregar el item al grupo correspondiente
  //           grupo.items.push(item);
  //         });
          
  //         return resultado;
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
