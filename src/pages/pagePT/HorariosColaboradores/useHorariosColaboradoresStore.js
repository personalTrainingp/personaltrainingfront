import { PTApi } from '@/common';
import { DateMask, DateMaskStr } from '@/components/CurrencyMask';
import { onSetDataView } from '@/store/data/dataSlice';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const diaConId = [
	{ label: 'DOMINGO', value: 1692 },
	{ label: 'SABADO', value: 1691 },
	{ label: 'VIERNES', value: 1690 },
	{ label: 'JUEVES', value: 1689 },
	{ label: 'MIERCOLES', value: 1688 },
	{ label: 'MARTES', value: 1687 },
	{ label: 'LUNES', value: 1686 },
];
export const useHorariosColaboradoresStore = () => {
	const dispatch = useDispatch();
	const [dataHorarios, setdataHorarios] = useState([]);
	const obtenerHorariosColaboradores = async () => {
		try {
			const { data } = await PTApi.get(`/contrato-empleado/semana/598`);
			console.log({ data });

			const dataColaboradorMAP = data.empleados?.map((m) => {
				return {
					colaborador: `${m.nombre_empl} ${m.apPaterno_empl}`,
					contratos: m._empl.map((e) => {
						return {
							fecha_fin: e.fecha_fin,
							fecha_inicio: e.fecha_inicio,
							estado: e.estado,
							semana: e.contrato_semana.map((s) => {
								return {
									dia: diaConId.find((d) => d.value === s?.id_dia)?.label,
									hora_inicio: DateMaskStr(s.hora_inicio, 'HH:mm:ss'),
									hora_fin: DateMaskStr(s.hora_fin, 'HH:mm:ss'),
									colaborador: `${m.nombre_empl} ${m.apPaterno_empl}`,
								};
							}),
						};
					}),
				};
			});
			setdataHorarios(dataColaboradorMAP);
			dispatch(onSetDataView(dataColaboradorMAP));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerColaboradoresActivos = async (id_empresa) => {
		try {
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerHorariosColaboradores,
		obtenerColaboradoresActivos,
		dataHorarios,
	};
};
