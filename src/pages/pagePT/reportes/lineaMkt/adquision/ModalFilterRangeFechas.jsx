import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { useForm } from '@/hooks/useForm';
import { Calendar } from 'primereact/calendar';
import { useDispatch } from 'react-redux';
import { onSetRangeDate } from '@/store/data/dataSlice';
import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore';

const regsFechas = {
fec_desde: new Date(2024, 8, 16),
fec_hasta: new Date(),
}
export const ModalFilterRangeFechas = ({onHide, show, header, data}) => {
    // Your implementation here
    const dispatch = useDispatch()
    const { PostFechasPeriodo } = useTerminologiaStore()
    const [dateRange, setdateRange] = useState({
        fec_desde: new Date(2024, 8, 16),
        fec_hasta: new Date()
    })
    // console.log(rangeDate[0]);
    const onClickFechaRange = (e)=>{
        e.preventDefault()
        // if(dateRange.fec_desde)
        PostFechasPeriodo('reporte-ventas', 'comparativaFechas', {fecha_desde_param: dateRange.fec_desde, fecha_hasta_param: dateRange.fec_hasta})
        // dispatch(onSetRangeDate([dateRange.fec_desde, dateRange.fec_hasta]))
    }
    useEffect(() => {
        // dispatch()
		// dispatch(onSetRangeDate([dateRange.fec_desde, dateRange.fec_hasta]))
    }, [dateRange])
    
  return (
    <Dialog onHide={onHide}  visible={show} style={{width: '40rem'}} header={'FECHAS'}>
        <form onSubmit={onClickFechaRange}>
          
        <Row>
            <Col>
                <label className="form-label" style={{fontSize: '28px'}}>
                    DESDE
                </label>
            </Col>
            <Col lg={12}>
                <Calendar className='' value={dateRange.fec_desde} locale='es' maxDate={dateRange.fec_hasta} name='fec_desde' onChange={(e)=>setdateRange({fec_desde: e.value, fec_hasta: dateRange.fec_hasta})} showIcon />
            </Col>
            <Col>
                <label className="form-label" style={{fontSize: '28px'}}>
                    HASTA
                </label>
            </Col>
            <Col lg={12}>
                <Calendar className='' value={dateRange.fec_hasta} locale='es' minDate={dateRange.fec_desde} name='fec_hasta' onChange={(e)=>setdateRange({fec_desde: dateRange.fec_desde, fec_hasta: e.value})} showIcon />
            </Col>
            <Col lg={12} className='' style={{fontSize: '25px'}}>
            <Button type='submit' className='m-0 '>AGREGAR PERIODO</Button>
            </Col>
        </Row> 
        </form>
    </Dialog>
  )
}
