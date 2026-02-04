import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select'; // <-- importar react-select
import { useFlujoCajaStore } from './hook/useFlujoCajaStore';
import { ModalDetallexCelda } from './ModalDetallexCelda';
import { useDispatch } from 'react-redux';
import { useVentasStore } from './hook/useVentasStore';
import { TableGasto } from './TableGasto';
import { TotalesGeneralesxMes, TotalesPorGrupo } from './helpers/totalesxGrupo';
import { ModalDetalleIngresosxItem } from './ModalDetalleIngresosxItem';
import { TableResumen } from './TableResumen';
import { ModalDetalleCuentas } from './ModalDetalleCuentas';
import { onSetRangeDate, onViewSection } from '@/store/data/dataSlice';
import { useCuentasStore } from './hook/useCuentasStore';
import { TableCuentas } from './TableCuentas';

export const DatatableEgresos = ({
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
	const {  dataVentasxMes, dataIngresosxMes } = useVentasStore()
	const { dataCuentasBalance, obtenerCuentasBalance } = useCuentasStore()
	const { dataCuentasBalance:cuentasPorCobrar, obtenerCuentasBalance:obtenerCuentasPorCobrar } = useCuentasStore()
	const dispatch = useDispatch();
	useEffect(() => {
		if(id_enterprice || arrayRangeDate){
			obtenerCuentasBalance(arrayRangeDate, id_enterprice, 'PorPagar')
			obtenerCuentasPorCobrar(arrayRangeDate, id_enterprice, 'PorCobrar')
		}
	}, [id_enterprice, arrayRangeDate])
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
	const { totalPorMes, totalGeneral } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataGastosxANIO)
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataGastosxANIO]);
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
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataGastosxANIO.filter(ing=>ing.grupo!=='COMPRA PRODUCTOS/ACTIVOS'))
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataGastosxANIO]);
	// 8) Funciones para abrir/cerrar el modal
	const onCloseModalDetallexCelda2 = () => {
		setIsOpenModalDetallexCelda2(false);
		setDataModal2(null);
	};
	const onOpenModalDetallexCelda2 = (itemDetail) => {
		setDataModal2(itemDetail);
		setIsOpenModalDetallexCelda2(true);
	};
	
	// 8) Funciones para abrir/cerrar el modal
	const onCloseModalDetallexCelda = () => {
		setIsOpenModalDetallexCelda(false);
		setDataModal(null);
	};
	const onOpenModalDetallexCelda = (itemDetail) => {
		setDataModal(itemDetail);
		setIsOpenModalDetallexCelda(true);
	};
	
	// 8) Funciones para abrir/cerrar el modal
	const onCloseModalDetallexCelda1 = () => {
		setIsOpenModalDetallexCelda1(false);
		setDataModal1(null);
	};
	const onOpenModalDetallexCelda1 = (itemDetail) => {
		setDataModal1(itemDetail);
		setIsOpenModalDetallexCelda1(true);
	};
	const mesesSeleccionadosNums = useMemo(
		() => selectedMonths.map((opt) => opt.value),
		[selectedMonths]
	);
	return (
		<>
				<div style={{ marginBottom: '1rem', width: '95vw' }}>
					<Select
						options={monthOptions}
						isMulti
						closeMenuOnSelect={false}
						hideSelectedOptions={false}
						value={selectedMonths}
						onChange={setSelectedMonths}
						placeholder="Selecciona uno o varios meses..."
						styles={{
							control: (provided) => ({
								...provided,
								fontSize: '1.9rem',
								color: 'white',
							}),
							menuList: (provided, state) => ({
								...provided,
								padding: '12px 16px', // Espaciado interno para que cada opción sea más “alta”
							}),
							// Contenedor de las etiquetas seleccionadas ("pills")
							multiValue: (provided) => ({
								...provided,
								backgroundColor: bgMultiValue, // fondo rojo para cada etiqueta
								color: 'white',
							}),
							// Texto dentro de cada pill
							multiValueLabel: (provided) => ({
								...provided,
								color: 'white', // texto blanco sobre rojo
								fontSize: '1.45vw',
							}),
						}}
					/>
				</div>
				<div className="table-responsive" style={{ width: '95vw' }}>
						{id_enterprice}
					<div>
						<TableCuentas
							background={bgTotal}
							bgTotal={bgTotal}
							header={'CUENTAS POR COBRAR'}
							mesesNombres={mesesNombres}
							mesesSeleccionadosNums={mesesSeleccionadosNums}
							onOpenModalDetallexCelda={onOpenModalDetallexCelda2}
							dataIngresosxMes={cuentasPorCobrar}
								/>
					</div>
					<div>
						<TableCuentas
							background={bgTotal}
							bgTotal={bgTotal}
							header={'CUENTAS POR PAGAR'}
							mesesNombres={mesesNombres}
							mesesSeleccionadosNums={mesesSeleccionadosNums}
							onOpenModalDetallexCelda={onOpenModalDetallexCelda2}
							dataIngresosxMes={dataCuentasBalance}
								/>
					</div>
				</div>
			<ModalDetalleCuentas
				data={dataModal2}
				onHide={onCloseModalDetallexCelda2}
				show={isOpenModalDetallexCelda2}
				id_enterprice={id_enterprice}
				anio={anio}
				bgMultiValue={bgMultiValue}
				bgEmpresa={bgTotal}
			/>
		</>
	);
};