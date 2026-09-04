import React from 'react';
import { formatear } from './formato';

export const WidgetKpi = ({ respuesta }) => {
	const valor = respuesta.valorPrincipal;
	const comparacion = respuesta.comparacion;
	const sube = comparacion && comparacion.variacionPct >= 0;
	return (
		<div className='d-flex flex-column justify-content-center h-100 overflow-hidden'>
			<h3 className='mb-1 lh-1'>{valor ? valor.formateado : formatear(0, respuesta.unidad)}</h3>
			<small className='text-muted'>{respuesta.periodo?.etiqueta}</small>
			{comparacion && (
				<p className='mb-0 mt-1 small'>
					<span className={sube ? 'text-success me-2' : 'text-danger me-2'}>
						<i className={sube ? 'mdi mdi-arrow-up-bold' : 'mdi mdi-arrow-down-bold'}></i> {Math.abs(comparacion.variacionPct)}%
					</span>
					<span className='text-nowrap text-muted'>vs {comparacion.etiquetaAnterior}</span>
				</p>
			)}
		</div>
	);
};
