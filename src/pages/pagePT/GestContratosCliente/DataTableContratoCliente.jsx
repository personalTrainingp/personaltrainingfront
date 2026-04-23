import config from '@/config'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { ModalIsFirma } from '@/components/ModalIsFirma'
import { useSelector } from 'react-redux'
import { Card, Col, Row } from 'react-bootstrap'
import dayjs from 'dayjs'
import { useContratosDeClientes } from './useContratosDeClientes'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalPhotoCli } from './ModalPhotoCli'
import { DataResumenAsesor } from './DataResumenAsesor'
import { DataTableCR } from '@/components/DataView/DataTableCR'

export const DataTableContratoCliente = ({onOpenModalFotoCli, onOpenModalFirma}) => {
  const { obtenerContratosDeClientes } = useContratosDeClientes()
  const [idVenta, setidVenta] = useState(0)
  const [uidAvtr, setuidAvtr] = useState('')
  const [isModalPhotoCli, setisModalPhotoCli] = useState(false)
  const [idCli, setidCli] = useState(0)
  const [isOpenModalTipoCambio, setisOpenModalTipoCambio] = useState(false)
  const { dataView } =useSelector(e=>e.DATA)
  const [data, setdata] = useState(dataView)
    const onOpenModalTipoCambio = (id_venta, idCli) =>{
        setisOpenModalTipoCambio(true)
        setidVenta(id_venta)
        setidCli(idCli)
        onOpenModalFirma(idCli)
    }
    const onCloseModalTipoCambio = () =>{
        setisOpenModalTipoCambio(false)
    }
    const onOpenModalPhotoCli = (row)=>{
      setisModalPhotoCli(true)
      setuidAvtr(row.tb_cliente.uid_avatar)
      setidCli(row.id_cli)
      onOpenModalFotoCli(row.id_cli)
    }
    const onCloseModalPhotoCli = ()=>{
      setisModalPhotoCli(false)
    }
    useEffect(() => {
      obtenerContratosDeClientes()
    }, [])
  const onClickChangeData = (data)=>{
    setdata(data)
  }
  // Función para agrupar por nombres_apellidos_empl y contar firmados y sinFirmas
  function agruparFirmasxEmpl(dataView) {

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
          sinFotos: []
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
      id: 1, header: 'NOMBRES Y APELLIDOS', render:(rowData)=>{
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
          <br/>
          {
            rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
              !createdFirmas&&<span className='text-primary fw-bold'>tiempo sin firmar: {dias} días, {horas} horas, {minutos} minutos, {segundos} segundos</span>
            )
          }
          
          </>
        )
      },
    },{
      id: 2, header: 'Programa / Semanas', render:(rowData)=>{
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
    },{
      id: 4, header: 'FOTO', render:(rowData)=>{
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
      id: 5, header: 'SIN FIRMA', render:(rowData)=>{
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
      id: 6, header: 'CONTRATOS', render:(rowData)=>{
        return (
          <>
          {
            rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
              <>
                {rowData.detalle_ventaMembresia[0].firma_cli==null?'':<a className='text-black underline' href={`${config.API_IMG.FILE_CONTRATOS_CLI}${rowData.detalle_ventaMembresia[0].contrato_x_serv?.name_image}`}>CONTRATO</a>}
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
              <DataResumenAsesor f={f} array={array} onClickChangeData={onClickChangeData}/>
            </Col>
          )
        })
        }
      </Row>
      <DataTableCR
        columns={columns}
        data={data}
      />
    </>
  )
}
