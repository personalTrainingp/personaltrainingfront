import React, { useEffect, useRef, useState } from 'react'
import { ModalIngresosGastos } from './ModalIngresosGastos'
import { Button } from 'react-bootstrap'
import { Table } from '@/components'
import { columns, sizePerPageList } from './ColumnsSet'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import AdvancedFilterDemo from './Tratch'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

export const GestionGastosIngresos = () => {
    const [isOpenModalIvsG, setIsOpenModalIvsG] = useState(false)
    const toast = useRef(null);
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
    const showToast = (severity, summary, detail, label) => {
      toast.current.show({ severity, summary, detail, label });
  };
  return (
    <>
        <Button onClick={onOpenModalIvsG}>Agregar egresos</Button>
        <Toast ref={toast}/>
        <ModalIngresosGastos show={isOpenModalIvsG} onHide={onCloseModalIvsG} onShow={onOpenModalIvsG} showToast={showToast}/>
        <AdvancedFilterDemo showToast={showToast}/>
        <ConfirmDialog/>
    </>
  )
}
