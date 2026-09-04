import React, { useMemo } from 'react';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import { formatear } from './formato';

export const WidgetTabla = ({ tipo, respuesta, titulo }) => {
	const unidad = respuesta.unidad || 'soles';
	const filas = useMemo(() => respuesta.tabla.filas.map((f, i) => {
		const fila = { _k: i };
		f.forEach((celda, j) => { fila[`c${j}`] = celda; });
		return fila;
	}), [respuesta]);
	const columns = useMemo(() => respuesta.tabla.columnas.map((c, j) => ({
		id: j,
		header: String(c),
		accessor: (row) => row[`c${j}`],
		sortable: true,
		render: (row) => (typeof row[`c${j}`] === 'number' ? formatear(row[`c${j}`], unidad) : String(row[`c${j}`] ?? '')),
	})), [respuesta, unidad]);
	return (
		<DataTableCR
			columns={columns}
			data={filas}
			rowKey='_k'
			defaultPageSize={tipo === 'ranking' ? 10 : 5}
			pageSizeOptions={[5, 10, 20]}
			searchable={false}
			exportable={tipo === 'tabla'}
			exportFileName={titulo}
			small
			resizableColumns={false}
		/>
	);
};
