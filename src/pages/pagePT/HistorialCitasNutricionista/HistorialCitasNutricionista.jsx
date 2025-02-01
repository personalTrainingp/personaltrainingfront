import { PageBreadcrumb } from '@/components'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { ItemDayEvent } from './ItemDayEvent'
import Select from 'react-select'
import { DataScroller } from 'primereact/datascroller';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore'
import { useSelector } from 'react-redux'
import { arrayEstadosCitas } from '@/types/type'
import { Calendar } from 'primereact/calendar'
import { useHistorialNutricionStore } from './useHistorialNutricionStore'
import { Button } from 'primereact/button'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useForm } from '@/hooks/useForm'

const getEstado = (status) => {
    
    switch (status) {
        case '500':
            return 'color-confirmada';
        case '501':
            return 'color-cancelada';
  
        case '502':
            return 'color-asistio';
        case '503':
            return 'color-no-asistio'
    }
  };
  const registrarFiltro = {
    id_empl: 0,
    id_cli: 0,
    status_cita: '0',

  }
export const HistorialCitasNutricionista = () => {
    const { obtenerCitasxSERVICIO, loading, obtenerNutricionistasActivos, obtenerParametrosClientes, dataCliente, dataEmpl } = useHistorialNutricionStore()
    
    // const [RANGE_DATE, setRANGE_DATE] = useState([])
    
    const { formState, id_empl, id_cli, status_cita, onInputChangeReact } = useForm(registrarFiltro)
        const { RANGE_DATE } = useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerCitasxSERVICIO('NUTRI') // id_servicio_nutricionista
    }, [])
    const { data } = useSelector(e=>e.calendar)
    const ItemTemplate = (data)=>{
        return (
            <>
            <ItemDayEvent data={data} getEstado={getEstado}/>
            </>
        )
    }
    if(loading){
        return <div>Cargando...</div>
    }
    useEffect(() => {
        obtenerNutricionistasActivos()
        obtenerParametrosClientes()
    }, [])
    const onClickButtonActualizar = ()=>{
        obtenerCitasxSERVICIO('NUTRI', {id_cli, id_empl, status_cita})
    }
  return (
    <>
    <PageBreadcrumb title={'Historial de citas nutricionista'} subName={'citas nut'}/>
        {
            !loading && (
                
    <Row>
        <Col xxl={9}>
        {/* <FechaRange rangoFechas={RANGE_DATE}/> */}
        <DataScroller value={data} itemTemplate={ItemTemplate} rows={5} buffer={0.4} emptyMessage={'No hay citas'} />
        </Col>
        <Col xxl={3}>
        <Card className='p-2' style={{position: 'sticky', top: 90}}>
                <Card.Title>Filtrar por</Card.Title>
                            <div className='m-2'>
                                <label>Nutricionista:</label>
                                <Select
												onChange={(e) => onInputChangeReact(e, 'id_empl')}
												name="id_empl"
												placeholder={'Seleccionar el nutricionista'}
												className="react-select"
												classNamePrefix="react-select"
												options={dataEmpl}
												value={dataEmpl.find(
													(option) => option.value === id_empl
												)||0}
												required
											/>
                            </div>
                            <div className='m-2'>
                                <label>Estados:</label>
                                <Select
												onChange={(e) => onInputChangeReact(e, 'status_cita')}
												name="status_cita"
												placeholder={'Seleccionar el estado'}
												className="react-select"
												classNamePrefix="react-select"
												options={arrayEstadosCitas}
												value={arrayEstadosCitas.find(
													(option) => option.value === status_cita
												)||0}
												required
											/>
                            </div>
                            <div className='m-2'>
                                <label>Clientes:</label>
                                <Select
												onChange={(e) => onInputChangeReact(e, 'id_cli')}
												name="id_cli"
												placeholder={'Seleccionar el cliente'}
												className="react-select"
												classNamePrefix="react-select"
												options={dataCliente}
												value={dataCliente.find(
													(option) => option.value === id_cli
												)||0}
												required
											/>
                            </div>
                            {/* <div className='m-2'>
                                <label>Rango de fecha:</label>
                                <br/>
                                    <FechaRange rangoFechas={RANGE_DATE}/>
                            </div> */}
                                {/* <Calendar placeholder='mm-dd-yyyy' className='w-100' value={rangeCita} onChange={(e) => setrangeCita(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection /> */}
                            <div>
                                <Button onClick={onClickButtonActualizar} label='ACTUALIZAR'/>
                            </div>
        </Card>
        </Col>
    </Row>
            )
        }
    </>
  )
}
