import { useResumenFechas } from './hooks/useResumenFechas';
import { useResumenVentas } from './hooks/useResumenVentas';
import { useResumenRenovaciones } from './hooks/useResumenRenovaciones';
import { useResumenMarketing } from './hooks/useResumenMarketing';
import { originMap, avataresDeProgramas } from './hooks/useResumenUtils';

export const useResumenEjecutivoStore = (id_empresa, configs = {}) => {
	const { initialMonth } = configs;
	const fechas = useResumenFechas(initialMonth);


	const ventas = useResumenVentas(id_empresa, fechas);

	const renovaciones = useResumenRenovaciones(id_empresa, fechas, ventas.pgmNameByIdDynamic);

	const marketing = useResumenMarketing(id_empresa, fechas, ventas.dataVentas, ventas.mesesSeleccionados, originMap);

	return {
		...fechas,
		...ventas,
		...renovaciones,
		dataLead: marketing.dataLead,
		dataLeadPorMesAnio: marketing.dataLeadPorMesAnio,
		dataMkt: marketing.dataMktByMonth,
		dataMktWithCac: marketing.dataMktWithCac,
		originMap,
		vencimientosFiltrados: renovaciones.vencimientosFiltrados,
		avataresDeProgramas,
		avataresDeProgramas,
		isLoading: ventas.isLoadingVentas || renovaciones.isLoadingRenovaciones || marketing.isLoadingMarketing,
		historicalVentas: ventas.historicalVentas
	};
};