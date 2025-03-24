
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { startOfWeek, getDay, format, parse } from 'date-fns';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { es } from 'date-fns/locale';
import AddEditEvent from './AddEditEvent';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { FormatoTimeMask } from '@/components/CurrencyMask';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
dayjs.locale('es')
const locales = {
  'es': es,
};

 // Componente personalizado para las celdas de tiempo
 const TimeSlotWrapper = ({ children, value }) => {
  const day = value.getDay(); // Obtener el día de la semana (0 = domingo, 6 = sábado)
  const hour = value.getHours(); // Obtener la hora del día
  const minutes = value.getMinutes(); // Obtener los minutos

  // Deshabilitar filas en sábado de 1pm a 6:30pm
  if (
    day === 6 && // Sábado
    (
      (hour === 13) || // 1pm
      (hour > 13 && hour < 18) || // De 2pm a 5pm
      (hour === 18 && minutes === 0) // 6pm exacto
    )
  ) {
    return (
      <div style={{ backgroundColor: '#e0e0e0', pointerEvents: 'none', display: 'none' }}>
        {children}
      </div>
    );
  }

  return children;
};
const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    color: 'black',
    fontFamily: '"Poppins", sans-serif',
    fontWeight: '400',
    borderRadius: '0px',
    border: 'none',
    padding: '2px 4px',
    fontSize: '15px',
  };
  let className = ''
  if (event.status_cita==="500") {
    className = 'leyenda-confirmada'
  }
  if(event.status_cita=="501"){
    className = 'leyenda-asistio'
  }
  if(event.status_cita=="502"){
    className = 'leyenda-no-asistio'
  }
  if(event.status_cita=="503"){
    className = 'leyenda-cancelada'
  }
  return {
    style: style,
    className: className
  };
};
// const timeSlotWrapper = (props) => (
//   <div
//     {...props}
//     className={props.className}
//     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#000')}
//     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
//   />
// );
// Componente personalizado para mostrar solo el título de los eventos
const CustomEvent = ({ event }) => {
  return(
    <p className='m-0 p-1 text-overflow-ellipsis white-space-nowrap overflow-hidden'>
    {dayjs(event.start).format('hh:mm A')}- {dayjs(event.end).format('hh:mm A')}
    {/* <FormatoTimeMask date={new Date(event.start).toISOString()} format={'hh:mm A'}/> */}
      <br/>
      {event.title}
    </p>
  )
};
const FullCalendarWidget = ({
  onDateClick,
  onEventClick,
  onDrop,
  onEventDrop,
  events,
  tipo_serv
}) => {
  const { obtenerCitasxSERVICIO, loading, data, dataCitaxID, obtenerCitaxID, obtenerCitasxClientexServicio } = useCitaStore()
  let newData=data.map(e=>{
    return {
      id: e.id,
      title: e.tb_cliente?.nombres_apellidos_cli,
      id_cli: e.id_cli,
      id_detallecita: e.id_detallecita,
      start: new Date(e.fecha_init),
      end: new Date(e.fecha_final),
      status_cita: e.status_cita,
      detalle_cita: ''
    }
  })
  const localizer = dateFnsLocalizer({
    format: (date, formatStr, locale) => format(date, formatStr, { locale: locales['es'] }),
    parse: (dateString, formatString, locale) => parse(dateString, formatString, new Date(), { locale: locales['es'] }),
    startOfWeek: (date, locale) => startOfWeek(date, { locale: locales['es'] }),
    getDay: (date, locale) => {
      const day = getDay(date);
      // Ajusta el día para que comience desde el lunes (0 para domingo, 1 para lunes, ..., 6 para sábado)
      return day
    },
    locales,
    formats: {
      timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, 'h:mm A', culture), // Formato de hora con AM/PM
    },
    culture: 'es',
  });
  useEffect(() => {
    obtenerCitasxSERVICIO( tipo_serv )
  }, [tipo_serv])

  const { defaultDate, formats, views } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 13),
      formats: {
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, 'hh:mm a', culture),
      },
    }),
    []
  )
    const [onModalAddEditEvent, setonModalAddEditEvent] = useState(false)
    const [idCita, setidCita] = useState(0)
    const [selectDATE, setselectDATE] = useState({start: '', end: ''})
    const { minutosperCita } = useSelector(i=>i.ui)
    const [minPerCita, setminPerCita] = useState({})

    const onCloseModalAddEditEvent = ()=>{
      setonModalAddEditEvent(false)
    }
    console.log(minutosperCita.value);

    useEffect(() => {
      if (idCita !== 0 && !selectDATE?.start) return; // Solo ejecutar si hay una cita seleccionada
      
      setselectDATE((prev) => ({
        ...prev,
        end: dayjs(prev.start).add(minutosperCita.value, 'minute').toDate(),
        minD: minutosperCita.value
      }));
      
    console.log({selectDATE}, "en full calendar");
    }, [minutosperCita]);

    const handleSelectSlot = (slotInfo) => {
      setidCita(0)
      
      // const dateSelect = {start: new Date(start), end: new Date(end)}
      // Crear un nuevo evento con un único slot
      const newEvent = {
        start: slotInfo.start,
        end: dayjs(slotInfo.start).add(minutosperCita.value, 'minute').toDate(), // Duración fija de 20 minutos usando dayjs
        minD: minutosperCita.value,
        title: 'Nuevo evento',
      };
      // console.log("hand", slotInfo);
      setonModalAddEditEvent(true)
      setselectDATE({...newEvent})
    };
    
    const onDoubleSelectEvent = (e)=>{
      const dateSelect = {start: new Date(e.start), end: new Date(e.end)}
      setidCita(e.id)
      setonModalAddEditEvent(true)
      setselectDATE({...dateSelect})
    }
    useEffect(() => {
      if(idCita==0)return;
      obtenerCitaxID(idCita)
    }, [idCita])
  return (
    <>
      {/* full calendar control */}
      {!loading&&(
        <>
        <Card>
          <Card.Body>
            <div id="calendar">
              <Calendar
                localizer={localizer}
                events={newData}
                onDoubleClickEvent={onDoubleSelectEvent}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
                views={['week']}
                eventPropGetter={eventStyleGetter}
                defaultView="week"
                components={{
                  event: CustomEvent,  // Utiliza el componente personalizado para mostrar solo el título del evento
                  // timeSlotWrapper 
                  timeSlotWrapper: TimeSlotWrapper,
                }}
                messages={{
                  next: "SEMANA SIGUIENTE",
                  today: "Hoy",
                  previous: "SEMANA ANTERIOR",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  showMore: total => `+ Ver más (${total})`
                }}
                step={10}
                timeslots={1}
                min={new Date(2024, 0, 1, 6, 0, 0)} // Mostrar desde las 6:00 AM
                max={new Date(2024, 0, 1, 21, 50, 0)} // Hasta las 11:59 PM
                formats={formats}
                onSelectSlot={handleSelectSlot}
                selectable="ignoreEvents"
              />
            </div>
            <AddEditEvent show={onModalAddEditEvent} tipo_serv={tipo_serv} onHide={onCloseModalAddEditEvent} dataCita={idCita==0?null:dataCitaxID} selectDATE={selectDATE}/>
          </Card.Body>
        </Card>
        </>
      )
      }
    </>
  );
};

export default FullCalendarWidget;
