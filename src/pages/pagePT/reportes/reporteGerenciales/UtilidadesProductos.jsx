import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Card } from 'react-bootstrap'

export const UtilidadesProductos = ({name_producto, dataUtilidades}) => {

  return (
    <Card>
    <Card.Header>
        <Card.Title className='text-center font-20'>Utilidades por {name_producto}</Card.Title>
    </Card.Header>
    <Card.Body>
      
    <DataTable value={dataUtilidades} size={'small'}>
                    <Column header={name_producto} field='mes'></Column>
                    <Column header="INGRESOS" field='total_ingresos'></Column>
                    <Column header="EGRESOS" field='total_gasto'></Column>
                    <Column header="UTILIDADES" field='total_bene'></Column>
                    <Column header="Margen %" field='margen'></Column>
                </DataTable>
    </Card.Body>
    </Card>
  )
}
