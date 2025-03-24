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
import { FilterMatchMode } from 'primereact/api'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export const DataTableContratoCliente = () => {
  const { obtenerContratosDeClientes, dataContratos, isLoading } = useContratosDeClientes()
    const [customers, setCustomers] = useState([]);
  // const {  } = useState(0)
  const [idVenta, setidVenta] = useState(0)
  const [dataImages, setdataImages] = useState([])
  const [uidAvtr, setuidAvtr] = useState('')
  const [isModalPhotoCli, setisModalPhotoCli] = useState(false)
  const [idCli, setidCli] = useState(0)
  const [isOpenModalTipoCambio, setisOpenModalTipoCambio] = useState(false)
  const { dataView } =useSelector(e=>e.DATA)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [data, setdata] = useState(dataView)
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    
	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };
		_filters['global'].value = value;
		
		setFilters(_filters);
		setGlobalFilterValue(value);
	};

      const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
          
                // Crea una copia del objeto antes de modificarlo
          let newItem = { ...d };
          return newItem;
        });
      };
        const renderHeader = () => {
          return (
            <div className="d-flex">
              {/* <h4 className="m-0">Customers</h4> */}
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Buscador global"
                />
              </IconField>
              <Button label='TODOS' onClick={()=>setdata(dataView)}/>
            </div>
          );
        };
    const onOpenModalTipoCambio = (id_venta, idCli) =>{
        setisOpenModalTipoCambio(true)
        setidVenta(id_venta)
        setidCli(idCli)
    }
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
    
      useEffect(() => {
        if(dataView.length<=0){
          const fetchData = () => {
            setCustomers(getCustomers(dataView));
            // setLoading(false);
          };
          fetchData();
        }
      }, [dataView]);
    
  const FotoBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.images_cli.length===0?
      <a onClick={()=>onOpenModalPhotoCli(rowData)} className='underline cursor-pointer fw-bold'>SIN FOTO</a>:
      <a onClick={()=>onOpenModalPhotoCli(rowData)} className='text-black underline cursor-pointer'>CON FOTO</a>
      }
      </>
    )
  }

  const firmaBodyTemplate = (rowData)=>{
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
  const contratosSociosBodyTemplate = (rowData)=>{
    // console.log(rowData);
    
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


const onOpenModal = (e)=>{
  setgastoxID(undefined)
  // onOpenModalIvsG(e)
}

const header = renderHeader();
  return (
    <>
      <Row>
        {agruparFirmasxEmpl(dataView).map((f, index, array)=>{
          const objAtenas = array.find(r=>r.nombres_empl==='ATENAS CORAL FIGUEROA DE OTERO')
          const objJesus = array.find(r=>r.nombres_empl==='JESUS CONTRERAS TENORIO')
          const firmadosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.firmados.length+objJesus.firmados.length+objAtenas.firmados.length:f.firmados.length
          const SinfirmadosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.sinFirmas.length+objJesus.sinFirmas.length+objAtenas.sinFirmas.length:f.sinFirmas.length
          const fotosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.fotos.length+objJesus.fotos.length+objAtenas.fotos.length:f.fotos.length
          const sinfotosA = f.nombres_empl==='ALVARO SALAZAR GOMEZ'?f.sinFotos.length+objJesus.sinFotos.length+objAtenas.sinFotos.length:f.sinFotos.length
          const contratos = firmadosA + SinfirmadosA
          const fotosSinFoto = fotosA + sinfotosA
          const firmados = firmadosA
          const sinFirmas = SinfirmadosA
          const fotos = fotosA
          const sinFotos = sinfotosA
          return(
            <Col lg={3} className=''>
              <Card className='p-2'>
                <Card.Title className='fs-3 text-primary'>
                  {f.nombres_empl}
                </Card.Title>
                <ul className='text-decoration-none'>
                  <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.firmados, `FIRMADOS - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>FIRMADOS:</span> <span className='text-primary'>{firmados}</span> - <span className=''>{((f.firmados.length/contratos)*100).toFixed(2)} %</span>  </li>
                  <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.sinFirmas, `NO FIRMADOS - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>SIN FIRMA:</span> <span className='text-primary'>{sinFirmas}</span> - <span>{((f.sinFirmas.length/contratos)*100).toFixed(2)} %</span> </li>
                  <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.fotos, `CON FOTO - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>CON FOTO: </span> <span className='text-primary'>{fotos}</span> - <span> </span> {((f.fotos.length/fotosSinFoto)*100).toFixed(2)} %</li>
                  <li className='hover-border-card-primary m-1 fs-3' onClick={()=>onClickChangeData(f.sinFotos, `SIN FOTO - ${f.nombres_empl}`)}><span style={{fontWeight: '13px'}}>SIN FOTO:</span> <span className='text-primary'>{sinFotos}</span> - <span></span> {((f.sinFotos.length/fotosSinFoto)*100).toFixed(2)} %</li>
                </ul>
              </Card>
            </Col>
          )
        })
        }
      </Row>
                  <DataTable 
					        header={header}
                  filters={filters}
                  size='small' stripedRows value={data} paginator rows={10} dataKey="id"
                  globalFilterFields={['nombre_apellidos']} emptyMessage="Sin Contratos">
              <Column header="Asesor comercial" body={nombreAsesorBodyTemplate} style={{ maxWidth: '15rem' }} />
              <Column field='nombre_apellidos' header="SOCIOS" body={nombreSocioBodyTemplate} style={{ minWidth: '12rem' }} />
              <Column header="Programa / Semanas" body={programaSemanaBodyTemplate} style={{ minWidth: '12rem' }} />
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
