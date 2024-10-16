import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { ModalHorario } from './ModalHorario'
import DataTable from 'react-data-table-component'
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore'

export const HorarioPrograma = ({uidPgm, data, idpgm}) => {
    const [isOpenModalHorario, setIsOpenModalHorario] = useState(false)
    const [Pending, setPending] = useState(true)
    const onOpenModalHorario = () =>{
        setIsOpenModalHorario(true)
    }
    const onCloseModalHorario = () =>{
        setIsOpenModalHorario(false)
    }
    const { startObtenerProgramaxUID} = useProgramaTrainingStore()

    useEffect(() => {
        startObtenerProgramaxUID(uidPgm)
      // const timeout = setTimeout(() => {
      //   setPending(false);
      // }, 2000);
      // return () => clearTimeout(timeout);
    }, []);
    const columns = [
      {
        name: 'Horario',
        selector: row => row.time_HorarioPgm,
      },
      {
        name: 'Aforo',
        selector: row => row.aforo_HorarioPgm,
      },
      {
        name: 'Entrenador',
        selector: row => row.trainer_HorarioPgm,
      },
      {
        name: 'Estado',
        selector: row => row.estado_HorarioPgm,
      },
    ];
  return (
    <>
    <Row className='m-4'>
    <Col>
    <Button onClick={onOpenModalHorario} className='m-2'>Agregar mas horario</Button>
    <ModalHorario onHide={onCloseModalHorario} show={isOpenModalHorario} uidPgm={uidPgm} idpgm={idpgm}/>
    
    <DataTable
        columns={columns}
        data={data}
        dense={true}
        noDataComponent={<p>No hay horarios disponibles</p>}
    />
    </Col>
    </Row>
    </>
  )
}
