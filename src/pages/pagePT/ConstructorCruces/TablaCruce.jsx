import React from 'react';
import { Table } from 'react-bootstrap';
import { agrupar, formatear } from './logica';

export const TablaCruce = ({ datos, dimFila, dimColumna, medida, operacion }) => {
	const { listaFilas, listaColumnas, celdas, totalesFila, totalesColumna, total } = agrupar(
		datos, dimFila, dimColumna, medida, operacion
	);

	if (!datos.length) return <p className="text-muted">Sin datos para mostrar.</p>;

	return (
		<div className="table-wrapper">
			<Table bordered hover size="sm" className="mb-0">
				<thead>
					<tr className="bg-change text-white">
						<th>{dimFila || ''}</th>
						{listaColumnas.map(c => <th key={c} className="text-end">{c}</th>)}
						<th className="text-end">Total</th>
					</tr>
				</thead>
				<tbody>
					{listaFilas.map((f, i) => (
						<tr key={f}>
							<td className="fw-bold">{f}</td>
							{celdas[i].map((v, j) => <td key={j} className="text-end">{formatear(v)}</td>)}
							<td className="text-end fw-bold">{formatear(totalesFila[i])}</td>
						</tr>
					))}
					<tr>
						<td className="fw-bold">Total</td>
						{totalesColumna.map((v, j) => <td key={j} className="text-end fw-bold">{formatear(v)}</td>)}
						<td className="text-end fw-bold">{formatear(total)}</td>
					</tr>
				</tbody>
			</Table>
		</div>
	);
};
