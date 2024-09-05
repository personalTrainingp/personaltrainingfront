import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Card } from 'react-bootstrap'

export const ContratosMembresia = () => {
  return (
    <Card>
        <Card.Header>
            <Card.Title>Contratos</Card.Title>
        </Card.Header>
        <Card.Body>
            <DataTable value={[]} size={'normal'} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="code" header="Programa"></Column>
                    <Column field="name" header="Socio"></Column>
                    <Column field="category" header="Asesor"></Column>
                    <Column field="quantity" header="Contrato"></Column>
            </DataTable>
        </Card.Body>
    </Card>
  )
}
