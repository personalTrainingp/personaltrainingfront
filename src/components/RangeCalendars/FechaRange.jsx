import React, { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Button as Btn } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { useDispatch } from 'react-redux';
import { onSetCorte, onSetRangeDate } from '@/store/data/dataSlice';
import dayjs from 'dayjs';
import { InputButton, InputSelect } from '../InputText';
import Select from 'react-select'
import { useForm } from '@/hooks/useForm';
export const FechaRangeMES = ({ rangoFechas, textColor }) => {
  const dispatch = useDispatch();

  const [mostrarInputs, setMostrarInputs] = useState(false);

  const [dateRange, setDateRange] = useState(() => {
    const desde = rangoFechas?.[0] ? new Date(rangoFechas[0]) : dayjs().startOf('month').toDate();
    const hasta = rangoFechas?.[1] ? new Date(rangoFechas[1]) : dayjs().endOf('month').toDate();
    return {
      fec_desde: desde,
      fec_hasta: hasta
    };
  });

  useEffect(() => {
    if (rangoFechas?.[0] && rangoFechas?.[1]) {
      setDateRange({
        fec_desde: new Date(rangoFechas[0]),
        fec_hasta: new Date(rangoFechas[1])
      });
    }
  }, [rangoFechas]);

  const onChangeDesde = (e) => {
    const newDesde = dayjs(e.target.value + '-01').startOf('month').toDate();
    setDateRange(prev => ({ ...prev, fec_desde: newDesde }));
  };

  const onChangeHasta = (e) => {
    const newHasta = dayjs(e.target.value + '-01').endOf('month').toDate();
    setDateRange(prev => ({ ...prev, fec_hasta: newHasta }));
  };

  const onClickActualizar = () => {
    dispatch(onSetRangeDate([
      dayjs(dateRange.fec_desde).startOf('day').toISOString(),
      dayjs(dateRange.fec_hasta).endOf('day').toISOString()
    ]));
    setMostrarInputs(false); // Oculta los inputs después de actualizar
  };

  return (
    <div className="text-center d-flex align-items-center justify-content-center gap-4 flex-wrap">
      {!mostrarInputs ? (
        <p
          style={{ color: textColor, fontWeight: 'bold', cursor: 'pointer', fontSize: '45px' }}
          onClick={() => setMostrarInputs(true)}
        >
          {dayjs(dateRange.fec_desde).format('D [de] MMMM [del] YYYY')} - {dayjs(dateRange.fec_hasta).format('D [de] MMMM [del] YYYY')}
          {/* {dayjs(dateRange.fec_desde).format('MMMM YYYY').toUpperCase()} - {dayjs(dateRange.fec_hasta).format('MMMM YYYY').toUpperCase()} */}
        </p>
      ) : (
<div className="d-flex gap-3 align-items-center">
  <div className="text-center">
    <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor }}>
      {dayjs(dateRange.fec_desde).format('D [de] MMMM [del] YYYY')}
    </div>
    <input
      type="date"
      autoFocus
      value={dayjs(dateRange.fec_desde).format('YYYY-MM-DD')}
      onChange={(e) => {
        const newDesde = dayjs(e.target.value).toDate();
        setDateRange(prev => ({ ...prev, fec_desde: newDesde }));
      }}
      style={{
        fontSize: '22px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: textColor,
        border: '2px solid ' + textColor,
        borderRadius: '8px',
        padding: '6px'
      }}
    />
  </div>

  <span style={{ fontSize: '30px', fontWeight: 'bold', color: textColor }}> - </span>

  <div className="text-center">
    <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor }}>
      {dayjs(dateRange.fec_hasta).format('D [de] MMMM [del] YYYY')}
    </div>
    <input
      type="date"
      value={dayjs(dateRange.fec_hasta).format('YYYY-MM-DD')}
      onChange={(e) => {
        const newHasta = dayjs(e.target.value).toDate();
        setDateRange(prev => ({ ...prev, fec_hasta: newHasta }));
      }}
      style={{
        fontSize: '22px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: textColor,
        border: '2px solid ' + textColor,
        borderRadius: '8px',
        padding: '6px'
      }}
    />
  </div>
</div>
      )}

      <div>
        <Button
          style={{ backgroundColor: textColor, borderColor: textColor }}
          onClick={onClickActualizar}
        >
          Actualizar
        </Button>
      </div>
    </div>
  );
};


export const FechaRange = ({rangoFechas, showHasta=true, className}) => {
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
            <Col xxl={showHasta?4:8}>
                <label className='' style={{fontSize: '28px'}}>
                    {showHasta?'DESDE':'hasta'}
                </label>
                <Calendar className={`${2} `}  value={dateRange.fec_desde} locale='es'  maxDate={dateRange.fec_hasta} name='fec_desde' onChange={(e)=>setdateRange({fec_desde: e.value, fec_hasta: dateRange.fec_hasta})} />
            </Col>
            {
              showHasta && (
                <Col xxl={4}>
                    <label className='' style={{fontSize: '28px'}}>
                        HASTA
                    </label>
                    <Calendar className={`${2}`} value={dateRange.fec_hasta} locale='es' minDate={dateRange.fec_desde} name='fec_hasta' onChange={(e)=>setdateRange({fec_desde: dateRange.fec_desde, fec_hasta: e.value})} />
                </Col>
              )
            }
            <Col xxl={4} className='' style={{fontSize: '25px'}}>
            <Btn onClick={onClickFechaRange} className={`m-0 ${className} p-0 fs-2 outline-none border-none`}>actualizar</Btn>
            {/* {className} */}
            </Col>
        </Row> 
        <br/>
        <br/>
    </div>
  )
}
const customFecha={
  inicio: 1,
  corte: 31
}
export const FechaCorte = ({corte1, inicio1, showHasta=true, className})=>{
  const fechas = del0al31()
const { formState, inicio, corte, onInputChange } = useForm(customFecha)
const dispatch = useDispatch()
const onSaveCorte = ()=>{
  dispatch(onSetCorte(formState))
}
  return (
    <>
    <Row>
      <Col lg={1}>
        <div className='mb-3'>
          <InputSelect label={'INICIO'} options={fechas} value={inicio} nameInput={'inicio'} onChange={onInputChange}/>
        </div>
      </Col>
      <Col lg={1}>
        <div className='mb-3'>
          <InputSelect label={'CORTE'} options={fechas} value={corte} nameInput={'corte'} onChange={onInputChange}/>
        </div>
      </Col>
      <Col lg={1}>
        <div className='mt-3'>
          <InputButton label={'AGREGAR'} className={'fs-3'} onClick={onSaveCorte}/>
        </div>
      </Col>
    </Row>
    </>
  )
}
function del0al31() {
    let fecha=[];
  for (let index = 1; index < 32; index++) {
    fecha.push({value: index, label: `${index}`})
  }
  return fecha;
}