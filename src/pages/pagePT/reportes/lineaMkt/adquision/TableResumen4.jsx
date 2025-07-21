import { NumberFormatMoney, NumberFormatter } from "@/components/CurrencyMask";
import React from "react";
import { useBlockLayout, useTable } from "react-table";
import { useSticky } from "react-table-sticky";
function transformarItems(items) {
  const resultado = [];

  for (const item of items) {
    const { fecha, itemVendedores } = item;
    const acumulado = {};

    // Acumular los datos de todos los vendedores para la fila de la fecha
    for (const vendedor of itemVendedores) {
      const { datos } = vendedor;

      for (const tipo in datos) {
        if (!acumulado[tipo]) {
          acumulado[tipo] = { socios: 0, tarifa: 0 };
        }

        acumulado[tipo].socios += datos[tipo]?.socios || 0;
        acumulado[tipo].tarifa += datos[tipo]?.tarifa || 0;
      }
    }

    // Calcular ticket_medio para cada tipo
    for (const tipo in acumulado) {
      const d = acumulado[tipo];
      d.ticket_medio = d.socios ? d.tarifa / d.socios : 0;
    }

    // Agregar la fila de la fecha al resultado
    resultado.push({
      nombre: fecha.toUpperCase(),
      datos: acumulado
    });

    // Agregar cada vendedor al resultado
    for (const vendedor of itemVendedores) {
      resultado.push({
        nombre: vendedor.nombre,
        datos: vendedor.datos
      });
    }
  }

  return resultado;
}

export const TableResumen4 = ({ rawData}) => {
  const rawData1 = transformarItems(rawData)
    const columns = React.useMemo(() => [
        {
    Header: '',
    accessor: 'mes',
    width: 160,
    sticky: 'left',
    Cell: ({row})=>{
        return (
            <div className="text-center" >{row.original.nombre}</div>
        )
    }
  },
  {
    Header: 'TOTAL',
    columns: [
      { Header: 'SOCIOS', id: 'total_socios', accessor: row => row.datos.total.socios,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ) },
      { Header: 'VENTAS', id: 'total_ventas', accessor: row => row.datos.total.tarifa,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'TICKET MEDIO', id: 'total_ticket', accessor: row => row.datos.total.ticket_medio,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatMoney amount={value}/>
    </div>
  ), },
    ],
  },
  {
    Header: 'NUEVOS',
    columns: [
      { Header: 'SOCIOS', id: 'nuevos_socios', accessor: row => row.datos.nuevos.socios,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'VENTAS', id: 'nuevos_ventas', accessor: row => row.datos.nuevos.tarifa,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'TICKET MEDIO', id: 'nuevos_ticket', accessor: row => row.datos.nuevos.ticket_medio,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatMoney amount={value}/>
    </div>
  ), },
    ],
  },
  {
    Header: 'RENOVACIONES',
    columns: [
      { Header: 'SOCIOS', id: 'renovaciones_socios', accessor: row => row.datos.renovaciones.socios,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'VENTAS', id: 'renovaciones_ventas', accessor: row => row.datos.renovaciones.tarifa,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'TICKET MEDIO', id: 'renovaciones_ticket', accessor: row => row.datos.renovaciones.ticket_medio,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatMoney amount={value}/>
    </div>
  ), },
    ],
  },
  {
    Header: 'REINSCRIPCIONES',
    columns: [
      { Header: 'SOCIOS', id: 'reinscripciones_socios', accessor: row => row.datos.reinscripciones.socios,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'VENTAS', id: 'reinscripciones_ventas', accessor: row => row.datos.reinscripciones.tarifa,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatter amount={value}/>
    </div>
  ), },
      { Header: 'TICKET MEDIO', id: 'reinscripciones_ticket', accessor: row => row.datos.reinscripciones.ticket_medio,   Cell: ({ value }) => (
    <div style={{ fontWeight: value !== 0 ? 'bold' : 'normal', textAlign: 'right' }}>
      <NumberFormatMoney amount={value}/>
    </div>
  ), },
    ],
  },
], []);

  const data = React.useMemo(() => rawData1, [rawData1]);
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
      {
    columns,
    data,
    getSubRows: () => [], // asegura que no busque subRows
  },
    useBlockLayout,
    useSticky
  );

  return (
    <div className="table-container fw-bold">
      <div className="table-sticky" {...getTableProps()}>
        <div className="thead-superior" style={{border: '3px solid black'}}>
            <div className="tr">
                <div className="th fs-1" style={{ textAlign: 'center', fontWeight: 'bold',  width: '100%', borderBottom: '2px solid black' }}>
                TODOS LOS PROGRAMAS
                </div>
            </div>
        </div>
        <div className="thead" >
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr fs-3">
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tbody fs-3" {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            // console.log({row});
            
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map(cell => {
                    return (
                  <div {...cell.getCellProps()} className={`td ${cell.column.Header === 'TICKET MEDIO' || cell.column.Header === '' ? 'borde-right fs-3' : ''} ${row.original.mes === 'TOTAL' ? 'borde-total' : ''}`}>
                    {cell.render('Cell')}
                  </div>
                )
                }
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};