import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { ModalTableInventario } from './ModalTableInventario'
import sinImage from '@/assets/images/SinImage.jpg'
import { Image } from 'primereact/image'
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { TabPanel, TabView } from 'primereact/tabview'
import { DataView } from './DataView'
import { FechaRange } from '@/components/RangeCalendars/FechaRange'
import dayjs from 'dayjs'
import { onSetViewSubTitle } from '@/store'
import { inventarioReporteStore } from './inventarioReporteStore'

export const InventarioTotalizado = ({id_empresa, label_empresa}) => {
    const { obtenerArticulos, isLoading, obtenerInventarioKardexxFechas, dataFechas } = useInventarioStore()
    const [dataFilter, setdataFilter] = useState([])
    const [ubicacion, setubicacion] = useState('')
    const [isOpenModalInventarioFiltered, setisOpenModalInventarioFiltered] = useState(false)
    
    useEffect(() => {
        // obtenerArticulos(598)
        // obtenerProveedoresUnicos()
        obtenerInventarioKardexxFechas(id_empresa)
    }, [])
    const onOpenModalInventario = (items, ubicacion)=>{
        setisOpenModalInventarioFiltered(true)
        setdataFilter(items)
        setubicacion(ubicacion)
    }
    const onCloseModalInventario = ()=>{
        setisOpenModalInventarioFiltered(false)
    }
    const { obtenerContratosPendientes } = inventarioReporteStore()
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(onSetViewSubTitle(`INVENTARIO VALORIZADO POR ZONA - ${label_empresa}`))
      obtenerContratosPendientes(id_empresa)
    }, [id_empresa])
    const { dataContratoProv } = useSelector(e=>e.prov)
  return (
    <>
    <TabView>
    {
              dataFechas?.map(m=>{
                return (
                  <TabPanel header={<></>}>
                      <DataView dvi={m.articulos_directos} dataContratoProv={dataContratoProv} kardexEntrada={m.totalKardexEntrada} kardexSalida={m.totalKardexSalida} isResumenxZonaLoc id_empresa={id_empresa} label_empresa={label_empresa}/>
                  </TabPanel>
                )
              })
            }
    </TabView>
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