import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import {
	onSetGastos,
	onSetParametrosGastos,
	onSetProveedoresUnicosxGasto,
} from '@/store/dataGastos/gastosSlice';
import {
	getGastosFijo,
	getGastosVariable,
	onRegisterGastoFijo,
	onRegisterGastoVariable,
} from '@/store/gfGv/gfGvSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useReporteVentasxProgramasStore = () => {
	const dispatch = useDispatch();
	const [ventasxPrograma, setventasxPrograma] = useState([]);
	const [transferencias, settransferencias] = useState(0);

	const [numeroDeTraspaso, setNumeroDeTraspaso] = useState(0);
	const obtenerVentasxPrograma = async (id, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/venta/reporte/reporte-ventas-x-programa/${id}`, {
				params: {
					arrayDate: arrayDate,
				},
			});

			setNumeroDeTraspaso(data.ventas.filter((item) => item.id_tipoFactura === 701).length);
			setventasxPrograma(agruparVentasPorUbigeoYDistrito(data.ventas));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTransferencias_x_pgm_x_Date = async (id, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/venta/reporte/obtener-transferencias/${id}`, {
				params: {
					arrayDate: arrayDate,
				},
			});

			settransferencias(data.transferencias.length);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClientesConTraspasos = async (id, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/venta/reporte/reporte-ventas-x-programa/${id}`, {
				params: {
					arrayDate: arrayDate,
				},
			});
			setNumeroDeTraspaso(agruparVentasPorUbigeoYDistrito(data.ventas));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasxPrograma,
		obtenerClientesConTraspasos,
		obtenerTransferencias_x_pgm_x_Date,
		transferencias,
		ventasxPrograma,
		numeroDeTraspaso,
	};
};

// Función para agrupar las ventas excluyendo tb_distrito null
const agruparVentasPorUbigeoYDistrito = (ventas) => {
	return ventas.reduce((result, venta) => {
		const { ubigeo_distrito_cli, tb_distrito } = venta.tb_cliente;

		// Excluir si tb_distrito es null
		if (!tb_distrito) return result;

		const { distrito } = tb_distrito;

		// Buscar si ya existe un grupo con ese ubigeo y distrito
		let group = result.find(
			(g) => g.ubigeo === ubigeo_distrito_cli && g.nombre_distrito === distrito
		);

		if (!group) {
			// Si no existe, crear uno nuevo
			group = {
				ubigeo: ubigeo_distrito_cli,
				nombre_distrito: distrito,
				items: [],
			};
			result.push(group);
		}

		// Añadir la venta completa al array 'items'
		group.items.push(venta);

		return result;
	}, []);
};
