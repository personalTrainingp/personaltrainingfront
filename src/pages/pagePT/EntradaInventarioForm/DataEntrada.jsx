import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { FormatTable } from '@/components/ComponentTable/FormatTable'
import { ModalEntradaInventario } from './ModalEntradaInventario'
import TableEntradaInventario from './TableEntradaInventario'
export const DataEntrada = ({id_enterprice, actionKardex}) => {
    const [isModalEntradaInventario, setisModalEntradaInventario] = useState(false)
      const onOpenModalEntradaInventario = () => {
        setisModalEntradaInventario(true)
      }
      const onCloseModalEntradaInventario = ()=>{
        setisModalEntradaInventario(false)
      }
      
  const dataForTable = [
    {header: '', isSortable: true, value: '', order: 3},
    {header: 'ITEM', isSortable: true, value: '', order: 3},
    {header: 'CANTIDAD', isSortable: true, value: '', order: 3},
    {header: 'FECHA DE ENTRADA', isSortable: true, value: '', order: 3},
    {header: 'MOTIVO', isSortable: true, value: '', order: 3},
    {header: 'OBSERVACION', isSortable: true, value: '', order: 3},
  ]
  return (
    <>
            <Button onClick={onOpenModalEntradaInventario}>AGREGAR ENTRADA</Button>
            <TableEntradaInventario id_enterprice={id_enterprice} action={actionKardex}/>
            <ModalEntradaInventario action={actionKardex} id_enterprice={id_enterprice} onHide={onCloseModalEntradaInventario} show={isModalEntradaInventario}/>
    </>
  )
}
