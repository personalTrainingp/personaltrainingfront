import { Dialog } from 'primereact/dialog'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { MovimientoItems } from './MovimientoItems'

export const ModalMovimientoItem = ({show, onHide, idArticulo, id_enterprice}) => {
  console.log(idArticulo);
  
  return (
    <Dialog onHide={onHide} visible={show} header={`MOVIMIENTOS`} style={{width: '80rem'}}>
        <TabView>
            <TabPanel header={'ENTRADA'}>
                <MovimientoItems id_enterprice={id_enterprice} movimiento={'entrada'} idArticulo={idArticulo}/>
            </TabPanel>
            <TabPanel header={'SALIDA'}>
                <MovimientoItems id_enterprice={id_enterprice} movimiento={'salida'} idArticulo={idArticulo}/>
            </TabPanel>
            <TabPanel header={'TRASPASO'}>
                <MovimientoItems id_enterprice={id_enterprice} movimiento={'traspaso'} idArticulo={idArticulo}/>
            </TabPanel>
        </TabView>
    </Dialog>
  )
}
