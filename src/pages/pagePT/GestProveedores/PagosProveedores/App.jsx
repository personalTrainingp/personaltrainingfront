import React, { useEffect, useMemo, useState } from 'react';
import { TablePagos } from './TablePagos';
import { Button } from 'primereact/button';
import { ModalCustomPagosProveedores } from './ModalCustomPagosProveedores';
export const App = ({id_empresa}) => {
  const [modalCustomPagosProv, setmodalCustomPagosProv] = useState({isOpen: false, id_empresa: 0, id: 0})
  const onOpenModalCustomPagosProv = (id, id_empresa)=>{
    setmodalCustomPagosProv({isOpen: true, id, id_empresa})
  }
  return (
    <div>
      <Button label='AGREGAR CONTRATO' onClick={()=>onOpenModalCustomPagosProv(0, id_empresa)}/>
      <br/>
      <TablePagos id_empresa={id_empresa} onOpenModalCustomPagosProv={onOpenModalCustomPagosProv}/>
      <ModalCustomPagosProveedores id={modalCustomPagosProv.id} show={modalCustomPagosProv.isOpen}  id_empresa1={modalCustomPagosProv.id_empresa} onHide={()=>setmodalCustomPagosProv({isOpen: false, id_empresa: 0, id:0})}/>
    </div> 
  );
};
