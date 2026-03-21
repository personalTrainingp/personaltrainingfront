import { PTApi } from '@/common';
import React, { useState } from 'react';

export const useMonkeyFitStore = () => {
	const [dataMF, setdataMF] = useState([]);
	const obtenerMF = async () => {
		try {
			const { data } = await PTApi.get('/reserva_monk_fit/g');
			console.log({ data });
			setdataMF(data.reservasMF);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerMF,
		dataMF,
	};
};
