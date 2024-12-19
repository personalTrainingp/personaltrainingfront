import dayjs from 'dayjs';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react'
import { Table } from 'react-bootstrap';

export const TableResumenAnual = ({dataMes}) => {
    // Extraer dinámicamente las métricas (propiedades distintas a "date")
    console.log(dataMes);
    
    const metrics = Object.keys(dataMes[0]).filter((key) => key !== 'date')

    // Crear una lista única de fechas
    const dates = dataMes.map((item) => item.date);

// Transformar los datos para el DataTable
    const transformedData = metrics.map((metric) => {
        const row = { metric }; // La primera columna será el nombre de la métrica
        dataMes.forEach((item) => {
        row[item.date] = item[metric]; // Añadir columnas dinámicas basadas en las fechas
        });
        return row;
    });
    // console.log(metrics);
    const metricBodyTemplate = (rowData)=>{
        // console.log(rowData);
        
        return (
            <div>
            {rowData.metric?.split('_')[0]} {rowData.metric?.split('_')[1]}
            </div>
        )
    }
    const dateBodyTemplate = (rowData)=>{
        return (
            <div>
                {
                    rowData
                }
            </div>
        )
    }
  return (
    <div>
        
    <div>
      <br/>
      
      <DataTable className='table-normal' reorderableColumns  value={transformedData} scrollable showGridlines tableStyle={{ minWidth: '50rem' }} stripedRows >
                                {/* Columna para las métricas */}
                    <Column field="metric" header="" body={metricBodyTemplate}/>

                {/* Generar columnas dinámicas basadas en las fechas */}
                {dates.map((date) => (
                <Column key={date} field={date} header={<>{dayjs.utc(date, 'YYYY-MM').format('YYYY MMMM')}</>} />
                ))}
      </DataTable>
      {/* <Table
      className="table-centered mb-0"
      hover
      responsive
      >
        <thead className='bg-primary'>
            <tr>
                <th></th>
                <th>ENERO</th>
                <th>FEBRERO</th>
                <th>MARZO</th>
                <th>ABRIL</th>
                <th>MAYO</th>
                <th>JUNIO</th>
                <th>JULIO</th>
                <th>AGOSTO</th>
                <th>ENERO</th>
                <th>FEBRERO</th>
                <th>MARZO</th>
                <th>ABRIL</th>
                <th>MAYO</th>
                <th>JUNIO</th>
                <th>JULIO</th>
                <th>AGOSTO</th>
            </tr>
        </thead>

      </Table> */}
    </div>
    </div>
  )
}
