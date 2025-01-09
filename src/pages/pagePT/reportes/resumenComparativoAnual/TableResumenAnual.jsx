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
    // Estilo personalizado para el cuerpo de cada celda
    const datebodyTemplate = (rowData, column) => {
        const value = rowData[column.field];
        const style = {
            textAlign: 'right',
            color: value > 10000 ? 'red' : 'green', // Ejemplo: Condicional por valor
            fontWeight: value > 10000 ? 'bold' : 'normal',
        };
        return <span style={style}>{value}</span>;
    };
  return (
    <div>
        
    <div>
      <br/>
      
      <DataTable className='table-normal'  value={transformedData} scrollable showGridlines tableStyle={{ minWidth: '50rem' }} stripedRows >
                                {/* Columna para las métricas */}
                <Column field="metric" header="" rowSpan={2} body={metricBodyTemplate} style={{maxWidth: '7rem'}}/>
                    
                {/* Generar columnas dinámicas basadas en las fechas */}
                {dates.map((date) => (
                    <Column key={date} body={(rowData) => datebodyTemplate(rowData, { field: date })} style={{paddingLeft: '30px', marginRight: '20px'}} bodyStyle={{ fontSize: '20px',  color: '#333' }} header={<>{dayjs.utc(date, 'YYYY-MM').format('MMMM YYYY')}</>} />
                ))}
      </DataTable>
    </div>
    </div>
  )
}
