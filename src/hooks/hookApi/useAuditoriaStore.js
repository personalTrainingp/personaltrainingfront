import { PTApi } from '@/common';
import { useState } from 'react';

export const useAuditoriaStore = () => {
	const [dataAuditoria, setdataAuditoria] = useState([]);
	const obtenerAuditoriaTabla = async () => {
		const { data } = await PTApi.get('/auditoria/get-auditoria');
		setdataAuditoria(data.audit);
	};
	return {
		obtenerAuditoriaTabla,
		dataAuditoria,
	};
};
