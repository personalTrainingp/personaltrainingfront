import { PTApi } from '@/common';
import { uniqueBy } from '@/helper/uniqueBy';
import React, { useState } from 'react';

export const useTerminos2Store = () => {
	const [dataTerminologia2EmpresaxTipo, setdataTerminologia2EmpresaxTipo] = useState({
		dataGrupos: [],
		dataConcepto: [],
	});
	const obtenerTermino2xEmpresaxTipo = async (id_empresa, tipo) => {
		try {
			const { data } = await PTApi.get(`/terminologia/term2/${id_empresa}/${tipo}`);
			const dataGrupos = data.terminologia2.map((t) => {
				return {
					id_empresa: t.parametro_grupo.id_empresa,
					id_tipoGasto: t.id_tipoGasto,
					label: t.parametro_grupo.param_label,
					value: t.parametro_grupo.param_label,
				};
			});
			const dataConcepto = data.terminologia2.map((t) => {
				return {
					label: t.nombre_gasto,
					grupo: t.parametro_grupo.param_label,
					value: t.id,
				};
			});
			console.log({ data });

			setdataTerminologia2EmpresaxTipo({
				dataConcepto,
				dataGrupos: uniqueBy(dataGrupos, 'value'),
			});
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTermino2xEmpresaxTipo,
		dataTerminologia2EmpresaxTipo,
	};
};
