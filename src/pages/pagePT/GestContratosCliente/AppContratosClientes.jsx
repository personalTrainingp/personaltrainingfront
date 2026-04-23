import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { DataTableContratoCliente } from './DataTableContratoCliente'
import { ModalIsFirma } from '@/components/ModalIsFirma'
import { ModalPhotoCli } from './ModalPhotoCli'
import { TabPanel, TabView } from 'primereact/tabview'
import { AppReporteContratosClientes } from './AppReporteContratosClientes'
export const AppContratosClientes = () => {
    const [isOpenModalFirma, setisOpenModalFirma] = useState({id_cli: 0, id_venta: 0, isOpen: false})
    const [isOpenModalFotoCliente, setisOpenModalFotoCliente] = useState({id_cli: 0, isOpen: false})
    const onOpenModalFirma = (id_cli, id_venta)=>{
        setisOpenModalFirma({id_cli, id_venta, isOpen: true})
    }
    const onCloseModalFirma = ()=>{
        setisOpenModalFirma({id_cli: 0, id_venta: 0, isOpen: false})
    }
    const onOpenModalFotoCli = (id_cli)=>{
        setisOpenModalFotoCliente({id_cli, isOpen: true})
    }
    const onCloseModalFotoCli = ()=>{
        setisOpenModalFotoCliente({id_cli: 0, isOpen: false})
    }
  return (
    <>
        <PageBreadcrumb title={'SITUACION DE CONTRATOS DE SOCIOS'} subName={'T'}/>
        <TabView>
            <TabPanel header='CONTRATOS'>
                <DataTableContratoCliente onOpenModalFirma={onOpenModalFirma} onOpenModalFotoCli={onOpenModalFotoCli}/>
            </TabPanel>
            <TabPanel header={'REPORTE'}>
                <AppReporteContratosClientes />
            </TabPanel>
        </TabView>
                <ModalPhotoCli id_cli={isOpenModalFotoCliente.id_cli} show={isOpenModalFotoCliente.isOpen} onHide={onCloseModalFotoCli}/>
                <ModalIsFirma idCli={isOpenModalFirma.id_cli} idVenta={isOpenModalFirma.id_venta} show={isOpenModalFirma.isOpen} onHide={onCloseModalFirma}/> 
        
    </>
    )
}
