import { formatNumber } from 'accounting'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Card } from 'react-bootstrap'

export const UtilidadesCitas = ({name_cita, dataUtilidades}) => {

  return (
    <Card>
    <Card.Header>
        <Card.Title className='text-center font-20'>Utilidad por {name_cita}</Card.Title>
    </Card.Header>
    <Card.Body>
      
    <DataTable value={dataUtilidades} size={'small'}>
                    <Column header={name_cita} field='nombre_servicio'></Column>
                    <Column header="INGRESOS" field='ingresoSoles' body={(rowData) => formatNumber(rowData.ingresoSoles , 2)}></Column>
                    <Column header="EGRESOS" field='egresoSoles' body={(rowData) => formatNumber(rowData.egresoSoles , 2)}></Column>
                    <Column header="UTILIDAD" field='utilidad' body={(rowData) => formatNumber(rowData.utilidad , 2)}></Column>
                    <Column header="Margen %" field='margen' body={(rowData) => (formatNumber(rowData.margen , 2)*100) + "%"}></Column>
                </DataTable>
    </Card.Body>
    </Card>
  )
}
