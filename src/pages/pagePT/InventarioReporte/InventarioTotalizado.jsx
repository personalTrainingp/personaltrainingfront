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
    }, [id_empresa])
    const { obtenerContratosPendientes } = inventarioReporteStore()
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(onSetViewSubTitle(`INVENTARIO VALORIZADO POR ZONA - ${label_empresa}`))
      obtenerContratosPendientes(id_empresa)
    }, [id_empresa])
    const { dataContratoProv } = useSelector(e=>e.prov)
  return (
    <>
                      <DataView dvi={dataFechas} dataContratoProv={dataContratoProv} isResumenxZonaLoc id_empresa={id_empresa} label_empresa={label_empresa}/>
    {/* <TabView>
                  <TabPanel header={<></>}>
                  </TabPanel>
    </TabView> */}
    </>
  )
}
