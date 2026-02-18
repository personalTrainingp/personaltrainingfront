import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewEgresos } from './egresosSlice';
import { arrayFinanzas, arrayTipoIngresos } from '@/types/type';
import Swal from 'sweetalert2';

export const useGastosStore = () => {
	const [dataGasto, setdataGasto] = useState({
		id_tipoGasto: 0,
		id_oficio: 0,
		id_gasto: 0,
		grupo: '',
		moneda: '',
		monto: 0,
		id_tipo_comprobante: 0,
		id_estado_gasto: 1423,
		n_comprabante: '',
		impuesto_igv: false,
		impuesto_renta: false,
		fec_pago: '',
		fec_comprobante: '',
		id_forma_pago: 0,
		id_banco_pago: 0,
		n_operacion: '',
		id_prov: 0,
		id_contrato_prov: 0,
		id_porCobrar: 0,
		descripcion: '',
		esCompra: 0,
		id_empresa: 0,
	});
	const [loading, setloading] = useState(false);
	const dispatch = useDispatch();
	const obtenerGastos = async (id_empresa) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(`/egreso/empresa/${id_empresa}`);
			console.log({ data, id_empresa });
			const dataGastoMap = data.gastos.map((g) => {
				return {
					...g,
					tipo_gasto: arrayFinanzas.find(
						(e) => e.value === g.tb_parametros_gasto?.id_tipoGasto
					)?.label,
					rubro: g.tb_parametros_gasto?.grupo,
					concepto: g.tb_parametros_gasto?.nombre_gasto,
					nombre_proveedor: g.tb_Proveedor?.razon_social_prov,
					forma_pago: g.parametro_forma_pago?.label_param,
					id: g.id,
				};
			});
			setloading(false);
			dispatch(onSetDataViewEgresos(dataGastoMap));
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};
	const obtenerGastoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/egreso/id/${id}`);

			const dataGasto = {
				...data.gasto,
				id_empresa: data.gasto?.tb_parametros_gasto?.id_empresa,
				id_tipoGasto: data.gasto?.tb_parametros_gasto?.id_tipoGasto,
				grupo: data.gasto?.tb_parametros_gasto?.grupo,
			};
			setdataGasto(dataGasto);
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	const postGasto = async (formState, id_empresa) => {
		try {
			console.log({ id_empresa }, 2);
			await PTApi.post(`/egreso/`, formState);
			await obtenerGastos(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'GASTO REGISTRADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	const updateGastoxID = async (id, formState, id_empresa) => {
		try {
			console.log({ id_empresa }, 3);
			await PTApi.put(`/egreso/id/${id}`, formState);
			await obtenerGastos(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'GASTO ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	const deleteGastoxID = async (id, id_empresa) => {
		try {
			console.log({ id_empresa }, 4);
			await PTApi.put(`/egreso/delete/id/${id}`);
			await obtenerGastos(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'GASTO ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'danger',
				title: 'PROBLEMA',
				showConfirmButton: false,
				timer: 2500,
			});
		}
	};
	return {
		obtenerGastos,
		updateGastoxID,
		deleteGastoxID,
		obtenerGastoxID,
		postGasto,
		dataGasto,
		loading,
	};
};
