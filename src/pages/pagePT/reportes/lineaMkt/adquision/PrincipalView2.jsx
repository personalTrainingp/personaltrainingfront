import { PageBreadcrumb } from '@/components'
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { ItemTable } from './ItemTable'
import { useAdquisicionStore } from './useAdquisicionStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DataDroppable } from './DataDroppable'
import { TabPanel, TabView } from 'primereact/tabview'
import { TableDataComparativaVendedores } from './TableDataComparativaVendedores'
const sumarTarifaMonto = (items)=>{
      const ventas = items.reduce((accum, item) => accum + (item.detalle_ventaMembresium?.tarifa_monto || 0), 0)
    return ventas
}
const propsResumen = (items)=>{
  const numero_cierre = items.length
  const ventas = sumarTarifaMonto(items)
  const ticket_medio = ventas / numero_cierre || 0
  return {
    numero_cierre,
    ventas, ticket_medio
  }
}
export const PrincipalView = () => {
  const { obtenerTodoVentas, data, dataVendedores, dataProgramas, dataUnif } = useAdquisicionStore()
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
  
    function agruparPorCliente(data) {
        // Agrupar por id_cli
        const agrupado = Object.values(
            data.reduce((acc, item) => {
            const id_cli = item.tb_ventum.id_cli;
            if (!acc[id_cli]) {
                acc[id_cli] = { id_cli, items: [] };
            }
            acc[id_cli].items.push(item);
            return acc;
            }, {})
        );

        // Filtrar clientes que tienen al menos un id_tipoFactura = 701
        const clientesFiltrados = agrupado
            .filter(cliente => cliente.items.some(item => item.tb_ventum.id_tipoFactura === 701))
            .map(cliente => ({
            id_cli: cliente.id_cli,
            items: cliente.items.filter(item => item.tb_ventum.id_tipoFactura !== 701) // Remover los "traspaso"
            }))
            .filter(cliente => cliente.items.length > 0); // Eliminar clientes sin items

        // Obtener todos los items acumulados
        const ventas = clientesFiltrados.flatMap(cliente => cliente.items);

        return {
            clientes: clientesFiltrados,
            ventas // Acumulado de todos los items
        };
      }
      console.log({dataProgramas, data: dataProgramas.flatMap(pgm => pgm.items).filter(item => item.anio === '2024')});
      
  return (
    <>
    <PageBreadcrumb title={'comparativo ventas por categoria total por dia vs mes'}/>
    {/* {JSON.stringify(data)} */}
    <Row>
      <div className='position-fixed bg-white'>
        <div className='d-flex align-items-center'>
              <h1>DESDE</h1>
              <div>
              <Select
                onChange={handleChangedesde}
                name="desdeOption"
                placeholder={''}
                className="react-select mx-3 fs-3 w-75 fw-bold"
                classNamePrefix="react-select"
                options={dias}
                value={desdeOption||0}
                defaultValue={1}
                required
              />
              </div>
              <h1>HASTA</h1>
              <div>
              <Select
                onChange={handleChangehasta}
                name="hastaOption"
                placeholder={''}
                className="react-select mx-3 fs-3 w-75 fw-bold"
                classNamePrefix="react-select"
                options={dias}
                value={hastaOption||0}
                defaultValue={30}
                required
              />
              </div>
              <div>
                <Button
                  label={isLoading ? 'Cargando...' : 'Buscar'}
                  icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
                  className="p-button-primary"
                  onClick={() =>onClickFilter()}
                />
              </div>
        </div>
      </div>
      <div className='mt-3'>
            <DataDroppable dataMeses={data} desdeOption={desdeOption} hastaOption={hastaOption}/>
      {
        dataProgramas.map(g=>{
          return (
            <>
            <h1 className='text-center' style={{fontSize: '90px'}}>{g.name_pgm}</h1>
            <DataDroppable dataMeses={g.items} desdeOption={desdeOption} hastaOption={hastaOption}/>
            </>
          )
        })
      }
      {/* 
            // <DataDroppable dataMeses={g.items} desdeOption={desdeOption} hastaOption={hastaOption}/>
      */}
      </div>
      <div>
        <h1>DETALLE EN PROGRAMA</h1>
        <div className='mt-3'>
          <TabView>
            <TabPanel header={<div style={{fontSize: '60px'}}>2024</div>}>
              {
              dataProgramas.map(datapgm=>{
                  const items2024=datapgm?.items.filter(aio=>aio.anio==='2024')
                  console.log({items2024});
                  
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
        </div>
      </div>
      <div>
        <h1>DETALLE EN ASESOR</h1>
        <div className='mt-3'>
          <TabView>
            <TabPanel header={<div style={{fontSize: '60px'}}>2024</div>}>
              {
              dataProgramas.map(datapgm=>{
                  const items2024=datapgm?.items.filter(aio=>aio.anio==='2024')
                  console.log({items2024});
                  
                  return (
                    <>
                    <h1 className='text-center'>
                      {datapgm?.lbel}
                    </h1>
                    <TablaResumen2 data={items2024}/>
                    </>
                  )
                })
              }
              <h1 className='text-center'>CHANGE 45 + FISIO MUSCLE + FS 45</h1>
              <TablaResumen2 data={dataUnif.filter(item => item.anio === '2024')}/>
            </TabPanel>
            <TabPanel header={<div style={{fontSize: '60px'}}>2025</div>}>
              {
              dataProgramas.map(datapgm=>{
                  const items2024=datapgm?.items.filter(aio=>aio.anio==='2025')
                  return (
                    <>
                    <h1 className='text-center'>
                      {datapgm?.lbel}
                    </h1>
                    <TablaResumen2 data={items2024}/>
                    </>
                  )
                })
              }
              <h1 className='text-center'>CHANGE 45 + FISIO MUSCLE + FS 45</h1>
              <TablaResumen2 data={dataUnif.filter(d=>d.anio==='2025')}/>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </Row>  
    </>
  )
}

const TablaResumen = ({data}) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <Table striped bordered className="border border-black" style={{width: '2200px'}}>
        <thead className={'bg-primary'}>
          <tr>
            <th className='fs-3 pl-5 text-center'></th>
            {data.map((d, i) => (
              <th className='fs-3 text-center text-white' key={i}>
                <div className='' style={{fontSize: '55px', width: '300px'}}>
                  {d.fecha.split(' ')[0].toUpperCase()}
                </div>
                </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='fs-3 fw-bold' >
              <div style={{fontSize: '35px'}}>
                SOCIOS VENTAS
              </div>
            </td>
            {data.map((d, i) => {
              const tarifa_monto = d.items.reduce(
                  (total, item) => total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
                  0
                );
              return (
                <>
                <td className='fs-2 text-center' key={i}>
                  <div className='d-flex mx-4'>
                    <div className='text-change fw-bold' dir="rtl">
                      {d.items.length}
                    </div>
                    <div className={`ms-auto ${tarifa_monto<=0?'':'text-black fw-bold'}`}>
                      <NumberFormatMoney amount={tarifa_monto}/>
                    </div>
                  </div>
                </td>
                </>
              )
            }
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
                SOCIOS NUEVOS
              </div>
            </td>
            {data.map((d, i) => {
              const NuevosCantidad = d.items.filter(i=>i.detalle_ventaMembresium.tb_ventum.id_origen !==691 && i.detalle_ventaMembresium.tb_ventum.id_origen !==692).length
              const ventasNuevos = d.items.filter(i=>i.detalle_ventaMembresium.tb_ventum.id_origen !==691 && i.detalle_ventaMembresium.tb_ventum.id_origen !==692).reduce(
                        (total, item) => total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
                        0
                      )
              return (
                <td className='fs-2' key={i}>
                  <div className='d-flex mx-4'>
                    <div className='text-change fw-bold'>
                      {NuevosCantidad}
                    </div>
                    <div className={`ms-auto ${ventasNuevos<=0?'':'text-black fw-bold'}`}>
                      <NumberFormatMoney
                      amount={ventasNuevos}
                      />
                    </div>
                  </div>
                </td>
              )
            }
            
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
                RENOVACIONES
                </div>
                </td>
            {data.map((d, i) => {
              const renovacionesCantidad = d.items.filter(i=>i.detalle_ventaMembresium.tb_ventum.id_origen === 691).length
              const Ventasrenovaciones = d.items.filter(i=>i.detalle_ventaMembresium.tb_ventum.id_origen === 691).reduce(
                        (total, item) => total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
                        0
                      )
              return (
                <td className='fs-2' key={i}>
                  <div className='d-flex mx-4'>
                    <div className='text-change fw-bold'>
                      {renovacionesCantidad}
                    </div>
                    <div className={`ms-auto ${Ventasrenovaciones<=0?'':'text-black fw-bold'}`}>
                      <NumberFormatMoney
                        amount={Ventasrenovaciones}
                      />
                    </div>
                  </div>
                  </td>
              )
            }
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
                REINSCRIPCIONES
              </div>
            </td>
            {data.map((d, i) => {
                const reiCantidad = d.items.filter(i=>i.detalle_ventaMembresium.tb_ventum.id_origen === 692).length
                const reiVentas = d.items.filter(i=>i.detalle_ventaMembresium.tb_ventum.id_origen === 692).reduce(
                      (total, item) => total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
                      0
                    )
              return (
              <td className='fs-2' key={i}>
                <div className='d-flex mx-4'>
                  <div className='text-change fw-bold'>
                    {reiCantidad}
                  </div>
                  <div className={`ms-auto ${reiVentas<=0?'':'text-black fw-bold'}`}>
                    <NumberFormatMoney amount={reiVentas}/>
                  </div>
                </div>
              </td>
              )
            } 
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
              TICKET MEDIO
              </div>
            </td>
            {data.map((d, i) => {
              const tarifa_monto = d.items.reduce(
                  (total, item) => total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
                  0
                );
                const ticket_medio = ((tarifa_monto/d.items.length) || 0)
              return (
                <td className='fs-2 text-center' key={i}>
                  <div className={`${ticket_medio<=0.0?'':'text-black fw-bold'}`}>
                    <NumberFormatMoney amount={ticket_medio}/>
                  </div>
                </td>
              )
            }
            )}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const TablaResumen2 = ({data}) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <Table striped bordered className="border-change" style={{width: '2500px'}}>
        <thead className={'bg-primary'} style={{width: '5000px'}}>
          <tr>
            <th className='fs-3 pl-5 text-center'></th>
            {data.map((d, i) => (
              <th className='fs-3 text-center text-white' key={i}>
                <div className='text-center' style={{fontSize: '55px', width: 'auto'}}>
                  {d.fecha.split(' ')[0].toUpperCase()}
                </div>
                <div className='d-flex justify-content-around' key={i} style={{fontSize: '38px', width: '2000px'}}>
                {
                  d.itemVendedores?.map((d, i)=>{
                    return (
                        <div className='fw-bold text-white'>
                          {d?.nombre}
                        </div>
                    )
                  })
                }
                </div>
                <div className='d-flex  justify-content-around' key={i} style={{fontSize: '35px', width: '2000px'}}>
                {
                  d.itemVendedores?.map((d, i)=>{
                    return (
                        <div className='d-flex mx-5' style={{fontSize: '35px', width: '100%'}}>
                          <div className='fw-bold ml-5'  style={{width: '23%'}}>
                            SOCIOS
                          </div>
                          <div className='fw-bold ms-auto' style={{width: '44%'}}>
                            VENTAS
                          </div>
                          <div className='fw-bold ms-auto' style={{width: '33%'}}>
                            TICKET MEDIO
                          </div>
                        </div>
                    )
                  })
                }
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='fs-3 fw-bold' >
              <div style={{fontSize: '35px'}}>
                SOCIOS VENTAS
              </div>
            </td>
            {data.map((d, i) => {
              
              return (
                <>
                <td className='fs-2 text-center' key={i}>
                  <div className='d-flex justify-content-around' key={i} style={{fontSize: '35px', width: '2000px'}}>
                    {
                  d.itemVendedores?.map((d, i)=>{
                    return (
                        <div className='d-flex mx-5' style={{fontSize: '35px', width: '100%'}}>
                          <div className={`fw-bold text-end ${d.puesto.socios==='p'?'':'text-change'}`}  style={{width: '23%'}}>
                            {d.socios}
                          </div>
                          <div className={`fw-bold ms-auto text-end ${d.puesto.tarifa==='p'?'':'text-change'} `}  style={{width: '44%'}}>
                              <NumberFormatMoney amount={d.tarifa}/>
                          </div>
                          <div className={`fw-bold text-end ${d.puesto.ticket_medio==='p'?'':'text-change'}`}  style={{width: '33%'}}>
                              <NumberFormatMoney amount={d.ticket_medio}/>
                          </div>
                        </div>
                    )
                  })
                }
                  </div>
                </td>
                </>
              )
            }
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
                SOCIOS NUEVOS
              </div>
            </td>
            {data.map((d, i) => {
              
              return (
                <>
                <td className='fs-2 text-center' key={i}>
                  <div className='d-flex justify-content-around' key={i} style={{fontSize: '35px', width: '2000px'}}>
                    {
                  d.itemVendedores?.map((d, i)=>{
                    return (
                        <div className='d-flex mx-5' style={{fontSize: '35px', width: '100%'}}>
                          <div className={`fw-bold text-end ${d.nuevos.puesto.socios==='p'?'':'text-change'}`}  style={{width: '23%'}}>
                            {d.nuevos.socios}
                          </div>
                          <div className={`fw-bold ms-auto text-end ${d.nuevos.puesto.tarifa==='p'?'':'text-change'}`}  style={{width: '44%'}}>
                              <NumberFormatMoney amount={d.nuevos.tarifa}/>
                          </div>
                          <div className={`fw-bold text-end ${d.nuevos.puesto.ticket_medio==='p'?'':'text-change'}`}  style={{width: '33%'}}>
                              <NumberFormatMoney amount={d.nuevos.ticket_medio}/>
                          </div>
                        </div>
                    )
                  })
                }
                  </div>
                </td>
                </>
              )
            }
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
                RENOVACIONES
                </div>
                </td>
                
            {data.map((d, i) => {
              
              return (
                <>
                <td className='fs-2 text-center' key={i}>
                  <div className='d-flex justify-content-around' key={i} style={{fontSize: '35px', width: '2000px'}}>

                    {
                  d.itemVendedores?.map((d, i)=>{
                    return (
                        <div className='d-flex mx-5' style={{fontSize: '35px', width: '100%'}}>
                          <div className={`fw-bold text-end ${d.renovaciones.puesto.socios==='p'?'':'text-change'}`}  style={{width: '23%'}}>
                            {d.renovaciones.socios}
                          </div>
                          <div className={`fw-bold ms-auto text-end ${d.renovaciones.puesto.tarifa==='p'?'':'text-change'}`}  style={{width: '44%'}}>
                              <NumberFormatMoney amount={d.renovaciones.tarifa}/>
                          </div>
                          <div className={`fw-bold ms-auto text-end ${d.renovaciones.puesto.ticket_medio==='p'?'':'text-change'}`}  style={{width: '33%'}}>
                              <NumberFormatMoney amount={d.renovaciones.ticket_medio}/>
                          </div>
                        </div>
                    )
                  })
                }
                  </div>
                </td>
                </>
              )
            }
            )}
          </tr>
          <tr>
            <td className='fs-3 fw-bold'>
              <div style={{fontSize: '35px'}}>
                REINSCRIPCIONES
              </div>
            </td>
            
            {data.map((d, i) => {
              
              return (
                <>
                <td className='fs-2 text-center' key={i}>
                  <div className='d-flex justify-content-around' key={i} style={{fontSize: '35px', width: '2000px'}}>

                    {
                  d.itemVendedores?.map((d, i)=>{
                    return (
                        <div className='d-flex mx-5' style={{fontSize: '35px', width: '100%'}}>
                          <div className={`fw-bold text-end ${d.reinscripciones.puesto.socios==='p'?'':'text-change'}`} style={{width: '23%'}}>
                            {d.reinscripciones.socios}
                          </div>
                          <div className={`fw-bold ms-auto text-end ${d.reinscripciones.puesto.tarifa==='p'?'':'text-change'}`} style={{width: '44%'}}>
                              <NumberFormatMoney amount={d.reinscripciones.tarifa}/>
                          </div>
                          <div className={`fw-bold ms-auto text-end ${d.reinscripciones.puesto.ticket_medio==='p'?'':'text-change'}`} style={{width: '33%'}}>
                              <NumberFormatMoney amount={d.reinscripciones.ticket_medio}/>
                          </div>
                        </div>
                    )
                  })
                }
                  </div>
                </td>
                </>
              )
            }
            )}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};



