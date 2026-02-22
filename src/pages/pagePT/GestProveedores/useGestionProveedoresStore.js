import { PTApi } from '@/common';
import { onSetProveedores } from '@/store/dataProveedor/proveedorSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useGestionProveedoresStore = () => {
	const dispatch = useDispatch();
	const [dataProveedor, setdataProveedor] = useState({});
	const obtenerProveedoresxEmpresaxTipoxEstado = async (id_empresa, tipo, estado) => {
		try {
			const { data } = await PTApi.get(
				`/proveedor/empresa/${id_empresa}/tipo/${tipo}/estado/${estado}`
			);
			const proveedoresMAP = data.proveedores.map((d) => {
				return {
					...d,
					servicio: d.parametro_oficio?.label_param,
					marca: '',
					nombre_contacto: d?.nombre_contacto,
					razon_social_prov: d?.razon_social_prov,
					ruc_prov: d?.ruc_prov,
					cel_prov: d.cel_prov,
				};
			});
			console.log({ data });

			dispatch(onSetProveedores(proveedoresMAP));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProveedorxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/proveedor/id/${id}`);
			setdataProveedor(data.proveedor);
		} catch (error) {
			console.log(error);
		}
	};
	const postProveedor = async (formState, id_empresa, tipo, estado) => {
		try {
			console.log('aqui pasa');

			await PTApi.post('/proveedor/', formState);
			console.log({ formState });
			await obtenerProveedoresxEmpresaxTipoxEstado(id_empresa, tipo, estado);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerProveedoresxEmpresaxTipoxEstado,
		dataProveedor,
		postProveedor,
		obtenerProveedorxID,
	};
};
