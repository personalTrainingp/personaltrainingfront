import { useResumenFechas } from './hooks/useResumenFechas';
import { useResumenVentas } from './hooks/useResumenVentas';
import { useResumenRenovaciones } from './hooks/useResumenRenovaciones';
import { useResumenMarketing } from './hooks/useResumenMarketing';
import { originMap, avataresDeProgramas } from './hooks/useResumenUtils';

export const useResumenEjecutivoStore = (id_empresa) => {

	const fechas = useResumenFechas();


	const ventas = useResumenVentas(id_empresa, fechas);

	const renovaciones = useResumenRenovaciones(id_empresa, fechas, ventas.dataGroup, ventas.pgmNameByIdDynamic);

	const marketing = useResumenMarketing(id_empresa, fechas, ventas.dataVentas, ventas.mesesSeleccionados);

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
		isLoading: ventas.isLoadingVentas || renovaciones.isLoadingRenovaciones || marketing.isLoadingMarketing
	};
};