import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import TableInventario from './TableInventario'
import { Toast } from 'primereact/toast'

export const DataInventario = ({id_enterprice, id_zona, ImgproyCircus3, ImgproyCircus2, ImgproyCircus1}) => {
    const toast = useRef(null);
    const showToast = (dataToast) => {
      toast.current.show(dataToast);
    };
  return (
    <>
        <Toast ref={toast}/>
        <TableInventario ImgproyCircus3={ImgproyCircus3} ImgproyCircus2={ImgproyCircus2} ImgproyCircus1={ImgproyCircus1} showToast={showToast} id_enterprice={id_enterprice} id_zona={id_zona}/>
    </>
  )
}
