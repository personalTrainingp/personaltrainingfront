import React from 'react';

export const WidgetKpi = ({ respuesta }) => {
	const valor = respuesta.valorPrincipal;
	const comparacion = respuesta.comparacion && respuesta.comparacion.variacionPct != null ? respuesta.comparacion : null;
	const etiqueta = respuesta.periodo?.etiqueta;
	const sube = comparacion && comparacion.variacionPct >= 0;
	return (
		<div className='d-flex flex-column justify-content-center h-100 overflow-hidden'>
			{valor ? <h3 className='mb-1 lh-1'>{valor.formateado}</h3> : <p className='mb-1 small' style={{ whiteSpace: 'pre-line' }}>{respuesta.texto}</p>}
			{etiqueta !== 'análisis' && <small className='text-muted text-truncate' title={etiqueta}>{etiqueta}</small>}
			{comparacion && (
				<p className='mb-0 mt-1 small text-truncate' title={`${Math.abs(comparacion.variacionPct)}% vs ${comparacion.etiquetaAnterior}`}>
					<span className={sube ? 'text-success me-2' : 'text-danger me-2'}>
						<i className={sube ? 'mdi mdi-arrow-up-bold' : 'mdi mdi-arrow-down-bold'}></i> {Math.abs(comparacion.variacionPct)}%
					</span>
					<span className='text-nowrap text-muted'>vs {comparacion.etiquetaAnterior}</span>
				</p>
			)}
		</div>
	);
};
