import config from '@/config'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { ModalTipoCambio } from '../GestTipoCambio/ModalTipoCambio'
import { ModalIsFirma } from '@/components/ModalIsFirma'
import { useSelector } from 'react-redux'
import { Card, Col, Row } from 'react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'
import dayjs from 'dayjs'
import { useContratosDeClientes } from './useContratosDeClientes'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalPhotoCli } from './ModalPhotoCli'

export const DataTableContratoCliente = () => {
  const { obtenerContratosDeClientes, dataContratos, isLoading } = useContratosDeClientes()
  // const {  } = useState(0)
  const [idVenta, setidVenta] = useState(0)
  const [dataImages, setdataImages] = useState([])
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
    }
    console.log(isLoading);
    
    const onCloseModalTipoCambio = () =>{
        setisOpenModalTipoCambio(false)
    }
    const onOpenModalPhotoCli = (row)=>{
      setisModalPhotoCli(true)
      setdataImages(row.tb_cliente.tb_images)
      setuidAvtr(row.tb_cliente.uid_avatar)
      setidCli(row.id_cli)
    }
    const onCloseModalPhotoCli = ()=>{
      setisModalPhotoCli(false)
    }
    useEffect(() => {
      obtenerContratosDeClientes()
    }, [])
    
  const FotoBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.images_cli.length===0?<a onClick={()=>onOpenModalPhotoCli(rowData)} className='underline cursor-pointer'>SIN FOTO</a>:<a onClick={()=>onOpenModalPhotoCli(rowData)} className='underline cursor-pointer'>CON FOTO</a>}
      </>
    )
  }

  const firmaBodyTemplate = (rowData)=>{
    return (
      <>
        {
          rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
            <>
            {rowData.detalle_ventaMembresia[0].firma_cli==null?<a onClick={()=>onOpenModalTipoCambio(rowData.id, rowData.id_cli)} className='underline cursor-pointer'>SIN FIRMA</a>:'con firma'}
            </>
          )
        }
      </>
    )
  }
  const contratosSociosBodyTemplate = (rowData)=>{
    // console.log(rowData);
    
    return (
      <>
      {
        rowData.detalle_ventaMembresia[0].tarifa_monto!==0 && (
          <>
            {rowData.detalle_ventaMembresia[0].firma_cli==null?'':<a href={`${config.API_IMG.FILE_CONTRATOS_CLI}${rowData.detalle_ventaMembresia[0].contrato_x_serv?.name_image}`}>CONTRATO</a>}
          </>
        )
      }
        
      </>
    )
  }
  const nombreSocioBodyTemplate = (rowData)=>{
    const createdContrato = rowData.createdAt;
    const createdFirmas = rowData.detalle_ventaMembresia[0].firma_cli;
    //rowData.detalle_ventaMembresia[0].firma_cli?
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
      {rowData.nombre_apellidos}
      <br/>
      {
        !createdFirmas&&<>tiempo sin firmar: {dias} días, {horas} horas, {minutos} minutos, {segundos} segundos</>
      }
      
      </>
    )
  }
  const nombreAsesorBodyTemplate = (rowData)=>{
    return (
      <span className='text-primary fw-bold'>
      {rowData.asesor}
      </span>
    )
  }
  const programaSemanaBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.pgmYsem}
      </>
    )
  }
  const tarifaMontoBodyTemplate = (rowData)=>{
    return (
      <>
      <NumberFormatMoney amount={rowData.detalle_ventaMembresia[0]?.tarifa_monto}/>
      </>
    )
  }
  const onClickChangeData = (data, labelData)=>{
    console.log(data, "datachange");
    
    // console.log('click change data');
    setdata(data)
    // setDataView(dataContratos)
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
// Función para agrupar por nombres_apellidos_empl y contar firmados y sinFirmas
function agruparVentasClientesxAvatar(dataView) {
  const groupedData = dataView?.reduce((acc, current) => {
    const empleado = current.asesor;
  
    // Buscamos si ya existe una entrada para este empleado
    let empleadoEntry = acc.find(item => item.nombres_empl === empleado);
  
    // Si no existe, la inicializamos
    if (!empleadoEntry) {
      empleadoEntry = {
        nombres_empl: empleado,
        items: [],
        fotos: [],
        sinFotos: []
      };
      acc.push(empleadoEntry);
    }
  
    // Contamos firmados y sinFirmas en detalle_ventaMembresia
    const { images_cli } = current;
    if(images_cli?.length==0){
      empleadoEntry.sinFotos.push(current);
    }else{
      empleadoEntry.fotos.push(current);
    }
  
    // Agregamos el elemento actual a los items de este empleado
    empleadoEntry.items.push(current);
  
    return acc;
  }, []);
  return groupedData;
}

  return (
    <>
      <Row>
        {agruparFirmasxEmpl(dataView).map(f=>(
          <Col lg={3} className=''>
            <Card className='p-2'>
              <Card.Title className='fs-3 text-primary'>
                {f.nombres_empl}
              </Card.Title>
              <ul className='text-decoration-none'>
                <li className='hover-border-card-primary m-1 fs-4' onClick={()=>onClickChangeData(f.firmados, `FIRMADOS - ${f.nombres_empl}`)}>FIRMADOS: {f.firmados.length}</li>
                <li className='hover-border-card-primary m-1 fs-4' onClick={()=>onClickChangeData(f.sinFirmas, `NO FIRMADOS - ${f.nombres_empl}`)}>SIN FIRMA: {f.sinFirmas.length}</li>
                <li className='hover-border-card-primary m-1 fs-4' onClick={()=>onClickChangeData(f.fotos, `CON FOTO - ${f.nombres_empl}`)}>CON FOTO: {f.fotos.length}</li>
                <li className='hover-border-card-primary m-1 fs-4' onClick={()=>onClickChangeData(f.sinFotos, `SIN FOTO - ${f.nombres_empl}`)}>SIN FOTO: {f.sinFotos.length}</li>
              </ul>
            </Card>
          </Col>
        ))
        }
        {/* {agruparVentasClientesxAvatar(dataView).map((f, index)=>(
          <Col lg={3} className='' key={index}>
            <Card className='p-2' style={{height: '130px'}}>
              <Card.Title>
                {f.nombres_empl}
              </Card.Title>
              <ul className='text-decoration-none'>
                <li className='hover-border-card-primary' onClick={()=>onClickChangeData(f.fotos, `CON FOTO - ${f.nombres_empl}`)}>CON FOTO: {f.fotos.length}</li>
                <li className='hover-border-card-primary' onClick={()=>onClickChangeData(f.sinFotos, `SIN FOTO - ${f.nombres_empl}`)}>SIN FOTO: {f.sinFotos.length}</li>
              </ul>
            </Card>
          </Col>
        ))
        } */}
      </Row>
                  <DataTable size='small' value={data} paginator rows={10} dataKey="id"
                  globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} emptyMessage="Sin Contratos">
              <Column header="Asesor comercial" body={nombreAsesorBodyTemplate} style={{ maxWidth: '15rem' }} />
              <Column header="SOCIOS" body={nombreSocioBodyTemplate} style={{ minWidth: '12rem' }} />
              <Column header="Programa | Semanas" body={programaSemanaBodyTemplate} style={{ minWidth: '12rem' }} />
              <Column header="MONTO" body={tarifaMontoBodyTemplate} style={{ minWidth: '12rem' }} />
              <Column header="FOTO" body={FotoBodyTemplate} style={{ maxWidth: '5rem' }} />
              <Column header="Firmas" body={firmaBodyTemplate} style={{ maxWidth: '5rem' }} />
              <Column header="Contratos" body={contratosSociosBodyTemplate} style={{ maxWidth: '20rem' }} />

          </DataTable>
            <ModalIsFirma idCli={idCli} idVenta={idVenta} show={isOpenModalTipoCambio} onHide={onCloseModalTipoCambio}/> 
            <ModalPhotoCli uidAvtr={uidAvtr} id_cli={idCli} show={isModalPhotoCli} onHide={onCloseModalPhotoCli}/>
    </>
  )
}
