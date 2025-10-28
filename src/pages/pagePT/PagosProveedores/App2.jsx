import React, { useEffect, useMemo, useState } from 'react';
import { TablePagos } from './TablePagos';
import { ModalCustomPagosProveedores } from './ModalCustomPagosProveedores';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const App2 = ({id_empresa, bgEmpresa='', classNameTablePrincipal}) => {
  const [modalCustomPagosProv, setmodalCustomPagosProv] = useState({isOpen: false, id_empresa: 0, id: 0})
  const onOpenModalCustomPagosProv = (id, id_empresa)=>{
    setmodalCustomPagosProv({isOpen: true, id, id_empresa})
  }
  const { RANGE_DATE } = useSelector(e=>e.DATA)
  
  useEffect(() => {
    if(RANGE_DATE[0]===null) return;
    if(RANGE_DATE[1]===null) return;
  }, [RANGE_DATE])
  return (
    <div>
      <Button className={`${bgEmpresa} border-none outline-none mb-2 p-2 fs-3`} onClick={()=>onOpenModalCustomPagosProv(0, id_empresa)}>AGREGAR CONTRATO</Button>
      {/* <Button className={'bg-circus'} label='AGREGAR CONTRATO' onClick={()=>onOpenModalCustomPagosProv(0, id_empresa)}/> */}
      <br/>
      <TablePagos RANGE_DATE={RANGE_DATE} bgEmpresa={bgEmpresa} classNameTablePrincipal={classNameTablePrincipal} id_empresa={id_empresa} onOpenModalCustomPagosProv={onOpenModalCustomPagosProv}/>
      <ModalCustomPagosProveedores id={modalCustomPagosProv.id} show={modalCustomPagosProv.isOpen}  id_empresa1={modalCustomPagosProv.id_empresa} onHide={()=>setmodalCustomPagosProv({isOpen: false, id_empresa: 0, id:0})}/>
    </div> 
  );
};
