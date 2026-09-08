import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { PTApi } from '@/common';
import config from '@/config';
import {
	onSetDataViewCheckList,
	onSetDataViewHistorialCheckList,
} from '../checkListSlice';

// El backend ya resuelve los uid_* a su nombre de archivo real (nombre_imagen_item,
// nombre_foto_antes, nombre_foto_despues, nombre_imagen_inicial). Aqui solo se les
// antepone el container correspondiente para que el resto de componentes
// (FormularioCheckList) sigan usando imagen_item / foto_antes / foto_despues como ya
// lo hacian con el mock. nombre_imagen_item (re-subida manual) tiene prioridad sobre
// nombre_imagen_inicial (foto real del articulo tomada del inventario al crear el checklist).
const mapItemConImagenes = (item) => ({
	...item,
	imagen_item: item.nombre_imagen_item
		? `${config.API_IMG.CHECKLIST_ITEM}${item.nombre_imagen_item}`
		: item.nombre_imagen_inicial
			? `${config.API_IMG.AVATAR_ARTICULO}${item.nombre_imagen_inicial}`
			: null,
	foto_antes: item.nombre_foto_antes ? `${config.API_IMG.CHECKLIST_ITEM}${item.nombre_foto_antes}` : null,
	foto_despues: item.nombre_foto_despues ? `${config.API_IMG.CHECKLIST_ITEM}${item.nombre_foto_despues}` : null,
});

export const useCheckListStore = () => {
	const dispatch = useDispatch();
	const [loading, setloading] = useState(false);
	const [dataCheckList, setdataCheckList] = useState({ items: [] });

	// ---------- CHECKLIST (CABECERA) ----------

	const obtenerCheckListxEmpresa = async (id_empresa) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(`/checklist/empresa/${id_empresa}`);
			dispatch(onSetDataViewCheckList(data.checklists || []));
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL OBTENER LOS CHECKLIST',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	const obtenerHistorialCheckListxEmpresa = async (id_empresa) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(`/checklist/historial/${id_empresa}`);
			dispatch(onSetDataViewHistorialCheckList(data.checklists || []));
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL OBTENER EL HISTORICO DE CHECKLIST',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	const obtenerCheckListxID = async (id) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(`/checklist/id/${id}`);
			const checklist = data.checklist || { items: [] };
			setdataCheckList({
				...checklist,
				items: (checklist.items || []).map(mapItemConImagenes),
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL OBTENER EL CHECKLIST',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	const postCheckList = async (formState, id_empresa) => {
		try {
			setloading(true);
			const { data } = await PTApi.post(`/checklist/${id_empresa}`, formState);
			await obtenerCheckListxEmpresa(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'CHECKLIST REGISTRADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
			return data.checklist;
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL REGISTRAR EL CHECKLIST (VERIFICA EL INVENTARIO DE LA EMPRESA)',
				showConfirmButton: false,
				timer: 3000,
			});
		} finally {
			setloading(false);
		}
	};

	const updateCheckListxID = async (id, formState, id_empresa) => {
		try {
			setloading(true);
			await PTApi.put(`/checklist/id/${id}`, formState);
			await obtenerCheckListxEmpresa(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'CHECKLIST ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL ACTUALIZAR EL CHECKLIST',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	const completarCheckListxID = async (id, id_empresa) => {
		try {
			setloading(true);
			await PTApi.put(`/checklist/completar/id/${id}`);
			await obtenerCheckListxEmpresa(id_empresa);
			await obtenerHistorialCheckListxEmpresa(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'CHECKLIST FINALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL FINALIZAR EL CHECKLIST',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	const deleteCheckListxID = async (id, id_empresa) => {
		try {
			setloading(true);
			await PTApi.put(`/checklist/delete/id/${id}`);
			await obtenerCheckListxEmpresa(id_empresa);
			Swal.fire({
				icon: 'success',
				title: 'CHECKLIST ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL ELIMINAR EL CHECKLIST',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	// ---------- CHECKLIST ITEM (REVISION POR ARTICULO) ----------
	// Los items ya existen desde que se crea el checklist (uno por articulo
	// del inventario). Aqui solo se actualiza la revision de un item puntual.

	const updateCheckListItemxID = async (id, formState, id_checklist, imagenItem, fotoAntes, fotoDespues) => {
		try {
			setloading(true);
			const { data } = await PTApi.put(`/checklist-item/id/${id}`, {
				opciones: formState.opciones || [],
				observacion: formState.observacion || '',
				revisado: formState.revisado || false,
			});
			const item = data.item;

			const subidas = [];
			if (imagenItem && item.uid_imagen_item) {
				const formData = new FormData();
				formData.append('file', imagenItem);
				subidas.push(
					PTApi.post(`/storage/blob/create/${item.uid_imagen_item}?container=checklist-items`, formData)
				);
			}
			if (fotoAntes && item.uid_foto_antes) {
				const formData = new FormData();
				formData.append('file', fotoAntes);
				subidas.push(
					PTApi.post(`/storage/blob/create/${item.uid_foto_antes}?container=checklist-items`, formData)
				);
			}
			if (fotoDespues && item.uid_foto_despues) {
				const formData = new FormData();
				formData.append('file', fotoDespues);
				subidas.push(
					PTApi.post(`/storage/blob/create/${item.uid_foto_despues}?container=checklist-items`, formData)
				);
			}
			if (subidas.length) await Promise.all(subidas);

			await obtenerCheckListxID(id_checklist);
			Swal.fire({
				icon: 'success',
				title: 'ITEM ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL ACTUALIZAR EL ITEM',
				showConfirmButton: false,
				timer: 2500,
			});
		} finally {
			setloading(false);
		}
	};

	return {
		loading,
		dataCheckList,
		setdataCheckList,
		obtenerCheckListxEmpresa,
		obtenerHistorialCheckListxEmpresa,
		obtenerCheckListxID,
		postCheckList,
		updateCheckListxID,
		completarCheckListxID,
		deleteCheckListxID,
		updateCheckListItemxID,
	};
};
