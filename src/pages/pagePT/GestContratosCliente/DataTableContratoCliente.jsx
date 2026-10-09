import config from '@/config'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useMemo, useState } from 'react'
import { ModalIsFirma } from '@/components/ModalIsFirma'
import { useSelector } from 'react-redux'
import { Button, Card, Col, Row } from 'react-bootstrap'
import dayjs from 'dayjs'
import { useContratosDeClientes } from './useContratosDeClientes'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalPhotoCli } from './ModalPhotoCli'
import { DataResumenAsesor } from './DataResumenAsesor'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import Swal from 'sweetalert2'
import { ModalAgregarPersona } from '../GestionEventosAsistencia/ModalAgregarPersona'
import { useEventosAsistenciaStore } from '../GestionEventosAsistencia/useEventosAsistenciaStore'
import { pinDesdeDni } from '../GestionEventosAsistencia/pinHuellero'

export const DataTableContratoCliente = ({onOpenModalFotoCli, onOpenModalFirma}) => {
  const { obtenerContratosDeClientes, obtenerContratoxIDVENTA, tieneHuella, obtenerPinesConHuella } = useContratosDeClientes()
  const { agregarPersona, agregarHuella } = useEventosAsistenciaStore()
  // Cliente sin huella al que se le esta registrando la huella (null = modal cerrado)
  const [clienteHuella, setclienteHuella] = useState(null)
  const precargadoHuella = useMemo(
    () => clienteHuella && {
      nombre: String(clienteHuella.nombre_apellidos ?? '').trim().slice(0, 40),
      dni: String(clienteHuella.dni ?? '').trim(),
    },
    [clienteHuella]
  )
  // Si el cliente ya existe en el huellero (sin huella), solo se le agrega la huella del dedo
  const registrarHuellaCliente = async (persona) => {
    const resultado = await agregarPersona(persona)
    if (resultado.ok || !String(resultado.msg ?? '').startsWith('Ya existe una persona')) return resultado
    return agregarHuella(pinDesdeDni(persona.dni) ?? persona.dni, { dedo: persona.dedo, binaryData: persona.binaryData })
  }
  const onHuellaRegistrada = (resultado) => {
    Swal.fire({
      icon: 'success',
      title: resultado.msg || 'HUELLA REGISTRADA',
      showConfirmButton: false,
      timer: 1800,
    })
    obtenerPinesConHuella()
  }
  const { dataView } =useSelector(e=>e.DATA)
  const [data, setdata] = useState(dataView)
    const onOpenModalTipoCambio = (id_venta, idCli) =>{
        onOpenModalFirma(idCli, id_venta)
    }
    const onOpenModalPhotoCli = (row)=>{
      onOpenModalFotoCli(row.id_cli)
    }
    useEffect(() => {
      obtenerContratosDeClientes()
    }, [])
  const onClickChangeData = (data)=>{
    setdata(data)
  }
  // Función para agrupar por nombres_apellidos_empl y contar firmados y sinFirmas
  function agruparFirmasxEmpl(dataView) {
    // Ultima venta de cada cliente: la huella se cuenta una sola vez por cliente,
    // para el asesor de esa ultima venta
    const ultimaVentaxCli = new Map()
    dataView?.forEach((v) => {
      const actual = ultimaVentaxCli.get(v.id_cli)
      const esMasReciente = !actual ||
        new Date(v.createdAt) > new Date(actual.createdAt) ||
        (new Date(v.createdAt).getTime() === new Date(actual.createdAt).getTime() && v.id > actual.id)
      if (esMasReciente) ultimaVentaxCli.set(v.id_cli, v)
    })

    const groupedData = dataView?.reduce((acc, current) => {
      const empleado = current.asesor;
    
      // Buscamos si ya existe una entrada para este empleado
      let empleadoEntry = acc.find(item => item.nombres_empl === empleado);
      
      // Si no existe, la inicializamos
      if (!empleadoEntry) {
        empleadoEntry = {
          nombres_empl: empleado,
          items: [],
          firmados: [],
          sinFirmas: [],
          fotos: [],
          sinFotos: [],
          conHuella: [],
          sinHuella: []
        };
        acc.push(empleadoEntry);
      }
    
      // Contamos firmados y sinFirmas en detalle_ventaMembresia
      const { detalle_ventaMembresia, images_cli } = current;
      if(images_cli?.length==0){
        empleadoEntry.sinFotos.push(current);
      }else{
        empleadoEntry.fotos.push(current);
      }
      detalle_ventaMembresia?.forEach(detalle => {
        if(detalle.tarifa_monto!==0){
            if (detalle.firma_cli) {
              empleadoEntry.firmados.push(current)
            } else {
              empleadoEntry.sinFirmas.push(current)
            }
        }
      });
    
      if (ultimaVentaxCli.get(current.id_cli) === current) {
        const huella = tieneHuella(current.dni)
        if (huella === 'SI') empleadoEntry.conHuella.push(current)
        if (huella === 'NO') empleadoEntry.sinHuella.push(current)
      }

      // Agregamos el elemento actual a los items de este empleado
      empleadoEntry.items.push(current);
    
      return acc;
    }, []);
    return groupedData;
  }
  const columns = [
    {
      id: 0, header: 'ASESOR COMERCIAL', render:(row)=>{
        return (
          <>
          {row.asesor}
          </>
        )
      }
    },{
      id: 1, header: 'NOMBRES Y APELLIDOS', accessor: 'nombre_apellidos', render:(rowData)=>{
            const createdContrato = rowData.createdAt;
            const createdFirmas = rowData.detalle_ventaMembresia[0].firma_cli;
            // Fecha anterior
            const fechaAnterior = dayjs(createdContrato);

            // Fecha actual
            const hoy = dayjs(); // Toma la fecha y hora actual

        // Diferencia en milisegundos
          const diferenciaMilisegundos = hoy.diff(fechaAnterior);

          // Calcular días, horas, minutos y segundos
          const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
          const horas = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutos = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diferenciaMilisegundos % (1000 * 60)) / 1000);
          
        return (
          <>
          {
            rowData.detalle_ventaMembresia[0].tarifa_monto!==0 ? (
              <span className={`${!createdFirmas || rowData.images_cli?.length===0 ?'text-primary fw-bold':'text-black'}`}>
                {rowData.nombre_apellidos}
              </span>
            ): (
              <span className={rowData.images_cli.length===0 ?'text-primary fw-bold':'text-black'}>
                {rowData.nombre_apellidos}
              </span>
            )
          }
          <div className='text-muted'>DNI: {rowData.dni || '-'}</div>
          {
            rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
              !createdFirmas&&<span className='text-primary fw-bold'>tiempo sin firmar: {dias} días, {horas} horas, {minutos} minutos, {segundos} segundos</span>
            )
          }
          
          </>
        )
      },
    },{
      id: 2, header: 'Programa / Semanas', accessor: 'pgmYsem', render:(rowData)=>{
        return (
          <>
          {rowData.pgmYsem}
          </>
        )
      }
    },{
      id: 3, header: 'MONTO', render:(rowData)=>{
        return (
          <>
            <NumberFormatMoney amount={rowData.detalle_ventaMembresia[0]?.tarifa_monto}/>
          </>
        )
      }
    },
    {
      id: 4, header: 'FOTO', accessor: 'conFoto', render:(rowData)=>{
        return (
          <>
          {rowData.images_cli.length===0?
            <a onClick={()=>onOpenModalPhotoCli(rowData)} className='underline cursor-pointer fw-bold'>SIN FOTO</a>:
            <a onClick={()=>onOpenModalPhotoCli(rowData)} className='text-black underline cursor-pointer'>CON FOTO</a>
          }
          </>
        )
      }
    },{
      id: 5, header: 'SIN FIRMA', accessor: 'firmado', render:(rowData)=>{
        const createdFirmas = rowData.detalle_ventaMembresia[0].firma_cli;
        return (
          <>
            {
              rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
                <>
                {rowData.detalle_ventaMembresia[0].firma_cli==null?<a onClick={()=>onOpenModalTipoCambio(rowData.id, rowData.id_cli)} className='underline cursor-pointer fw-bold'>SIN FIRMA</a>:'con firma'}
                </>
              )
            }
          </>
        )
      }
    },{
      id: 7, header: '¿TIENE HUELLA?', render:(rowData)=>{
        const huella = tieneHuella(rowData.dni)
        if (huella === null) return <span className='text-muted'>...</span>
        if (huella === 'SI') return <span className='text-black'>SI</span>
        return (
          <a onClick={()=>setclienteHuella(rowData)} className='underline cursor-pointer fw-bold' title='Registrar huella'>
            NO
          </a>
        )
      }
    },{
      id: 6, header: 'CONTRATOS', render:(rowData)=>{
        return (
          <>
          {/* {`${config.API_IMG.FILE_CONTRATOS_CLI}${rowData.detalle_ventaMembresia[0].contrato_x_serv?.name_image}`} */}
          {
            rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
              <>
                {rowData.detalle_ventaMembresia[0].firma_cli==null?(
                  <a className='text-change underline' onClick={()=>obtenerContratoxIDVENTA(rowData.id)}>
                    CONTRATO
                  </a>
                ):<a className='text-black underline' href={`${config.API_IMG.FILE_CONTRATOS_CLI}${rowData.detalle_ventaMembresia[0].contrato_x_serv?.name_image}`}>CONTRATO</a>}
              </>
            )
          }
            
          </>
        )
      }
    }
  ]
  return (
    <>
      <Row>
        {agruparFirmasxEmpl(dataView).map((f, index, array)=>{
          return(
            <Col lg={3} className=''>
              <DataResumenAsesor f={f} array={array} onClickChangeData={onClickChangeData} huellaCargando={tieneHuella('') === null}/>
            </Col>
          )
        })
        }
      </Row>
      <div>
        <Button onClick={()=>onClickChangeData(dataView)}>TODOS LOS <br/> CONTRATOS</Button>
      </div>
      <DataTableCR
        columns={columns}
        data={data}
      />
      <ModalAgregarPersona
        show={clienteHuella !== null}
        onHide={()=>setclienteHuella(null)}
        agregarPersona={registrarHuellaCliente}
        onAgregada={onHuellaRegistrada}
        precargado={precargadoHuella}
        titulo='Registrar huella'
      />
    </>
  )
}
