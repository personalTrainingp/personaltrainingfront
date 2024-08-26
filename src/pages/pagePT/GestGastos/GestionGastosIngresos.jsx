import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import AdvancedFilterDemo from './Tratch'
import { Toast } from 'primereact/toast'

export const GestionGastosIngresos = ({id_enterprice}) => {
    const [isOpenModalIvsG, setIsOpenModalIvsG] = useState(false)
    const toast = useRef(null);
    const { dataGastos } = useSelector(e=>e.finanzas)
    const showToast = (dataToast) => {
      toast.current.show(dataToast);
    };
  return (
    <>
        <Toast ref={toast}/>
        <AdvancedFilterDemo showToast={showToast} id_enterprice={id_enterprice}/>
    </>
  )
}
