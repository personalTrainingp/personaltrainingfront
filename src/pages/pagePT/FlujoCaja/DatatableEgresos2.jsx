import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select'; // <-- importar react-select
import { useFlujoCajaStore } from './hook/useFlujoCajaStore';
import { ModalDetallexCelda } from './ModalDetallexCelda';
import { useDispatch } from 'react-redux';
import { onSetColorView, onSetViewSubTitle } from '@/store';
import { useVentasStore } from './hook/useVentasStore';
import { TableVentas } from './TableVentas';
import { TableGasto } from './TableGasto';
import { TableFinal } from './TableFinal';
import { TotalesGeneralesxMes, TotalesPorGrupo } from './helpers/totalesxGrupo';
import { ModalDetalleIngresosxItem } from './ModalDetalleIngresosxItem';
import { TableResumen } from './TableResumen';
import { TableCuentas } from './TableCuentas';
import { useCuentasStore } from './hook/useCuentasStore';
import { ModalDetalleCuentas } from './ModalDetalleCuentas';
import { onSetRangeDate, onViewSection } from '@/store/data/dataSlice';

export const DatatableEgresos2 = ({
	id_enterprice,
	anio,
	background,
	arrayRangeDate,
	bgMultiValue,
	bgPastel,
	bgTotal
}) => {
	const [dataModal, setDataModal] = useState(null);
	const [dataModal1, setDataModal1] = useState(null);
	const [dataModal2, setDataModal2] = useState(null);
	const [isOpenModalDetallexCelda1, setIsOpenModalDetallexCelda1] = useState(false);
	const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false);
	const [isOpenModalDetallexCelda2, setIsOpenModalDetallexCelda2] = useState(false);
	const { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore();
	const { obtenerVentasxFechaxEmpresa, dataVentasxMes, dataIngresosxMes, obtenerIngresosxFechaxEmpresa } = useVentasStore()
	// const { dataCuentasBalance:dataCuentasBalancePorCobrar, obtenerCuentasBalance:obtenerCuentasBalancePorCobrar } = useCuentasStore()
	// const { dataCuentasBalance:dataCuentasBalancePorPagar, obtenerCuentasBalance:obtenerCuentasBalancePorPagar } = useCuentasStore()
	const dispatch = useDispatch();
	useEffect(() => {
		obtenerVentasxFechaxEmpresa(arrayRangeDate, id_enterprice)
		obtenerIngresosxFechaxEmpresa(arrayRangeDate, id_enterprice)
		obtenerGastosxANIO(arrayRangeDate, id_enterprice);
	}, [id_enterprice])
	useEffect(() => {
			dispatch(onSetRangeDate(['AL', `${anio}`]))
	}, [])
	
	// 1) Nombres de los meses (índices 0–11)
	const mesesNombres = useMemo(
		() => [
			'ENE.',
			'FEB.',
			'MAR.',
			'ABR.',
			'MAY.',
			'JUN.',
			'JUL.',
			'AGO.',
			'SEPT.',
			'OCT.',
			'NOV.',
			'DIC.',
		],
		[]
	);

	// 2) Crear opciones para react-select (value=1..12, label=“ENERO” etc)
	const monthOptions = useMemo(() =>
			mesesNombres.map((nombre, idx) => ({
				value: idx + 1,
				label: nombre,
			})),
		[mesesNombres]
	);

	// 3) Estado local para los meses seleccionados (inicialmente, todos)
	const [selectedMonths, setSelectedMonths] = useState(() => {
		// intenta leer un array de valores [1,2,3...]
		const stored = localStorage.getItem('selectedMonths')
		if (stored) {
			const vals = JSON.parse(stored)
			// reconstruye el array de opciones a partir de los valores guardados
			return monthOptions.filter(opt => vals.includes(opt.value))
		}
		// si no hay nada en storage, selecciona todos por defecto
		return monthOptions
	});
// 4) Persiste en localStorage cada vez que cambie la selección
	useEffect(() => {
		const vals = selectedMonths.map(opt => opt.value)
		localStorage.setItem('selectedMonths', JSON.stringify(vals))
	}, [selectedMonths])
	// 4) Cada vez que cambia empresa o año, recargar datos
	const { totalPorMes: totalPorMesVenta, totalGeneral: totalGeneralVenta } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes([...dataVentasxMes.filter(ing=>ing.grupo==='INGRESOS')])
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataVentasxMes]);
	
	// 7) Calcular totales generales por mes para la última fila (sumando cada gasto en items)
	const { totalPorMes: totalPorMesIngExc, totalGeneral: totalGeneralIngExc } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes([...dataIngresosxMes.filter(ing=>ing.grupo==='INGRESOS EXTRAORDINARIOS')])
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataVentasxMes]);
	// 7) Calcular totales generales por mes para la última fila (sumando cada gasto en items)
	const { totalPorMes:totalPorMesIngresos, totalGeneral:totalGeneralIngresos } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataIngresosxMes)
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataIngresosxMes]);
	// 7) Calcular totales generales por mes para la última fila (sumando cada gasto en items)
	const { totalPorMes:totalPorMesEgresos, totalGeneral:totalGeneralEgresos } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataGastosxANIO.filter(ing=>ing.grupo!=='PRESTAMOS'))
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataGastosxANIO]);
	const mesesSeleccionadosNums = useMemo(
		() => selectedMonths.map((opt) => opt.value),
		[selectedMonths]
	);

	return (
		<>
				<div className="table-responsive" style={{ width: '95vw' }}>
					<div>
						<TableResumen
							id_empresa={id_enterprice}
							bgMultiValue={bgMultiValue}
							bgTotal={bgTotal}
							mesesNombres={mesesNombres}
							mesesSeleccionadosNums={mesesSeleccionadosNums}
							totalPorMesEgresos={totalPorMesEgresos}
							totalPorMesIngresos={id_enterprice!==800?totalPorMesVenta:totalPorMesIngresos}
							totalPorMesIngExc={totalPorMesIngExc}
							dataGastos={dataGastosxANIO.filter(ing=>ing.grupo!=='PRESTAMOS')}
							dataIngresos={id_enterprice!==800?[...dataVentasxMes.filter(ing=>ing.grupo==='INGRESOS')]:dataIngresosxMes}
							anio={anio}
						/>
					</div>
				</div>
		</>
	);
};