import { Dialog } from 'primereact/dialog'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { MovimientoItems } from './MovimientoItems'

export const ModalMovimientoItem = ({show, onHide, idArticulo}) => {
  console.log(idArticulo);
  
  return (
    <Dialog onHide={onHide} visible={show} header={`MOVIMIENTOS`} style={{width: '80rem'}}>
        <TabView>
            <TabPanel header={'ENTRADA'}>
                <MovimientoItems movimiento={'entrada'} idArticulo={idArticulo}/>
            </TabPanel>
            <TabPanel header={'SALIDA'}>
                <MovimientoItems movimiento={'salida'} idArticulo={idArticulo}/>
            </TabPanel>
            <TabPanel header={'TRASPASO'}>
                <MovimientoItems movimiento={'traspaso'} idArticulo={idArticulo}/>
            </TabPanel>
        </TabView>
    </Dialog>
  )
}
