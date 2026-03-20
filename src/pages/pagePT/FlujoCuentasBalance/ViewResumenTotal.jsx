import { useEffect } from "react"
import { useFlujoCaja } from "./hook/useFlujoCajaStore"

export const ViewResumenTotal = ({fechas, id_enterprice, bgTotal, bgPastel, anio, onOpenModalTableItems}) => {
  const { dataCuentasBalancexFecha: dataCuentasPorPagar, obtenerCuentasBalancexFecha:ObtenerdataCuentasPorPagar } = useFlujoCaja()
  useEffect(() => {
    ObtenerdataCuentasPorPagar(id_enterprice, fechas, 'PorPagar')
  }, [id_enterprice, fechas])
  
  console.log({dataCuentasPorPagar});

  return (
    <>
    </>
  )
  
}
