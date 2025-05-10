import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import TableInventario from './TableInventario'
import { Toast } from 'primereact/toast'

export const DataInventario = ({id_enterprice, btnAdd, btnEdit, btnDelete, id_empresa_zona}) => {
    const [isOpenModalIvsG, setIsOpenModalIvsG] = useState(false)
    const toast = useRef(null);
    const { dataGastos } = useSelector(e=>e.finanzas)
    const showToast = (dataToast) => {
      toast.current.show(dataToast);
    };
  return (
    <>
        <Toast ref={toast}/>
        <TableInventario btnAdd={btnAdd} btnDelete={btnDelete} id_empresa_zona={id_empresa_zona} btnEdit={btnEdit} showToast={showToast} id_enterprice={id_enterprice}/>
    </>
  )
}
