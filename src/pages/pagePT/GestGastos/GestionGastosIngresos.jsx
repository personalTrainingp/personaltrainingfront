import React, { useEffect, useState } from 'react'
import { ModalIngresosGastos } from './ModalIngresosGastos'
import { Button } from 'react-bootstrap'
import { Table } from '@/components'
import { columns, sizePerPageList } from './ColumnsSet'
import { useSelector } from 'react-redux'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'

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
        <ModalIngresosGastos show={isOpenModalIvsG} onHide={onCloseModalIvsG}/>
        <Table
          columns={columns}
          data={dataGastos}
          pageSize={10}
          sizePerPageList={sizePerPageList}
          isSortable={true}
          pagination={true}
          isSearchable={true}
          tableClass="table-striped"
          searchBoxClass="mt-2 mb-3"
        />
    </>
  )
}
