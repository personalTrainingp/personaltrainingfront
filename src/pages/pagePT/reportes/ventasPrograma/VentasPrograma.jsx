import { PageBreadcrumb } from '@/components'
import React, { useEffect } from 'react'
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import Statistics from './Statistics'
import { members } from './data'
import ProjectStatistics from './ProjectStatistics'
import TeamMembers from './TeamMembers'
import { useForm } from '@/hooks/useForm'
import { Calendar } from 'primereact/calendar'
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useReporteStore } from '@/hooks/hookApi/useReporteStore'
import { Statistics2 } from './Statistics2'
import { SemanasxPrograma } from './SemanasxPrograma'
import { ContratosMembresia } from './ContratosMembresia'
import { useReporteVentaxProgramaStore } from '@/hooks/hookApi/Reportes/useReporteVentaxProgramaStore'
const rangoFechas = {
  rangoDate:[new Date(new Date().getFullYear(), 0, 1), new Date()],
  id_programa: 0
}
export const VentasPrograma = () => {
  const { formState, rangoDate, id_programa, onInputChange, onInputChangeReact, onResetForm } = useForm(rangoFechas)
  const { obtenerProgramasActivos, programasActivos } = useTerminoStore()
  const { 
          obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO, programa_comparativa_mejoranio,
          obtenerReporteVentasPrograma_EstadoCliente, programa_estado_cliente,
          obtenerReporteVentasAcumuladas_y_Tickets, ventasxPrograma_ventasAcumuladasTickets,
          obtenerReporteVentasDeProgramasPorSemanas, ventasxPrograma_ventasDeProgramasPorSemanas, 
          // obtenerReporteVentasPorProgramas_x_ClientesFrecuentes, ventasxPrograma_clientesFrecuentes
         } = useReporteStore()
  const { obtenerMembresiasxFechaxPrograma, membresiasxFechaxPrograma , estadosClienteMembresia , dataClientes } = useReporteVentaxProgramaStore()
  useEffect(() => {
    obtenerProgramasActivos()
  }, [])
  useEffect(() => {
    if(id_programa===0) return;
    if(rangoDate[1]==null) return;
    if(rangoDate[0]==null) return;
    obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO(id_programa, rangoDate)
    obtenerReporteVentasAcumuladas_y_Tickets(id_programa, rangoDate)
    obtenerReporteVentasPrograma_EstadoCliente(id_programa, rangoDate)
    obtenerReporteVentasDeProgramasPorSemanas(id_programa, rangoDate)
    obtenerMembresiasxFechaxPrograma(id_programa, rangoDate)
    // obtenerReporteVentasPorProgramas_x_ClientesFrecuentes(id_programa, rangoDate)

    estadosClienteMembresia(id_programa , rangoDate[0] , rangoDate[1])
  }, [id_programa, rangoDate])

  

  let NroClientesNuevo = 0;
  let NroClientesReinscritos = 0;
  let NroClientesRenovados = 0;

  if(dataClientes?.cantidadPorEstado?.ClienteNuevo){
    NroClientesNuevo = dataClientes.cantidadPorEstado.ClienteNuevo;
    NroClientesReinscritos = dataClientes.cantidadPorEstado.ClienteReinscrito;
    NroClientesRenovados = dataClientes.cantidadPorEstado.ClienteRenovado;
  };
  
  const statisticsClientes = [
    {
      icon: 'mdi mdi-account-star-outline',
      variant: 'primary',
      title: 'CLIENTES NUEVOS',
      noOfProject: NroClientesNuevo//programa_estado_cliente?.nuevos?.length,
    },
    {
      icon: 'mdi mdi-account-group',
      variant: 'success',
      title: 'CLIENTES REINSCRITOS',
      noOfProject: NroClientesReinscritos//programa_estado_cliente?.reinscritos?.length,
    },
    {
      icon: 'mdi mdi-autorenew',
      variant: 'info',
      title: 'CLIENTES RENOVADOS',
      noOfProject: NroClientesRenovados//programa_estado_cliente?.renovados?.length,
    },
  ];
  const programasActivosTODO = [
    {value: 0, label: 'TODO LOS PROGRAMAS', urlAvatar: 'None'},
    ...programasActivos
  ]
  return (
    <>
    <PageBreadcrumb title="Ventas por programas" subName="Ventas" />
    <Row className='mb-4 align-items-center'>
      <Col xxl={2} md={4} xs={6}>
      <div className="mb-3">
        <label htmlFor="id_programa" className="form-label">
          Tipo de programa*
        </label>
        <Select
            onChange={(e)=>onInputChangeReact(e, "id_programa")}
            name={"id_programa"}
            placeholder={'Seleccione el programa'}
            className="react-select"
            classNamePrefix="react-select"
            options={programasActivosTODO}
            value={programasActivosTODO.find(
              (option) => option.value === id_programa
            )}
            required
        ></Select>
      </div>
      </Col>
      <Col xxl={3} md={4} xs={6}>
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
              Rango de fecha
          </label>
          <Calendar id="buttondisplay" value={rangoDate} name='rangoDate' onChange={onInputChange} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection />
        </div>
      </Col>
    </Row>
    <Row className='align-items-center'>
      <Statistics statisticsData={statisticsClientes}/>
    </Row>
    <Row>
      <Statistics2 statisticsData={ventasxPrograma_ventasAcumuladasTickets}/>
      {id_programa!==0 && (
        <Col xxl={12}>
        <SemanasxPrograma data={ventasxPrograma_ventasDeProgramasPorSemanas}/>
        </Col>
      )
      }
      <Col xxl={9}>
        <ProjectStatistics data={programa_comparativa_mejoranio}/>
      </Col>
      <Col xxl={3}>
        <TeamMembers members={members} title={'Ranking de socios'}/>
      </Col>
      <Col xxl={12}>
        <ContratosMembresia/>
      </Col>
    </Row>
    </>
    
  )
}
