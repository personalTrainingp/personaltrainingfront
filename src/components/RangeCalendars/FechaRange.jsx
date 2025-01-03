import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { FormatRangoFecha } from '../componentesReutilizables/FormatRangoFecha';
import { Button } from 'primereact/button';
import { useForm } from '@/hooks/useForm';
import { Calendar } from 'primereact/calendar';
import { useDispatch } from 'react-redux';
import { onSetRangeDate } from '@/store/data/dataSlice';
import Swal from 'sweetalert2';

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
    <div className='d-flex flex-row aling-items-center'>
            {/* <div className='d-flex flex-column m-1'>
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
            </div> */}
        {/* */}
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
                {/* <FormatRangoFecha rangoFechas={rangoFechas}/> */}
    </div>
  )
}

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