import { PTApi } from '@/common';
import {
	GETSEMANASxpt,
	getProgramaSPT,
	setProgramaPT,
} from '@/store/ventaProgramaPT/programaPTSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useProgramaTrainingStore = () => {
	const dispatch = useDispatch();
	const [programas, setprogramas] = useState([]);

	const [load, setLoad] = useState('empty');

	const startObtenerTBProgramaPT = async () => {
		try {
			let { data } = await PTApi.get('/programaTraining/get_tb_pgm');
			
			data = data.sort((a, b) => {
				const order = [2, 4, 3, 5];
				return order.indexOf(a.id_pgm) - order.indexOf(b.id_pgm);
			});
			dispatch(getProgramaSPT(data));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterLogoTest = async (formData, formstate) => {
		try {
			const { data: dataPrograma } = await PTApi.post('/programaTraining/post_pgm', {
				...formstate,
			});
			const { data } = await PTApi.post(
				`/storage/blob/create/${dataPrograma.uid_avatar}?container=membresiaavatar`,
				formData
			);
			// const { data } = await PTApi.post(`/upload/logo/${dataPrograma.uid_avatar}`, formData);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.log(error);
		}
		// console.log(dataImg);
	};
	const startObtenerProgramaxUID = async (UID) => {
		try {
			setLoad('loading');
			const { data } = await PTApi.get(`/programaTraining/get_pgm/${UID}`);
			setLoad('success');
			dispatch(setProgramaPT(data.programa));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterProgramaTraining = async () => {
		try {
			const { data } = await PTApi.post('/params_GF_vs_GV/post_gf', {
				sigla_gf,
				nombre_gf,
				diaPago_gf,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const startDeleteProgramaTraining = async (id_pgm) => {
		try {
			const { data } = await PTApi.put(`/programaTraining/delete_pgm/${id_pgm}`);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	const obtenerProgramaxID = async (id) => {
		try {
		} catch (error) {
			console.error(error);
		}
	};
	const startUpdateProgramaPT = async (formImg, formState) => {
		try {
			const { data } = await PTApi.put(`/programaTraining/put_pgm/${formState.id_pgm}`, {
				...formState,
			});
			console.log(data);
			if (typeof formImg === 'object') {
				const formData = new FormData();
				formData.append('logo', formImg);
				const { dataImage } = await PTApi.put(
					`put/upload/logo/${data.uuid_image}`,
					formData
				);
			}
			startObtenerTBProgramaPT();
		} catch (error) {
			console.log(error);
		}
	};
	//HORARIOS
	const startRegisterHorarioPgm = async (formstate, uid_pgm, idpgm) => {
		// console.log('Registrar', formstate, id_pgm);
		try {
			const { data } = await PTApi.post('/programaTraining/horario/post_pgm', {
				...formstate,
				uid_pgm: uid_pgm,
				id_pgm: idpgm,
			});
			// startObtenerTBProgramaPT();
			startObtenerProgramaxUID(uid_pgm);
			// console.log(data);
		} catch (error) {
			console.error(error);
		}
	};
	const obtenerHorarioPgm = async (uidPgm) => {
		try {
			const { data } = await PTApi.get(`/horario/get_tb_pgm/${uidPgm}`);
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateHorarioPgm = async (formStateHr, id_pgm) => {
		try {
			// console.log(formStateHr.id_horarioPgm, id_pgm);
			const { data } = await PTApi.put(
				`/programaTraining/horario/put_pgm/${formStateHr.id_horarioPgm}`,
				{
					...formStateHr,
				}
			);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	const startDeleteHorarioPgm = async (id_hrPgm) => {
		try {
			const { data } = await PTApi.put(`/programaTraining/horario/delete_pgm/${id_hrPgm}`);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	//SEMANAS
	const startRegisterSemanaPgm = async (formState, id_pgm, uid_pgm) => {
		try {
			const { data } = await PTApi.post('/programaTraining/semana/post_pgm', {
				...formState,
				id_pgm,
			});
			console.log(data);
			// startObtenerProgramaxUID(uid_pgm);
			startObtenerProgramaxUID(uid_pgm);
			// startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	const startUpdateSemanaPgm = async (formState, id_pgm) => {
		try {
			const { data } = await PTApi.put(
				`/programaTraining/semana/put_pgm/${formState.id_st}`,
				{
					...formState,
				}
			);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	const startDeleteSemanaPgm = async (id_sm) => {
		try {
			const { data } = await PTApi.put(`/programaTraining/semana/delete_pgm/${id_sm}`);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	const obtenerSemanasxID = async (id_st) => {
		try {
			const { data } = await PTApi.get(`/programaTraining/semana/get_sm/${id_st}`);
			console.log(data);
			dispatch(GETSEMANASxpt(data));
		} catch (error) {
			console.log(error);
		}
	};
	//TARIFAS
	const startRegisterTarifaPgm = async (formState, id_st) => {
		try {
			const { data } = await PTApi.post('/programaTraining/tarifa/post_pgm', {
				...formState,
				id_st,
			});
		} catch (error) {
			console.error(error);
		}
	};
	const startUpdateTarifaPgm = async (formState) => {
		try {
			const { data } = await PTApi.put(
				`/programaTraining/tarifa/put_pgm/${formState.id_tt}`,
				{
					...formState,
				}
			);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};
	const startDeleteTarifaPgm = async (id_tt) => {
		try {
			const { data } = await PTApi.put(`/programaTraining/tarifa/delete_pgm/${id_tt}`);
			startObtenerTBProgramaPT();
		} catch (error) {
			console.error(error);
		}
	};

	return {
		startRegisterProgramaTraining,
		startRegisterLogoTest,
		startObtenerProgramaxUID,
		startObtenerTBProgramaPT,
		startUpdateProgramaPT,
		startDeleteProgramaTraining,
		obtenerProgramaxID,
		obtenerHorarioPgm,
		startRegisterHorarioPgm,
		startUpdateHorarioPgm,
		startDeleteHorarioPgm,
		startRegisterSemanaPgm,
		startUpdateSemanaPgm,
		startDeleteSemanaPgm,
		startRegisterTarifaPgm,
		startUpdateTarifaPgm,
		startDeleteTarifaPgm,
		obtenerSemanasxID,
		load,
		programas,
	};
};
