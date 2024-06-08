import { arrayDistrito } from '@/types/type';

export const cellStatusColumn = ({ row }) => {
	return row.original.estado ? 'Activo' : 'Inactivo';
};

export const buscarDistrito = ({ row }) => {
	const selectDistrito = arrayDistrito.find(
		(distrito) => distrito.value === `${row.original.ubigeo_distrito}`
	);
	return selectDistrito === undefined ? 'Otro' : selectDistrito.label;
};

