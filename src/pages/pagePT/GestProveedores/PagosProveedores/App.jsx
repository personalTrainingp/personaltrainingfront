import React, { useEffect, useMemo, useState } from 'react';
import { TablePagos } from './TablePagos';
import { Button } from 'primereact/button';
import { ModalCustomPagosProveedores } from './ModalCustomPagosProveedores';
export const App = () => {
  const [modalCustomPagosProv, setmodalCustomPagosProv] = useState({isOpen: false})
  return (
    <div>
      <Button label='AGREGAR TRABAJOS' onClick={()=>setmodalCustomPagosProv({isOpen: true})}/>
      <br/>
      <TablePagos/>
      <ModalCustomPagosProveedores show={modalCustomPagosProv.isOpen} onHide={()=>setmodalCustomPagosProv({isOpen: false})}/>
    </div>
  );
};
