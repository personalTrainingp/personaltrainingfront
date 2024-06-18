import React, { useEffect, useState } from 'react'
import { ModalIngresosGastos } from './ModalIngresosGastos'
import { Button } from 'react-bootstrap'
import { Table } from '@/components'
import { columns, sizePerPageList } from './ColumnsSet'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import AdvancedFilterDemo from './Tratch'

export const GestionGastosIngresos = () => {
    const [isOpenModalIvsG, setIsOpenModalIvsG] = useState(false)
    const onCloseModalIvsG = ()=>{
        setIsOpenModalIvsG(false)
    }
    const onOpenModalIvsG = ()=>{
        setIsOpenModalIvsG(true)
    }
    const { obtenerGastos } = useGf_GvStore()
    const { dataGastos } = useSelector(e=>e.finanzas)
    useEffect(() => {
      obtenerGastos()
    }, [])
  return (
    <>
        <Button onClick={onOpenModalIvsG}>Agregar Gasto o Ingreso</Button>
        <ModalIngresosGastos show={isOpenModalIvsG} onHide={onCloseModalIvsG} onShow={onOpenModalIvsG}/>
        <AdvancedFilterDemo/>
    </>
  )
}
