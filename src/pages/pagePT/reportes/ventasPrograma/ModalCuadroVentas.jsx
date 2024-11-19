import { MoneyFormatter } from '@/components/CurrencyMask'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Modal } from 'react-bootstrap'

export const ModalCuadroVentas = ({onHide, show, dataSocioxEstado, TitleModalCuadro}) => {
    const socioBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.ventas.tb_cliente.nombres_apellidos_cli}
            </>
        )
    }
    const programaBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.ventas.detalle_ventaMembresia[0].tb_ProgramaTraining?.name_pgm} | {rowData.ventas.detalle_ventaMembresia[0]?.tb_semana_training.semanas_st *5} SESIONES
            </>
        )
    }
    const TotalBodyTemplate = (rowData)=>{
        return (
            <>
            <MoneyFormatter amount={rowData.ventas.detalle_ventaMembresia[0].tarifa_monto}/>
            </>
        )
    }
  return (
    <Modal onHide={onHide} show={show} size='lg'>
        <Modal.Header>
            <Modal.Title>{TitleModalCuadro}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <DataTable value={dataSocioxEstado} paginator rows={10} dataKey="id"  
                    globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} 
                    emptyMessage="Sin Na">
                <Column header="CLIENTES" style={{ minWidth: '12rem' }} body={socioBodyTemplate} />
                <Column header="PROGRAMAS" style={{ minWidth: '12rem' }} body={programaBodyTemplate}/>
                <Column header="TOTAL" style={{ minWidth: '12rem' }} body={TotalBodyTemplate}/>
            </DataTable>
        </Modal.Body>
    </Modal>
  )
}
