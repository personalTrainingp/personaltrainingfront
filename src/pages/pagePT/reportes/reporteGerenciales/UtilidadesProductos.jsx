import { formatNumber } from 'accounting'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Card } from 'react-bootstrap'

export const UtilidadesProductos = ({name_producto, dataUtilidades}) => {

  return (
    <Card>
    <Card.Header>
        <Card.Title className='text-center font-20'>Utilidad por {name_producto}</Card.Title>
    </Card.Header>
    <Card.Body>
      
    <DataTable value={dataUtilidades} size={'small'}>
                    <Column header={name_producto} field='nombre_producto'></Column>
                    <Column header={<div className='d-flex flex-column'><span>INGRESOS</span><span>S/.</span></div>} field='ingresoSoles' body={(rowData) =>formatNumber(rowData.ingresoSoles , 2)  } ></Column>
                    <Column header={<div className='d-flex flex-column'><span>INGRESOS</span><span>$</span></div>} field='ingresoDolares' body={(rowData) =>formatNumber(rowData.ingresoDolares , 2)  }></Column>
                    <Column header={<div className='d-flex flex-column'><span>EGRESOS</span><span>S/.</span></div>} field='egresoSoles' body={(rowData) =>formatNumber(rowData.egresoSoles , 2)  }></Column>
                    <Column header={<div className='d-flex flex-column'><span>UTILIDAD</span><span>S/.</span></div>} field='utilidad' body={(rowData) =>formatNumber(rowData.utilidad , 2)  }></Column>
                    <Column header={<div className='d-flex flex-column'><span>MARGEN</span><span>%</span></div>} field='margen' body={(rowData) => (formatNumber(rowData.margen , 2)*100) + "%"  }></Column>
                </DataTable>
    </Card.Body>
    </Card>
  )
}
