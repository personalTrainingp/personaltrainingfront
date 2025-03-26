import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ModalTableInventario } from './ModalTableInventario'
import sinImage from '@/assets/images/SinImage.jpg'
import { Image } from 'primereact/image'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { TabPanel, TabView } from 'primereact/tabview'
import { DataView } from './DataView'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import dayjs from 'dayjs'

export const InventarioTotalizado = () => {
    const { obtenerArticulos, isLoading, obtenerInventarioKardexxFechas, dataFechas } = useInventarioStore()
    const {dataView, RANGE_DATE} = useSelector(e=>e.DATA)
    const [valueFilter, setvalueFilter] = useState([])
    const [dataFilter, setdataFilter] = useState([])
    const [ubicacion, setubicacion] = useState('')
    const [isOpenModalInventarioFiltered, setisOpenModalInventarioFiltered] = useState(false)
    
    useEffect(() => {
        obtenerArticulos(598)
        // obtenerProveedoresUnicos()
        obtenerInventarioKardexxFechas(598)
    }, [])
    const onOpenModalInventario = (items, ubicacion)=>{
        setisOpenModalInventarioFiltered(true)
        setdataFilter(items)
        setubicacion(ubicacion)
    }
    const onCloseModalInventario = ()=>{
        setisOpenModalInventarioFiltered(false)
    }

    // const groupedData = Object.values(dataView.reduce((acc, item) => {
    //     const label = item.parametro_nivel?.label_param;
      
    //     // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
    //     if (!acc[label]) {
    //       acc[label] = { nivel: label, valor_total_sumado: 0, items: [] };
    //     }
        
    //     // Sumamos el valor_total del item actual al grupo correspondiente
    //     acc[label].valor_total_sumado += item.valor_total;
        
    //     // Añadimos el item al array `items` del grupo correspondiente
    //     acc[label].items.push(item);
        
    //     return acc;
    //   }, {}));
      
    //   // Convertimos valor_total_sumado a cadena con dos decimales
    //   groupedData.forEach(group => {
    //     group.valor_total_sumado = group.valor_total_sumado.toFixed(2);
    //   });
    //   groupedData.sort((a, b) => a.nivel - b.nivel);
      
    console.log({dataFechas});
      
  return (
    <>
        <PageBreadcrumb title={'INVENTARIO VALORIZADO DE ACTIVOS POR ZONA'} subName={'T'}/>
        {/* <FechaRange rangoFechas={RANGE_DATE}/> */}
        <TabView></TabView>
          <h1 className='d-flex'><img width={300} src='https://change-the-slim-studio-sigma.vercel.app/assets/mem_logo-be75730a.png'/></h1>
          <TabView>
            {
              dataFechas?.map(m=>{
                return (
                  <TabPanel header={<h2 className='card p-4 mb-0'>{dayjs.utc(m.fechaHasta).format('dddd DD [DE] MMMM [del] YYYY')}</h2>}>
                      <DataView dvi={m.articulos_directos} kardexEntrada={m.kardexEntrada} kardexSalida={m.kardexSalida} isResumenxZonaLoc id_empresa={598} label_empresa={'CHANGE'}/>
                  </TabPanel>
                )
              })
            }
          </TabView>
        {/* <TabView> */}
            {/* <TabPanel header={<span className='fs-2'>CHANGE THE SLIM STUDIO</span>}>
            </TabPanel>
            <TabPanel header={<span className='fs-2'>CIRCUS SALON</span>}>
            <DataView isResumenxZonaLoc={true} id_empresa={599} label_empresa={'CIRCUS'}/>
            </TabPanel>
            <TabPanel header={<span className='fs-2'>MP</span>}>
            <DataView isResumenxZonaLoc={false} id_empresa={600} label_empresa={'MP'}/>
            </TabPanel> */}
        {/* </TabView> */}
    </>
  )
}

function agruparDataxLugar(dataV) {
    
    const groupedData = Object.values(dataV.reduce((acc, item) => {
        const label = item.parametro_lugar_encuentro?.label_param;
      
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { ubicacion: label, valor_total_sumado: 0, items: [] };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado += item.valor_total;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc;
      }, {}));
      
      // Convertimos valor_total_sumado a cadena con dos decimales
      groupedData.forEach(group => {
        group.valor_total_sumado = group.valor_total_sumado.toFixed(2);
      });
      return groupedData;
}