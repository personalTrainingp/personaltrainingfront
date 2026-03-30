import { useState } from "react"
import { DataTablePagosVentas } from "./DataTablePagosVentas"
import { ModalReportePagosVentas } from "./ModalReportePagosVentas"

export const AppReportePagosVentas = () => {
  const [isOpenModalPagosVentas, setisOpenModalPagosVentas] = useState({isOpen: false, id: 0})
  const onOpenModalPagosVentas = (id)=>{
    setisOpenModalPagosVentas({isOpen: true, id})
  }
  const onCloseModalPagosVentas = ()=>{
    setisOpenModalPagosVentas({isOpen: false, id: 0})
  }
  return (
    <div>
      <DataTablePagosVentas onOpenModalCustomPagos={onOpenModalPagosVentas}/>
      <ModalReportePagosVentas id={isOpenModalPagosVentas.id} onHide={onCloseModalPagosVentas} show={isOpenModalPagosVentas.isOpen}/>
    </div>
  )
}
