import { PageBreadcrumb } from '@/components'
import React, { useEffect, useState } from 'react'
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
import { Loading } from '@/components/Loading'
import { VentasxDistritos } from './VentasxDistritos'
import { useReporteVentasxProgramasStore } from '@/hooks/hookApi/StoreVentasxProgramas/useReporteVentasxProgramasStore'
import { ModalCuadroVentas } from './ModalCuadroVentas'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import { useSelector } from 'react-redux'
const rangoFechas = {
  rangoDate:[new Date(new Date().getFullYear(), 8, 16), new Date()],
  id_programa: 0
}
export const VentasPrograma = () => {
  const { formState, rangoDate, id_programa, onInputChange, onInputChangeReact, onResetForm } = useForm(rangoFechas)
  const [isModalCuadroVentas, setisModalCuadroVentas] = useState(false)
  const [dataSocioxEstado, setdataSocioxEstado] = useState([])
  const { obtenerProgramasActivos, programasActivos } = useTerminoStore()
  const [obtenerTitleModalCuadro, setobtenerTitleModalCuadro] = useState('')
  const { 
          
          obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO, programa_comparativa_mejoranio,
          obtenerReporteVentasPrograma_EstadoCliente, programa_estado_cliente,
          obtenerReporteVentasAcumuladas_y_Tickets, ventasxPrograma_ventasAcumuladasTickets,
          obtenerReporteVentasDeProgramasPorSemanas, ventasxPrograma_ventasDeProgramasPorSemanas, 
          // obtenerReporteVentasPorProgramas_x_ClientesFrecuentes, ventasxPrograma_clientesFrecuentes
         } = useReporteStore()
  const { obtenerMembresiasxFechaxPrograma, membresiasxFechaxPrograma , estadosClienteMembresia , dataClientes,  } = useReporteVentaxProgramaStore()
  const { obtenerVentasxPrograma, numeroDeTraspaso, ventasxPrograma, obtenerTransferencias_x_pgm_x_Date, transferencias } = useReporteVentasxProgramasStore()
  useEffect(() => {
    obtenerProgramasActivos()
  }, [])
  const onModalOpenCuadroVentas = (title, dataSocio)=>{
    setisModalCuadroVentas(true)
    setobtenerTitleModalCuadro(title)
    setdataSocioxEstado(dataSocio)
  }
  const onModalCloseCuadroVentas = ()=>{
    setisModalCuadroVentas(false)
  }
  
  const [loading, setloading] = useState(false)
  const { RANGE_DATE } = useSelector(e=>e.DATA)
  useEffect(() => {
    const funcionDataExtract = async()=>{
      setloading(false)
      if(RANGE_DATE[1]==null) return;
      if(RANGE_DATE[0]==null) return;
      // if(id_programa===0) return;
      await obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO(id_programa, RANGE_DATE)
      await obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO(id_programa, RANGE_DATE)
      await obtenerReporteVentasAcumuladas_y_Tickets(id_programa, RANGE_DATE)
      await obtenerReporteVentasPrograma_EstadoCliente(id_programa, RANGE_DATE)
      await obtenerReporteVentasDeProgramasPorSemanas(id_programa, RANGE_DATE)
      await obtenerMembresiasxFechaxPrograma(id_programa, RANGE_DATE)
      await estadosClienteMembresia(id_programa , RANGE_DATE[0] , RANGE_DATE[1])
      await obtenerVentasxPrograma(id_programa, RANGE_DATE)
      await obtenerTransferencias_x_pgm_x_Date(id_programa, RANGE_DATE)
      // await obtenerClientesConTraspasos(id_programa, rangoDate)
      setloading(true)
    }
    
    funcionDataExtract()
    // obtenerReporteVentasPorProgramas_x_ClientesFrecuentes(id_programa, rangoDate)
  }, [id_programa, RANGE_DATE])

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
      noOfProject: dataClientes.clientesNuevos//programa_estado_cliente?.nuevos?.length,
    },
    {
      variant: 'info',
      title: 'TRASPASOS',
      noOfProject: numeroDeTraspaso-transferencias//programa_estado_cliente?.renovados?.length,
    },
    {
      variant: 'info',
      title: 'TRANSFERENCIAS',
      noOfProject: transferencias//programa_estado_cliente?.renovados?.length,
    },
    {
      icon: 'mdi mdi-account-group',
      variant: 'success',
      title: 'CLIENTES REINSCRITOS',
      noOfProject: dataClientes.clientesRei//programa_estado_cliente?.reinscritos?.length,
    },
    {
      icon: 'mdi mdi-autorenew',
      variant: 'info',
      title: 'CLIENTES RENOVADOS',
      noOfProject: dataClientes.clientesReno//programa_estado_cliente?.renovados?.length,
    },
  ];
  const programasActivosTODO = [
    {value: 0, label: 'TODOS LOS PROGRAMAS', urlAvatar: 'None'},
    ...programasActivos
  ]
  return (
    <>
    <PageBreadcrumb title="Ventas por programas" subName="Ventas" />
    
    <Row className='align-items-center'>
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
      <Col xxl={8} md={4} xs={6}>
        <FechaRange rangoFechas={RANGE_DATE}/>
      </Col>
    </Row>
    {
      loading==false?(
        <>
        <Loading show={loading}/>
        </>
      ):(
        <>
        
    <Row className='align-items-center'>
      <Statistics onModalOpenCuadroVentas={onModalOpenCuadroVentas} statisticsData={statisticsClientes}/>
    </Row>
    <Row>
      <Statistics2 statisticsData={ventasxPrograma_ventasAcumuladasTickets} id_programa={id_programa}/>
        <Col xxl={12}>
        <SemanasxPrograma data={ventasxPrograma_ventasDeProgramasPorSemanas}/>
        </Col>
      {/* <Col xxl={12}>
        <VentasxDistritos data={ventasxPrograma}/>
      </Col> */}
      <Col xxl={12}>
        <ProjectStatistics data={programa_comparativa_mejoranio}/>
      </Col>
    </Row>
    <ModalCuadroVentas dataSocioxEstado={dataSocioxEstado} TitleModalCuadro={obtenerTitleModalCuadro} onHide={onModalCloseCuadroVentas} show={isModalCuadroVentas}/>
        </>
      )
    }
    </>
    
  )
}
