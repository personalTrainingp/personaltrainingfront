import { useCallback, useEffect, useRef, useState } from 'react';
import { PTApi } from '@/common';

const SIMULTANEAS = 5;
const ESPERA_MS = 30000;
const EXT_VERIFICABLES = /\.(pdf|png|jpe?g|gif|webp)$/i;

// Archivos "SIN PDF" (mismo criterio que el icono de la vista previa): sin archivo
// adjunto, que ya no existe en el servidor, o cuyo contenido no es un PDF.
export const useSinPdf = (data, activo) => {
	const [faltantes, setfaltantes] = useState(() => new Set());
	const [verificando, setverificando] = useState(false);
	const verificados = useRef(new Set());

	const marcarSinPdf = useCallback((nombre) => {
		setfaltantes((actual) => (actual.has(nombre) ? actual : new Set(actual).add(nombre)));
	}, []);

	// la existencia en el servidor solo se consulta al activar la busqueda, una vez por archivo
	useEffect(() => {
		if (!activo) return;
		let cancelado = false;
		const pendientes = [
			...new Set((data || []).map((row) => row?.tb_image?.name_image).filter((n) => n && EXT_VERIFICABLES.test(n))),
		].filter((n) => !verificados.current.has(n));

		const trabajador = async () => {
			while (pendientes.length && !cancelado) {
				const nombre = pendientes.shift();
				try {
					await PTApi.head(`/storage/blob/view/${encodeURIComponent(nombre)}`, {
						params: { containerName: 'docs-general' },
						timeout: ESPERA_MS,
					});
					verificados.current.add(nombre);
				} catch (error) {
					// otra falla (red, servidor) no significa que falte: se reintenta la proxima vez
					if (error.response?.status === 404) {
						verificados.current.add(nombre);
						marcarSinPdf(nombre);
					}
				}
			}
		};
		setverificando(pendientes.length > 0);
		Promise.all(Array.from({ length: SIMULTANEAS }, trabajador)).finally(() => {
			if (!cancelado) setverificando(false);
		});
		return () => {
			cancelado = true;
		};
	}, [data, activo, marcarSinPdf]);

	const esSinPdf = useCallback(
		(row) => {
			const nombre = row?.tb_image?.name_image;
			return !nombre || faltantes.has(nombre);
		},
		[faltantes]
	);

	return { esSinPdf, marcarSinPdf, verificando };
};
