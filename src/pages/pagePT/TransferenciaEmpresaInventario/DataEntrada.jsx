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
      
  return (
    <>
            <Button onClick={onOpenModalEntradaInventario}>AGREGAR TRANSFERENCIA</Button>
            <TableEntradaInventario id_enterprice={id_enterprice} action={actionKardex}/>
            <ModalEntradaInventario action={actionKardex} id_enterprice={id_enterprice} onHide={onCloseModalEntradaInventario} show={isModalEntradaInventario}/>
    </>
  )
}
