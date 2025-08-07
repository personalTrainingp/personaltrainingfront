import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { ItemTable } from './ItemTable'
import { useAdquisicionStore } from './useAdquisicionStore'
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { GrafLineal } from './GrafLineal'
import { ModalFilterRangeFechas } from './ModalFilterRangeFechas'
import { Filtered } from './Filtered'
import Select from 'react-select'
import dayjs from 'dayjs'
import { FormatTable3 } from '../FormatTable3'
import { ItemsxFecha } from '../ItemsxFecha'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { DataDroppable } from './DataDroppable'
import { TabPanel, TabView } from 'primereact/tabview'
import { TableDataComparativaVendedores } from './TableDataComparativaVendedores'
import config from '@/config'
import { useInView } from 'react-intersection-observer'
import { onSetViewSubTitle } from '@/store'
import { useDispatch } from 'react-redux'
import { TableResumen3 } from './TableResumen3'
import { TableResumen4 } from './TableResumen4'
import { GraficoLineal } from './GraficoLineal'
const sumarTarifaMonto = (items)=>{
      const ventas = items.reduce((accum, item) => accum + (item.detalle_ventaMembresium?.tarifa_monto || 0), 0)
    return ventas
}

export const PrincipalView = () => {
  const { obtenerTodoVentas, data, dataVendedores, dataProgramas, dataUnif, dataVentas, dataProgramasx, dataTotalPgmX, dataVendedorAnualizados } = useAdquisicionStore()
  const [isOpenModalFilteredDia, setisOpenModalFilteredDia] = useState(false)
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { dataView } = useSelector(e=>e.DATA)
  useEffect(() => {
    obtenerTodoVentas()
  }, [])
  const onCloseModalFilteredDia = ()=>{
    setisOpenModalFilteredDia(false)
  }
  const onOpenModalFilteredDia = ()=>{
    setisOpenModalFilteredDia(true)
  }
  const dias = []
  for (let i = 1; i <= 31; i++) {
    dias.push({dia: i, value: i, label: i});
  }
  const [desdeOption, setdesdeOption] = useState({ dia: 1, value: 1, label: 1 });
  const [hastaOption, sethastaOption] = useState({ dia: 31, value: 31, label: 31 });
    // ... todos tus estados previos

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(resultadosFiltrados);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setResultadosFiltrados(items);
  };
  const handleChangedesde = (selectedOption) => {
    setdesdeOption(selectedOption);
  };
  const handleChangehasta = (selectedOption) => {
    sethastaOption(selectedOption);
  };
  useEffect(() => {
    if (data?.length > 0) {
      onClickFilter();
    }
  }, [data]);
  const onClickFilter = ()=>{
    setIsLoading(true);
    setTimeout(() => {
      const desde = desdeOption?.value || 1;
      const hasta = hastaOption?.value || 31;
      const dataFiltrada = data.map(({ anio, mes, itemsDia }) => ({
        anio,
        mes,
        itemsDia,
        itemsDia: itemsDia?.filter(d => d.dia >= desde && d.dia <= hasta),
      }));
      
      setResultadosFiltrados(dataFiltrada)
      setIsLoading(false);
    }, 600);
  }
  const programas2024 = useMemo(() => {
  return dataProgramas.map(datapgm => ({
    ...datapgm,
    items: datapgm.items.filter(item => item.anio === '2024'),
  }));
}, [dataProgramas]);

const programas2025 = useMemo(() => {
  return dataProgramas.map(datapgm => {
    const filtrados = datapgm.items.filter(item => item.anio === '2025');
    console.log({ resu2025: filtrados }); // solo se ejecuta 1 vez por cambio de dataProgramas
    return {
      ...datapgm,
      items: filtrados
    };
  });
}, [dataProgramas]);

const unif2024 = useMemo(() => dataUnif.filter(item => item.anio === '2024'), [dataUnif]);
const unif2025 = useMemo(() => dataUnif.filter(item => item.anio === '2025'), [dataUnif]);
const dispatch = useDispatch()
console.log({unif2024, programas2024, dt: dataVentas.items, dataProgramas, d1: [dataProgramasx[0]]});
    const [extractTitle, setextractTitle] = useState('')
    

const dataDetalleSeccion = [
  {
    title: 'd1',
    HTML: <div className='mt-3'>
          <TabView>
            <TabPanel header={<div style={{fontSize: '60px'}}>2024</div>}>
              {
              programas2024.map(datapgm=>{
                  return (
                    <>
                    <h1 className='text-center'>
                      <img src={`${config.API_IMG.LOGO}${datapgm.items[0]?.items[0]?.tb_image?.name_image}`} height={datapgm.items[0].items[0]?.tb_image?.height} width={datapgm.items[0].items[0]?.tb_image?.width}/>
                    </h1>
                    
                    <TablaResumen2 data={datapgm.items}/>
                    </>
                  )
                })
              }
                <h1 className='text-center'>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={300}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={200}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={200}/>
                    </span>
                  </div>
                </h1>
            </TabPanel>
            <TabPanel header={<div style={{fontSize: '60px'}}>2025</div>}>
                {programas2025.map(pgm => (
                  <div key={pgm.id}>
                    <h1 className='text-center'>
                      <img src={`${config.API_IMG.LOGO}${pgm.items[0].items[0].tb_image.name_image}`} height={pgm.items[0].items[0].tb_image.height} width={pgm.items[0].items[0].tb_image.width}/>
                    </h1>
                    <TablaResumen2 data={pgm.items} />
                  </div>
                  ))}
                <h1 className='text-center mt-5'>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                </h1>
                <TabView>
                  <TabPanel header={'TABLA'}>
                    <TablaResumen2 data={dataVentas.items}/>
                  </TabPanel>
                  <TabPanel header={'GRAFICO'}>
                    <GraficoLineal data={dataVentas.items}/>
                  </TabPanel>
                </TabView>
            </TabPanel>
          </TabView>
        </div>
  },
  {
    title: 'COMPARATIVO VENTAS ANUALIZADO POR PROGRAMAS Y CATEGORIA',
    HTML: 
    <TabView>
          <TabPanel header={<>CHANGE 45</>}>
                <TablaResumen3 imgs={
                  <>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                  </div>
                  </>
                } data={[dataProgramasx[0]]}/>
          </TabPanel>
          <TabPanel header={<>FISIO MUSCLE</>}>
                <TablaResumen3 imgs={<>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                  </div>
                  </>} data={[dataProgramasx[1]]}/>
          </TabPanel>
          <TabPanel header={<>FS 45</>}>
                <TablaResumen3 imgs={
                  <>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                  </>
                } data={[dataProgramasx[2]]}/>
          </TabPanel>
          <TabPanel header={<>TOTAL</>}>
                <TableResumen3 imgs={<>
                  
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                  </>} rawData={dataTotalPgmX.items}/>
          </TabPanel>
        </TabView>
  },
  {
    title: 'COMPARATIVO VENTAS ANUALIZADO POR PROGRAMAS Y CATEGORIA - POR VENDEDOR',
    HTML: 
    <TabView>
          <TabPanel header={<>CHANGE 45</>}>
                <TablaResumen3 imgs={
                  <>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                  </div>
                  </>
                } data={[dataProgramasx[0]]}/>
          </TabPanel>
          <TabPanel header={<>FISIO MUSCLE</>}>
                <TablaResumen3 imgs={<>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                  </div>
                  </>} data={[dataProgramasx[1]]}/>
          </TabPanel>
          <TabPanel header={<>FS 45</>}>
                <TablaResumen3 imgs={
                  <>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                  </>
                } data={[dataProgramasx[2]]}/>
          </TabPanel>
          <TabPanel header={<>TOTAL</>}>
                <TableResumen4 imgs={<>
                  
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                  </>} rawData={dataVendedorAnualizados?.items}/>
          </TabPanel>
        </TabView>
  }
]
const sectionRefs = dataDetalleSeccion.map(() =>
        useInView({
          threshold: 0.1, // Activa cuando el 50% de la sección esté visible
          triggerOnce: false, // Detectar entrada y salida constantemente
        })
      );
      
            useEffect(() => {
              sectionRefs.forEach(({ inView }, index) => {
                if (inView) {
                  console.log("accccc");
                  
                  setextractTitle(dataDetalleSeccion[index]?.title)
                    dispatch(onSetViewSubTitle(extractTitle))
                  // setActiveSection(sections[index].title);
                  // dispatch(onSetViewSubTitle(`${data[index].title}`))
                }
              });
            }, [sectionRefs]);
                    const {viewSubTitle} = useSelector(d=>d.ui)
                  
  return (
    <>
    <PageBreadcrumb title={`${viewSubTitle}`}/>
    {/* {JSON.stringify(data)} */}
    <Row>
        {/* <h1>DETALLE EN PROGRAMA</h1> */}
        {/* <div className='mt-3'>
          <TabView>
            <TabPanel header={<div style={{fontSize: '60px'}}>2024</div>}>
              {
              dataProgramas.map(datapgm=>{
                  const items2024=datapgm?.items.filter(aio=>aio.anio==='2024')
                  
                  return (
                    <>
                    <h1 className='text-center' style={{fontSize: '60px'}}>
                      {datapgm?.lbel}
                    </h1>
                    <div className='' style={{display: 'flex', justifyContent: 'center'}}>
                      <TablaResumen data={items2024}/>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    </>
                  )
                })
              }
              <h1 className='text-center'>CHANGE 45 + FISIO MUSCLE + FS 45</h1>
              <TablaResumen data={data.filter(d=>d.anio==='2024')}/>
            </TabPanel>
            <TabPanel header={<div style={{fontSize: '60px'}}>2025</div>}>
              {
              dataProgramas.map(datapgm=>{
                  const items2024=datapgm?.items.filter(aio=>aio.anio==='2025')
                  return (
                    <>
                      <h1 className='text-center' style={{fontSize: '60px'}}>
                      {datapgm?.lbel}
                    </h1>
                    <div className='' style={{display: 'flex', justifyContent: 'center'}}>
                      <TablaResumen data={items2024}/>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    </>
                  )
                })
              }
              <h1 className='text-center'>CHANGE 45 + FISIO MUSCLE + FS 45</h1>
              <TablaResumen data={data.filter(d=>d.anio==='2025')}/>
            </TabPanel>
          </TabView>
        </div> */}

        {
          dataDetalleSeccion.map((section, index)=>{
            return (
              <div ref={sectionRefs[index].ref}>
                {section.HTML}
              </div>
            )
          })
        }
      {/* <div>
        <h1>DETALLE EN ASESOR</h1>
        <div className='mt-3'>
          <TabView>
            <TabPanel header={<div style={{fontSize: '60px'}}>2024</div>}>
              {
              programas2024.map(datapgm=>{
                  return (
                    <>
                    <h1 className='text-center'>
                      <img src={`${config.API_IMG.LOGO}${datapgm.items[0]?.items[0]?.tb_image?.name_image}`} height={datapgm.items[0].items[0]?.tb_image?.height} width={datapgm.items[0].items[0]?.tb_image?.width}/>
                    </h1>
                    
                    <TablaResumen2 data={datapgm.items}/>
                    </>
                  )
                })
              }
              
                <h1 className='text-center'>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={300}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={200}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={200}/>
                    </span>
                  </div>
                </h1>
            </TabPanel>
            <TabPanel header={<div style={{fontSize: '60px'}}>2025</div>}>
                {programas2025.map(pgm => (
                  <div key={pgm.id}>
                    <h1 className='text-center'>
                      <img src={`${config.API_IMG.LOGO}${pgm.items[0].items[0].tb_image.name_image}`} height={pgm.items[0].items[0].tb_image.height} width={pgm.items[0].items[0].tb_image.width}/>
                    </h1>
                    {pgm.items[0].items[0]?.tb_image?.height}asdf
                    {pgm.items[0].items[0]?.tb_image?.width}
                    <TablaResumen2 data={pgm.items} />
                  </div>
                  ))}
                <h1 className='text-center mt-5'>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                </h1>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <div>
        <h1>DETALLE POR MES</h1>
        <TabView>
          <TabPanel header={<>CHANGE 45</>}>
                <TablaResumen3 imgs={
                  <>
                  
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                  </div>
                  </>
                } data={[dataProgramasx[0]]}/>
          </TabPanel>
          <TabPanel header={<>FISIO MUSCLE</>}>
                <TablaResumen3 imgs={<>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                  </div>
                  </>} data={[dataProgramasx[1]]}/>
          </TabPanel>
          <TabPanel header={<>FS 45</>}>
                <TablaResumen3 imgs={
                  <>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                  </>
                } data={[dataProgramasx[2]]}/>
          </TabPanel>
          <TabPanel header={<>TOTAL</>}>
                <TablaResumen3 imgs={<>
                  
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png' width={350} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png' width={300} height={100}/>
                    </span>
                    <span className='mx-4 fs-2'>
                      +
                    </span>
                    <span className=''>
                      <img src='https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png' width={180} height={100}/>
                    </span>
                  </div>
                  </>} data={[dataTotalPgmX]}/>
          </TabPanel>
        </TabView>
      </div> */}
    </Row>  
    </>
  )
}


const TablaResumen2 = ({data}) => {
const ordenarAsesores = (lista) =>
  [...lista].sort((a, b) => {
    if (a.nombre?.toLowerCase() === 'alvaro') return -1;
    if (b.nombre?.toLowerCase() === 'alvaro') return 1;
    return 0;
  });
  const thEstilo = {
  // border: '3px solid #dc3545',
  // width: '2000px',
  padding: '10px'
  };
const tdEstilo = {
  border: '3px solid #dc3545',
  padding: '10px',
  fontSize: '27px'
};
const stickyFirstColStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 2,
  background: 'white', // importante para que no se vea transparente
};
  const tipos = ['total', 'nuevos', 'renovaciones', 'reinscripciones'];
  const tipoLabels = {
    total: 'SOCIOS VENTAS',
    nuevos: 'SOCIOS NUEVOS',
    renovaciones: 'RENOVACIONES',
    reinscripciones: 'REINSCRIPCIONES',
  };
  const widthTable=150
  const cuotasMetas = [
    {
      mes: 'JULIO',
      meta: 60000,
    },
  ]
  return (
    <div style={{ overflowX: 'auto' }}>
      <table 
      style={{
        width: '100%',
        minWidth: '1400px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        color: 'black'
      }}>
        <thead 
                  className='bg-primary rounded-0'

        >
          {/* Fila Mes */}
          <tr>
            <th className='rounded-0' style={{...stickyFirstColStyle, ...thEstilo, backgroundColor: '#D41115'}} rowSpan={4}></th>
            {data.map((mes, i) => (
              <th
                key={i}
                  className='bg-primary rounded-0 text-black'
                colSpan={ordenarAsesores(mes.itemVendedores).length * 4}
                style={{
                  ...thEstilo,
                  color: 'white',
                  fontSize: '44px',
                  borderLeft: '14px solid #000000ff'
                }}
              >
                <div className='d-flex flex-column align-items-center'>
                  {mes.mes.toUpperCase()}
                  <br/>
                  <div >
                        {
                          !cuotasMetas.find(e=>e?.mes===mes.mes.toUpperCase())?(''):(
                            <div className='text-left d-flex flex-column'>
                              <span className='fs-2'>
                              CUOTA: <NumberFormatMoney amount={cuotasMetas.find(e=>e?.mes===mes.mes.toUpperCase())?.meta}/> (100%)
                              </span>
                              <span className='fs-2'>
                                AVANCE: <NumberFormatMoney amount={ordenarAsesores(mes.itemVendedores).reduce((total, item)=>total + item.datos.total.tarifa, 0)}/> (<NumberFormatter amount={((ordenarAsesores(mes.itemVendedores).reduce((total, item)=>total + item.datos.total.tarifa, 0) )/(cuotasMetas.find(e=>e?.mes===mes.mes.toUpperCase())?.meta))*100}/>%)
                              </span>
                            </div>
                          )
                        }
                  </div>
                </div>
              </th>
            ))}
          </tr>

          {/* Fila Asesores */}
          <tr>
            {data.map((mes, mi) => {
              return (
                <>
                {
                  ordenarAsesores(mes.itemVendedores)?.map((asesor, ai, arr) => (
                    <th
                      className='bg-primary rounded-0 text-white'
                      key={`${mi}-${ai}`}
                      colSpan={4}
                      style={{
                        ...thEstilo,
                        color: 'white',
                        fontSize: '20px',
                        borderLeft: ai === 0 ? '14px solid #000000ff' : '',
                      }}
                    >
                      <div className='d-flex flex-column fs-2'>
                        <span>
                        {asesor.nombre.toUpperCase()}
                        </span>
                        <span className='fs-2 ml-5'>
                          <NumberFormatMoney amount={(asesor.datos.total.tarifa)}/> ({(((asesor.datos.total.tarifa)/(arr.reduce((total, item)=>total + item.datos.total.tarifa, 0)))*100).toFixed(2)}%)
                        </span>
                      </div>
                    </th>
                  ))
                }
                </>
              )
            }
            )}
          </tr>

          {/* Fila etiquetas: SOCIOS / VENTAS / TICK. MED. */}
          <tr>
            {data.map((mes) =>
              ordenarAsesores(mes.itemVendedores)?.map((asesor, ai) =>
                ['SOCIOS', 'VENTAS', 'VENTAS TURNO', 'TICK. MED.'].map((label, idx) => (
                  <th
                    key={`${ai}-${idx}`}
                    className='bg-primary  rounded-0'
                    style={{
                      ...thEstilo,
                      color: 'white',
                      fontSize: '23px',
                      borderLeft: `${ai==0 && idx==0?'14px solid #000000ff':''}`
                    }}
                  >
                    <div>
                      {label}
                    </div>
                  </th>
                ))
              )
            )}
          </tr>
        </thead>
        <tbody>
          {tipos.map((tipo) => (
            <tr key={tipo}>
              <td style={{ ...tdEstilo, ...stickyFirstColStyle,  fontWeight: 'bold', textAlign: 'left', paddingLeft: '10px' }}>
                {tipoLabels[tipo]}
              </td>
              {data.map((mes) => {
                  const puestos = ordenarAsesores(mes.itemVendedores)?.map((asesor) => {
                  const p = asesor?.datos?.[tipo] || {};
                  return {
                    sociosPuesto: p?.puesto.socios ?? 0,
                    tarifaPuesto: p?.puesto.tarifa ?? 0,
                    ticketPuesto: p?.puesto.ticket_medio ?? 0,
                  };
                });
                const contar = (arr, key) =>
                  arr.reduce((acc, item) => {
                    const val = item[key];
                    acc[val] = (acc[val] || 0) + 1;
                    return acc;
                  }, {});

                const countSocios = contar(puestos, 'sociosPuesto');
                const countTarifa = contar(puestos, 'tarifaPuesto');
                const countTicket = contar(puestos, 'ticketPuesto');
                return (
                  <>
                  {
                    ordenarAsesores(mes.itemVendedores)?.map((asesor, ai) => {
                      
                      const entry = asesor?.datos[tipo] || {};
                      const socios = entry?.socios ?? 0;
                      const tarifa = entry?.tarifa ?? 0;
                      const ticket = entry?.ticket_medio ?? 0;  
                      const pmPuestos = entry.puesto.PM??'';
                      const amPuestos = entry.puesto.AM??'';
                      const pm = entry?.PM
                      const am = entry?.AM

                      let sociosPuesto = entry?.puesto.socios ?? '';
                      let tarifaPuesto = entry?.puesto.tarifa ?? '';
                      let ticketPuesto = entry?.puesto.ticket_medio ?? '';
                      if ((sociosPuesto === 0 || sociosPuesto === 1) && countSocios[sociosPuesto] > 1) sociosPuesto = 'i';
                      if ((tarifaPuesto === 0 || tarifaPuesto === 1) && countTarifa[tarifaPuesto] > 1) tarifaPuesto = 'i';
                      if ((ticketPuesto === 0 || ticketPuesto === 1) && countTicket[ticketPuesto] > 1) ticketPuesto = 'i';
                      return (
                        <>
                          <td
                            key={`${tipo}-${ai}-socios`}
                            style={{
                              ...tdEstilo,
                              borderLeft: `${ai==0?'14px solid #000000ff':'8px solid #dc3545'}`
                            }}
                          >
                            <div style={{width: `${widthTable-50}px`, fontWeight: `${socios==0?'':'bolder'}`}} className={`text-right pr-5 ${sociosPuesto==='i' ? '' : sociosPuesto==='p' ? '' : 'text-change'}`}>
                            {socios}
                            </div>
                          </td>
                          <td key={`${tipo}-${ai}-ventas`} style={tdEstilo}>
                            <div style={{width: `${widthTable}px`, fontWeight: `${tarifa==0.00?'':'bolder'}`}} className={`text-end ${tarifaPuesto==='i' ? '' : tarifaPuesto==='p' ? '' : 'text-change'}`}>
                              <NumberFormatMoney amount={tarifa}/>
                            </div>
                          </td>
                          <td
                            key={`${tipo}-${ai}-ticket`}
                            style={{
                              ...tdEstilo,
                              // borderRight: ai === ordenarAsesores(mes.itemVendedores).length - 1 ? '14px solid #000000ff' : '2px solid #dc3545'
                            }}
                          >
                            <div style={{width: `${widthTable}px`, fontWeight: `${ticket==0.00?'':'bolder'}`}} className={`text-end `}>
                              {/* <NumberFormatMoney amount={ticket}/> */}
                              <span className={`${amPuestos==='i' ? 'text-black' : amPuestos==='p' ? '' : 'text-change'}`}>
                                <div className={`text-center `}>AM</div> 
                                <NumberFormatMoney amount={am?am:0}/> 
                              </span>
                              <span className={`${pmPuestos==='i' ? 'text-black' : pmPuestos==='p' ? '' : 'text-change'}`}>
                              <div  className={`text-center`}>PM</div>
                              <NumberFormatMoney amount={pm?pm:0}/>
                              </span>
                            </div>
                          </td>
                          <td
                            key={`${tipo}-${ai}-ticket`}
                            style={{
                              ...tdEstilo,
                              // borderRight: ai === ordenarAsesores(mes.itemVendedores).length - 1 ? '14px solid #000000ff' : '2px solid #dc3545'
                            }}
                          >
                            <div style={{width: `${widthTable}px`, fontWeight: `${ticket==0.00?'':'bolder'}`}} className={`text-end ${ticketPuesto==='i' ? 'text-black' : ticketPuesto==='p' ? '' : 'text-change'}`}>
                              <NumberFormatMoney amount={ticket}/>
                            </div>
                          </td>
                        </>
                      );
                    })
                  }
                  </>
                )
              }
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const TablaResumen3 = ({data, imgs}) => {

    const thEstilo = {
    border: '2px solid red',
    padding: '10px',
    fontWeight: 'bold',
  };

  const tdEstilo = {
    border: '2px solid red',
    padding: '10px',
    fontSize: '16px',
  };

  // const meses = ['SEPTIEMBRE 2024', 'OCTUBRE 2024', 'NOVIEMBRE 2024', 'DICIEMBRE 2024'];
  const bordesPorPgm = '10px solid black';
  const bordesB = '5px solid black';
  const grupos = data;
  const tipos = ['total', 'nuevos', 'renovaciones', 'reinscripciones'];
  const subtipos = ['socios', 'tarifa', 'ticket_medio'];
  
  // Obtener todos los meses únicos del primer grupo (asume estructura uniforme)
  const meses = Array.from(
  new Map(
    grupos
      .flatMap((grupo) => grupo?.items)
      .map((d) => [`${d?.anio}-${d?.mes.toUpperCase()}`, { anio: d?.anio, mes: d?.mes.toUpperCase() }])
  ).values()
).sort((a, b) => {
  const mesA = a.mes === 'TOTAL' ? 13 : new Date(`${a.mes} 1, ${a.anio}`).getMonth();
  const mesB = b.mes === 'TOTAL' ? 13 : new Date(`${b.mes} 1, ${b.anio}`).getMonth();
  return a.anio - b.anio || mesA - mesB;
});
  

  return (
    <div className='text-black' style={{ maxHeight: '800px', overflowY: 'auto' }}>
      <table
        style={{
          width: '100%',
          minWidth: '1200px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          borderCollapse: 'collapse', // 🔑 importante
          border: bordesB,
        }}
      >
        <thead 
          style={{ 
            position: 'sticky', 
            top: '3px', 
            backgroundColor: 'white', 
            borderBottom: '10px solid red',
            zIndex: 1 
            }}>
          <tr>
            {grupos.map((grupo, i) => (
              <th
                key={i}
                colSpan={13}
                className=' fs-1 p-0 borde-grueso'
                style={{
                  ...thEstilo,
                  fontSize: '18px',
                  // borderRight: bordesPorPgm,
                  // borderLeft: bordesPorPgm,
                  // borderTop: bordesB,
                  // borderBottom: bordesB,
                }}
              >
                {imgs}
              </th>
            ))}
          </tr>
          <tr >
            <th className='bg-primary rounded-0' rowSpan={1} >
              <div className='fs-3'>
                <span>
                  MES
                </span>
              </div>
            </th>
            {grupos.map((_, i) =>
              tipos.map((label, j) => (
                <th
                  key={`${i}-${j}`}
                  className='bg-primary text-white'
                  colSpan={3}
                  style={{
                    ...thEstilo,
                    borderBottom: bordesB,
                    borderTop: bordesB,
                    borderRight: `${j === 3 ? bordesPorPgm : bordesB}`,
                    borderLeft: `${j === 0 ? bordesPorPgm : bordesB}`,
                  }}
                >
                  <div className='fs-2'>
                    {label.toUpperCase()}
                  </div>
                </th>
              ))
            )}
          </tr>
          <tr>
            <th className='bg-primary rounded-0' rowSpan={1}>
              <div className='fs-3'>
                <span>
                  AÑO
                </span>
              </div>
            </th>
            {grupos.map(() =>
              tipos.flatMap((_, i1) =>
                subtipos.map((label, i) => (
                  <th
                    key={label + i}
                    className='bg-primary text-white'
                    style={{
                      ...thEstilo,
                      borderRight: i === 2 ? (i1 === 3 ? bordesPorPgm : '') : '',
                      borderLeft: i === 0 ? (i1 === 0 ? bordesPorPgm : bordesB) : '',
                    }}
                  >
                    <div className='fs-4' style={{ width: '100%' }}>
                      {label.toUpperCase().replace('_', ' ')=='TARIFA'?'VENTAS':label.toUpperCase().replace('_', ' ')}
                    </div>
                  </th>
                ))
              )
            )}
          </tr>
        </thead>
        <tbody>
          {meses.map((mes, mi) => (
            <tr key={mi}>
              <td
                className=''
                style={{
                  ...tdEstilo,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '10px',
                  borderRight: `${bordesPorPgm}`,
                  borderBottom: `${mes.mes==='TOTAL'?'8px solid black':''}`
                }}
              >
                <div className={`text-center ${mes?.mes=='TOTAL'?'fs-1':'fs-3'}`} style={{ width: '150px', }}>
                  {mes.mes}
                  <br/>
                  {mes.anio}
                </div>
              </td>
              {grupos.map((grupo, gi) => {
                const objMes = grupo?.items.find((d) => d.fecha.toUpperCase() === `${mes.mes} ${mes.anio}`);
                const dato = objMes?.datos || {};
                
                
                return tipos.flatMap((tipo, im) => {
                  const datos = dato[tipo] || {};
                  
                  return [
                    <td 
                      key={`${gi}-${tipo}-socios-${mi}`} 
                      className={`${im!==0?'bg-gray':''}`}
                      style={{...tdEstilo, borderBottom: `${mes.mes==='TOTAL'?'8px solid black':''}`}}>
                      <div className={`text-end w-75 ${datos.socios==0?'':'fw-bold'} ${mes?.mes=='TOTAL'?'fs-1':''}`} style={{ fontSize: '24px' }}>
                        <NumberFormatter amount={datos.socios} />
                      </div>
                    </td>,
                    <td 
                      key={`${gi}-${tipo}-tarifa-${mi}`} 
                      className={`${im!==0?'bg-gray':''}`}
                      style={{...tdEstilo, borderBottom: `${mes.mes==='TOTAL'?'8px solid black':''}`}}>
                      <div className={`text-end w-100 ${datos.tarifa==0.0?'':'fw-bold'} ${mes?.mes=='TOTAL'?'fs-1':''}`} style={{ fontSize: '24px' }}>
                        <NumberFormatter amount={datos.tarifa} />
                      </div>
                    </td>,
                    <td
                      key={`${gi}-${tipo}-ticket-${mi}`}
                      className={`${im!==0?'bg-gray':''}`}
                      style={{
                        ...tdEstilo,
                        borderRight: `${im === 3 ? bordesPorPgm : bordesB}`,
                        borderBottom: `${mes.mes==='TOTAL'?'8px solid black':''}`
                      }}
                    >
                      <div className={`text-end w-100 ${datos.ticket_medio==0.0?'':'fw-bold'} ${mes?.mes=='TOTAL'?'fs-1':''}`} style={{ fontSize: '24px' }}>
                        <NumberFormatMoney amount={datos.ticket_medio} />
                      </div>
                    </td>
                  ];
                });
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



