
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataView } from './DataView'
import { onSetViewSubTitle } from '@/store'
export const InventarioTotalizado = ({id_empresa, label_empresa}) => {
    const {  obtenerInventarioKardexxFechas, dataFechas } = useInventarioStore()
    useEffect(() => {
        obtenerInventarioKardexxFechas(id_empresa)
    }, [id_empresa])
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(onSetViewSubTitle(`INVENTARIO VALORIZADO POR ZONA - ${label_empresa}`))
    }, [id_empresa])
  return (
    <>
    {id_empresa}
      <DataView dvi={dataFechas} isResumenxZonaLoc id_empresa={id_empresa} label_empresa={label_empresa}/>
    </>
  )
}
