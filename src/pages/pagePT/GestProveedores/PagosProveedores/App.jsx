import React, { useEffect, useMemo, useState } from 'react';
import { TablePagos } from './TablePagos';
import { Button } from 'primereact/button';
import { ModalCustomPagosProveedores } from './ModalCustomPagosProveedores';
export const App = ({id_empresa}) => {
  const [modalCustomPagosProv, setmodalCustomPagosProv] = useState({isOpen: false, id_empresa: 0, id: 0})
  return (
    <div>
      <Button label='AGREGAR CONTRATO' onClick={()=>setmodalCustomPagosProv({isOpen: true, id_empresa: id_empresa, id: 0})}/>
      <br/>
      <TablePagos id_empresa={id_empresa} setmodalCustomPagosProv={setmodalCustomPagosProv}/>
      <ModalCustomPagosProveedores id={modalCustomPagosProv.id} show={modalCustomPagosProv.isOpen} id_empresa={modalCustomPagosProv.id_empresa} onHide={()=>setmodalCustomPagosProv({isOpen: false, id_empresa: 0})}/>
    </div> 
  );
};
