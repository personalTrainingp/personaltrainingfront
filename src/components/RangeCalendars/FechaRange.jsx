import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { FormatRangoFecha } from '../componentesReutilizables/FormatRangoFecha';
import { Button } from 'primereact/button';
import { useForm } from '@/hooks/useForm';
import { Calendar } from 'primereact/calendar';
import { useDispatch } from 'react-redux';
import { onSetRangeDate } from '@/store/data/dataSlice';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const regsFechas = {
fec_desde: new Date(new Date().getFullYear(), 8, 16),
fec_hasta: new Date(),
}
export const FechaRange = ({rangoFechas}) => {
    // Your implementation here
    const dispatch = useDispatch()
    
    const [dateRange, setdateRange] = useState({
        fec_desde: rangoFechas[0],
        fec_hasta: rangoFechas[1]
    })
    // console.log(rangeDate[0]);
    const onClickFechaRange = ()=>{
        // if(dateRange.fec_desde)
        
        dispatch(onSetRangeDate([dateRange.fec_desde, dateRange.fec_hasta]))
    }
    useEffect(() => {
        // dispatch()
		// dispatch(onSetRangeDate([dateRange.fec_desde, dateRange.fec_hasta]))
    }, [dateRange])
    
  return (
    <div className='d-flex flex-row aling-items-center z-4 w-100 bg-white p-1'>
        <Row className='d-flex align-items-end'>
            <Col xxl={4}>
                <label className='' style={{fontSize: '28px'}}>
                    DESDE
                </label>
                <Calendar className='' value={dateRange.fec_desde} locale='es' maxDate={dateRange.fec_hasta} name='fec_desde' onChange={(e)=>setdateRange({fec_desde: e.value, fec_hasta: dateRange.fec_hasta})} showIcon />
            </Col>
            <Col xxl={4}>
                <label className='' style={{fontSize: '28px'}}>
                    HASTA
                </label>
                <Calendar className='' value={dateRange.fec_hasta} locale='es' minDate={dateRange.fec_desde} name='fec_hasta' onChange={(e)=>setdateRange({fec_desde: dateRange.fec_desde, fec_hasta: e.value})} showIcon />
            </Col>
            <Col xxl={4} className='' style={{fontSize: '25px'}}>
            <Button onClick={onClickFechaRange} className='m-0 '>actualizar</Button>
            </Col>
        </Row> 
        <br/>
        <br/>
    </div>
  )
}

export const FechaRangeMES = ({ rangoFechas, textColor }) => {
    const dispatch = useDispatch();
  const currentYear = dayjs().year();

  // Estado con fecha inicio y fin del mes seleccionado
  const [dateRange, setDateRange] = useState(() => {
    if (rangoFechas?.[0] && rangoFechas?.[1]) {
      return {
        fec_desde: new Date(rangoFechas[0]),
        fec_hasta: new Date(rangoFechas[1])
      };
    }
    // por defecto, mes actual
    return {
      fec_desde: dayjs().startOf('month').toDate(),
      fec_hasta: dayjs().endOf('month').toDate()
    };
  });

  // Sincronizar si cambia externamente rangoFechas
  useEffect(() => {
    if (rangoFechas?.[0] && rangoFechas?.[1]) {
      setDateRange({
        fec_desde: new Date(rangoFechas[0]),
        fec_hasta: new Date(rangoFechas[1])
      });
    }
  }, [rangoFechas]);

  // Al pulsar Actualizar, despacha el array [fec_desde, fec_hasta] en ISO
  const onClickActualizar = () => {
    dispatch(onSetRangeDate([
      dayjs(dateRange.fec_desde).startOf('day').toISOString(),
      dayjs(dateRange.fec_hasta).endOf('day').toISOString()
    ]));
  };

  return (
    <div className='justify-content-center' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '15px' }}>
      <Calendar
        value={dateRange.fec_desde}
        onChange={e => {
          const sel = e.value;
          setDateRange({
            fec_desde: dayjs(sel).startOf('month').toDate(),
            fec_hasta: dayjs(sel).endOf('month').toDate()
          });
        }}
        view="month"
        dateFormat="MM/yy"
        mask="99/9999"
        monthNavigator
        yearNavigator
        yearRange={`${currentYear - 2}:${currentYear + 1}`}
        locale="es"
          pt={{
            header: { className: 'custom-calendar-header' },
            monthDropdown: { style: { fontSize: '4.3rem', fontWeight: 'bold' } },
            yearDropdown: { style: { fontSize: '4.3rem', fontWeight: 'bold' } }
          }}
        className='fs-2'
        inputStyle={{ color: textColor, fontWeight: 'bold', width: '400px'}}
      />
      <Button style={{backgroundColor: textColor, borderColor: textColor}} onClick={onClickActualizar}>
        Actualizar
      </Button>
    </div>
  );
};
/**
 * 
 <div className='d-flex flex-column m-1'>
                <label>
                    FECHA DESDE
                </label>
                <Calendar value={dateRange.fec_desde} locale='es' maxDate={dateRange.fec_hasta} name='fec_desde' onChange={(e)=>setdateRange({fec_desde: e.value, fec_hasta: dateRange.fec_hasta})} showIcon />
            </div>
            <div className='d-flex flex-column m-1'>
                <label>
                    FECHA HASTA
                </label>
                <Calendar value={dateRange.fec_hasta} locale='es' minDate={dateRange.fec_desde} name='fec_hasta' onChange={(e)=>setdateRange({fec_desde: dateRange.fec_desde, fec_hasta: e.value})} showIcon />
            </div>
            <div className='d-flex flex-column m-1  justify-content-end'>
            <Button onClick={onClickFechaRange} className='m-0 '>actualizar</Button>
            </div>
 */