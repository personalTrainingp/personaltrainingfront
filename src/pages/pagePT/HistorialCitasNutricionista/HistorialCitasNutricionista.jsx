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
export const HistorialCitasNutricionista = () => {
    const { obtenerCitasxSERVICIO, loading } = useCitaStore()
    const [rangeCita, setrangeCita] = useState([])
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
    console.log(data);
    
  return (
    <>
    <PageBreadcrumb title={'Historial de citas nutricionista'} subName={'citas nut'}/>
        {
            !loading && (
                
    <Row>
    <Col xxl={9}>
    <DataScroller value={data} itemTemplate={ItemTemplate} rows={3} buffer={0.4} emptyMessage={'No hay citas'} />
    </Col>
    <Col xxl={3}>
    <Card className='p-2' style={{position: 'sticky', top: 90}}>
            <Card.Title>Filtrar por</Card.Title>
                        <div className='m-2'>
                            <label>Nutricionista:</label>
                            <Select
                                            name={'trainer_HorarioPgm'}
                                            placeholder={'Seleccione el Nutricionista'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            required
                                        ></Select>
                        </div>
                        <div className='m-2'>
                            <label>Estados:</label>
                            <Select
                                name={'trainer_HorarioPgm'}
                                placeholder={'Seleccione el estado'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={arrayEstadosCitas}
                                required
                            ></Select>
                        </div>
                        <div className='m-2'>
                            <label>Clientes:</label>
                            <Select
                                name={'trainer_HorarioPgm'}
                                placeholder={'Seleccione el cliente'}
                                className="react-select"
                                classNamePrefix="react-select"
                                required
                            ></Select>
                        </div>
                        <div className='m-2'>
                            <label>Rango de fecha:</label>
                            <Calendar placeholder='mm-dd-yyyy' value={rangeCita} onChange={(e) => setrangeCita(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection />

                        </div>
    </Card>
    </Col>
</Row>
            )
        }
    </>
  )
}
