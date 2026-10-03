import React, { useMemo } from 'react';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import { formatear, nombreColumna, unidadColumna } from './formato';

export const WidgetTabla = ({ tipo, respuesta, titulo }) => {
	const unidad = respuesta.unidad;
	const filas = useMemo(() => respuesta.tabla.filas.map((f, i) => {
		const fila = { _k: i };
		f.forEach((celda, j) => { fila[`c${j}`] = celda; });
		return fila;
	}), [respuesta]);
	const columns = useMemo(() => respuesta.tabla.columnas.map((c, j) => ({
		id: `c${j}`,
		header: nombreColumna(c),
		accessor: (row) => row[`c${j}`],
		sortable: true,
		render: (row) => (typeof row[`c${j}`] === 'number' ? formatear(row[`c${j}`], unidad || unidadColumna(c)) : String(row[`c${j}`] ?? '')),
	})), [respuesta, unidad]);
	return (
		<DataTableCR
			columns={columns}
			data={filas}
			rowKey='_k'
			defaultPageSize={filas.length || 1}
			pageSizeOptions={[5, 10, 20]}
			searchable={false}
			exportable={tipo === 'tabla'}
			exportFileName={titulo}
			exportExtraColumns={columns.map(c => ({ id: c.id, exportHeader: c.header, exportValue: c.accessor }))}
			small
			resizableColumns={false}
		/>
	);
};
