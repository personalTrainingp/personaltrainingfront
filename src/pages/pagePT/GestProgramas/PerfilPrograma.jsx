import config from '@/config'
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore'
import React, { useEffect } from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { InformacionPrograma } from './InformacionPrograma'
import { HorarioPrograma } from './HorarioPrograma'
import { SemanasPrograma } from './SemanasPrograma'
import { useSelector } from 'react-redux'

export const PerfilPrograma = () => {
    const { uid } = useParams()
    const { startObtenerProgramaxUID, load } = useProgramaTrainingStore()
    const { data_PGM } = useSelector(e=>e.programaPT)
    useEffect(() => {
        startObtenerProgramaxUID(uid)
      }, [])
      
  if(load==="loading"){
    return (
      <>
      Cargando...
      </>
    )
  }
  return (
    <>
        <Card className='mt-3 p-3'>
            <div className='d-flex align-items-center'>
                <img 
                className='p-2' width={200} height={150}
                src={`${config.API_IMG.LOGO}${data_PGM.tb_image?.name_image}`}
                />
                
                <div className='m-2'>
                    <span className='fs-1 fw-bold'><p className='mb-0 pb-0'>{data_PGM?.name_pgm}</p></span>
                    <span className=''>{data_PGM?.desc_pgm}</span>
                </div>
            </div>
        </Card>
        <Card>
            <Tabs>
                <Tab eventKey={'tab_Info'} title={'Informacion del programa'}>
                    <InformacionPrograma data={data_PGM}/>
                </Tab>
                <Tab eventKey={'tab_Horario'} title={'Horarios'}>
                    <HorarioPrograma uidPgm={uid} data={data_PGM?.tb_HorarioProgramaPTs} idpgm={data_PGM.id_pgm}/>
                </Tab>
                <Tab eventKey={'tab_semanas'} title={'Semanas'}>
                    <SemanasPrograma data={data_PGM.tb_semana_trainings} uidPgm={uid} idpgm={data_PGM.id_pgm}/>
                </Tab>
            </Tabs>
        </Card>
    </>
  )
}
