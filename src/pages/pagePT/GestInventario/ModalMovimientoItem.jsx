import { Dialog } from 'primereact/dialog'
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import { MovimientoItems } from './MovimientoItems'
import { App } from '../GestionMovimientoArticulos/App'

export const ModalMovimientoItem = ({show, onHide, idArticulo, id_enterprice}) => {
  return (
    <Dialog onHide={onHide} visible={show} header={`MOVIMIENTOS`} style={{width: '80rem'}}>
        <TabView>
            <TabPanel header={'ENTRADA'}>
                <App movimiento={'entrada'} idArticulo={idArticulo} idEmpresa={id_enterprice}/>
            </TabPanel>
            <TabPanel header={'SALIDA'}>
                <App movimiento={'salida'} idArticulo={idArticulo} idEmpresa={id_enterprice}/>
            </TabPanel>
            <TabPanel header={'TRASPASO'}>
                <App movimiento={'traspaso'} idArticulo={idArticulo} idEmpresa={id_enterprice}/>
            </TabPanel>
        </TabView>
    </Dialog>
  )
}
