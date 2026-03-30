import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import TableInventario from './TableInventario'
import { Toast } from 'primereact/toast'

export const DataInventario = ({id_enterprice, id_zona}) => {
    const toast = useRef(null);
    const showToast = (dataToast) => {
      toast.current.show(dataToast);
    };
  return (
    <>
        <Toast ref={toast}/>
        <TableInventario showToast={showToast} id_enterprice={id_enterprice} id_zona={id_zona}/>
    </>
  )
}
