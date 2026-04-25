import { useState } from "react"
import { DataTablePagosVentas } from "./DataTablePagosVentas"
import { ModalReportePagosVentas } from "./ModalReportePagosVentas"
import { InputButton } from "@/components/InputText"
import { TabPanel, TabView } from "primereact/tabview"
import { TabPane } from "react-bootstrap"
import { ReporteCuotas } from "./ReporteCuotas"

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
      <TabView>
        <TabPanel header='DATA'>
          <InputButton label={'AGREGAR PAGO'} onClick={()=>onOpenModalPagosVentas(0)}/>
          <DataTablePagosVentas onOpenModalCustomPagos={onOpenModalPagosVentas}/>
          <ModalReportePagosVentas id={isOpenModalPagosVentas.id} onHide={onCloseModalPagosVentas} show={isOpenModalPagosVentas.isOpen}/>
        </TabPanel>
        <TabPanel header={'REPORTE DE CUOTAS OPENPAY'}>
          <ReporteCuotas />
        </TabPanel>
      </TabView>
    </div>
  )
}
