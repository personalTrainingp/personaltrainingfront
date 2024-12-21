import { PTApi } from '@/common';
import { useState } from 'react';

export const useComboVentasxMesAnioStore = () => {
	const [comboMesesActivo, setcomboMesesActivo] = useState([]);
	const obtenerVentasDeProgramasxFechaVenta = async () => {
		const { data } = await PTApi.get('/terminologia/combo-mes-activo-ventas');
		setcomboMesesActivo(data.res);
	};

	return {
		obtenerVentasDeProgramasxFechaVenta,
		comboMesesActivo,
	};
};
