import React, { useEffect, useRef, useState } from 'react'
import { ModalIngresosGastos } from './ModalIngresosGastos'
import { Button } from 'react-bootstrap'
import { PageBreadcrumb, Table } from '@/components'
import { columns, sizePerPageList } from './ColumnsSet'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import AdvancedFilterDemo from './Tratch'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

export const GestionGastosIngresos = () => {
    const [isOpenModalIvsG, setIsOpenModalIvsG] = useState(false)
    const toast = useRef(null);
    const { obtenerGastos, isLoadingData } = useGf_GvStore()
    const { dataGastos } = useSelector(e=>e.finanzas)
    useEffect(() => {
      obtenerGastos()
    }, [])
    const showToast = (dataToast) => {
      toast.current.show(dataToast);
    };
  return (
    <>
        {/* <Button onClick={onOpenModalIvsG}>Agregar egresos</Button> */}
        <Toast ref={toast}/>
        {/* <ModalIngresosGastos show={isOpenModalIvsG} onHide={onCloseModalIvsG} onShow={onOpenModalIvsG} showToast={showToast}/> */}
        <AdvancedFilterDemo showToast={showToast}/>
        <ConfirmDialog/>
    </>
  )
}
