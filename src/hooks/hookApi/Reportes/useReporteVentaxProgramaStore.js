import { PTApi } from '@/common';
import { useState } from 'react';

export const useReporteVentaxProgramaStore = () => {
	const [membresiasxFechaxPrograma, setmembresiasxFechaxPrograma] = useState([]);
	const [dataClientes, setDataClientes] = useState([]);
	const [dataClientesEspeciales, setdataClientesEspeciales] = useState([]);

	const obtenerMembresiasxFechaxPrograma = async (id_programa, rangoDate) => {
		try {
			const { data } = await PTApi.get(
				'/reporte/programa/obtener-membresias-x-fecha-x-programa',
				{
					params: {
						rangoDate,
						id_programa,
					},
				}
			);
			setmembresiasxFechaxPrograma(data.membresias);
		} catch (error) {
			console.log(error);
		}
	};

	const estadosClienteMembresia = async (id_programa, fechaDesdeStr, fechaHastaStr) => {
		try {
			//debugger;
			fechaDesdeStr = formatearFecha(fechaDesdeStr);
			fechaHastaStr = formatearFecha(fechaHastaStr);

			const { data } = await PTApi.post('venta/estado-membresia', {
				tipoPrograma: id_programa,
				fechaDesde: fechaDesdeStr,
				fechaHasta: fechaHastaStr,
			});

			setDataClientes(data.msg);
			console.log(data.msg);
		} catch (error) {
			console.log('error Estados Cliente ' + error.message);
		}
	};

	//Traspasos y transferencias
	const clientesEspeciales = async (id_programa, fechaDesdeStr, fechaHastaStr) => {
		try {
			fechaDesdeStr = formatearFecha(fechaDesdeStr);
			fechaHastaStr = formatearFecha(fechaHastaStr);
			const { data } = await PTApi.get('/reporte/programa/clientes-especiales', {
				id_programa,
				fechaDesdeStr,
				fechaHastaStr,
			});
			setdataClientesEspeciales(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	function formatearFecha(fecha) {
		const year = fecha.getFullYear();
		const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son base 0, por lo que se suma 1
		const day = String(fecha.getDate()).padStart(2, '0');

		const fechaFormateada = `${year}-${month}-${day}`;
		return fechaFormateada;
	}

	return {
		obtenerMembresiasxFechaxPrograma,
		membresiasxFechaxPrograma,
		estadosClienteMembresia,
		dataClientes,
	};
};
