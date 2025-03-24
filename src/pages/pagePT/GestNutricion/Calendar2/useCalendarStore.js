const { PTApi } = require('@/common');
const { useState } = require('react');

const useCalendarStore = () => {
	const [dataClientes, setdataClientes] = useState([]);
	const obtenerClientes = async () => {
		try {
			const { data } = await PTApi.get('');
			setdataClientes(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerClientes,
		dataClientes,
	};
};
