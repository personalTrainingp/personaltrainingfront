
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { startOfWeek, getDay, format, parse } from 'date-fns';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { es } from 'date-fns/locale';
import AddEditEvent from './AddEditEvent';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
dayjs.locale('es')
const locales = {
  'es': es,
};
const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    color: 'white',
    borderRadius: '0px',
    border: 'none',
    padding: '2px 4px',
    height: '40px', // Ajusta la altura según lo deseado
    width: '250px', // Ajusta el ancho según lo deseado
    fontSize: '14px',
  };
  let className = ''
  if (event.status_cita==="500") {
    className = 'leyenda-confirmada'
  }
  if(event.status_cita==501){
    className = 'leyenda-cancelada'
  }
  return {
    style: style,
    className
  };
};
// Componente personalizado para mostrar solo el título de los eventos
const CustomEvent = ({ event }) => {
  return(
    <p className='m-0 p-1 text-overflow-ellipsis white-space-nowrap overflow-hidden fs-5'>{
      `${new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} : 
    ${event.title}`}</p>
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
  const { obtenerCitasxSERVICIO, loading, data, dataCitaxID, obtenerCitaxID } = useCitaStore()
  let newData=data.map(e=>{
    return {
      id: e.id,
      title: e.tb_cliente.nombres_apellidos_cli,
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

    const onCloseModalAddEditEvent = ()=>{
      setonModalAddEditEvent(false)
    }

    const handleSelectSlot = ({ start }) => {
      const end = new Date(start);
      setidCita(0)
      end.setMinutes(end.getMinutes() + 30); // Duración fija de 30 minutos
      const dateSelect = {start: new Date(start), end: new Date(end)}
      setonModalAddEditEvent(true)
      setselectDATE({...dateSelect})
    };
    const onDoubleSelectEvent = (e)=>{
      const end = new Date(e.start);
      end.setMinutes(end.getMinutes() + 30); // Duración fija de 30 minutos
      const dateSelect = {start: new Date(e.start), end: new Date(end)}
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
                event: CustomEvent, // Utiliza el componente personalizado para mostrar solo el título del evento
              }}
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                showMore: total => `+ Ver más (${total})`
              }}
              step={30}
              timeslots={1}
              formats={formats}
              onSelectSlot={handleSelectSlot}
              selectable
            />
          </div>
          <AddEditEvent show={onModalAddEditEvent} tipo_serv={tipo_serv} onHide={onCloseModalAddEditEvent} dataCita={idCita==0?null:dataCitaxID} selectDATE={selectDATE}/>
        </>
      )
      }
    </>
  );
};

export default FullCalendarWidget;
