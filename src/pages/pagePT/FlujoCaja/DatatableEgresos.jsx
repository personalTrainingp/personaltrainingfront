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

export const DatatableEgresos = ({
	id_enterprice,
	anio,
	background,
	arrayRangeDate,
	bgMultiValue,
	bgTotal
}) => {
	const [dataModal, setDataModal] = useState(null);
	const [dataModal1, setDataModal1] = useState(null);
	const [dataModal2, setDataModal2] = useState(null);
	const [isOpenModalDetallexCelda1, setIsOpenModalDetallexCelda1] = useState(false);
	const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false);
	const [isOpenModalDetallexCelda2, setIsOpenModalDetallexCelda2] = useState(false);
	const { obtenerGastosxANIO, dataGastosxANIO, dataNoPagos } = useFlujoCajaStore();
	const { obtenerVentasxFechaxEmpresa, dataIngresosxMes, obtenerIngresosxFechaxEmpresa } = useVentasStore()
	const { dataCuentasBalance:dataCuentasBalancePorCobrar, obtenerCuentasBalance:obtenerCuentasBalancePorCobrar } = useCuentasStore()
	const { dataCuentasBalance:dataCuentasBalancePorPagar, obtenerCuentasBalance:obtenerCuentasBalancePorPagar } = useCuentasStore()
	const dispatch = useDispatch();
	useEffect(() => {
		if(id_enterprice || arrayRangeDate){
			// obtenerVentasxFechaxEmpresa(arrayRangeDate, id_enterprice)
			obtenerIngresosxFechaxEmpresa(arrayRangeDate, id_enterprice)
			obtenerCuentasBalancePorCobrar(id_enterprice, 'PorCobrar')
			obtenerCuentasBalancePorPagar(id_enterprice, 'PorPagar')
		}
	}, [id_enterprice, arrayRangeDate])
	
	// 1) Nombres de los meses (índices 0–11)
	const mesesNombres = useMemo(
		() => [
			'ENERO',
			'FEBRERO',
			'MARZO',
			'ABRIL',
			'MAYO',
			'JUNIO',
			'JULIO',
			'AGOSTO',
			'SEPTIEMB.',
			'OCTUBRE',
			'NOVIEMB.',
			'DICIEMBRE',
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
	useEffect(() => {
		obtenerGastosxANIO(anio, id_enterprice);
	}, [anio, id_enterprice]);

	const totalesPorGrupoPorPagar = useMemo(()=>{
		return TotalesPorGrupo(dataCuentasBalancePorCobrar).dataTotal
	}, [dataGastosxANIO])

	const totalesPorGrupo = useMemo(()=>{
		return TotalesPorGrupo(dataGastosxANIO).dataTotal
	}, [dataGastosxANIO])
	
	const totalesPorGrupoIngreso = useMemo(()=>{
		return TotalesPorGrupo(dataIngresosxMes).dataTotal
	}, [dataIngresosxMes])
	// 1) Prepara el array sin “PRESTAMOS”
	const gruposSinPrestamos = totalesPorGrupo.filter(
	(g) => g.grupo.toUpperCase() !== 'PRESTAMOS'
	);
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
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataGastosxANIO)
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataGastosxANIO]);
	// 7) Calcular totales generales por mes para la última fila (sumando cada gasto en items)
	const { totalPorMes:totalPorMesPorPagar, totalGeneral:totalGeneralPorPagar } = useMemo(() => {
		const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataCuentasBalancePorCobrar)
		return {
			totalGeneral,
			totalPorMes
		}
	}, [dataCuentasBalancePorCobrar]);
	console.log({ totalPorMesIngresos, totalGeneralIngresos, totalPorMes, totalGeneral });
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
					<div>
						<p className='text-center' style={{fontSize: '60px'}}>INGRESOS</p>
						<TableVentas 
								onOpenModalDetallexCelda={onOpenModalDetallexCelda1}
								dataIngresosxMes={dataIngresosxMes} 
								background={background} 
								bgTotal={bgTotal} 
								mesesNombres={mesesNombres} 
								mesesSeleccionadosNums={mesesSeleccionadosNums}
								/>
					</div>
					<div>
						{/* <p className='text-center' style={{fontSize: '60px'}}>CUENTAS POR COBRAR</p> */}
						<TableCuentas 
						tipoCuenta={'PorCobrar'}
						header={'CUENTAS POR COBRAR'}
								onOpenModalDetallexCelda={onOpenModalDetallexCelda2}
								dataIngresosxMes={dataCuentasBalancePorCobrar} 
								background={background} 
								bgTotal={bgTotal} 
								mesesNombres={mesesNombres} 
								mesesSeleccionadosNums={mesesSeleccionadosNums}
								idEmpresa={id_enterprice}

								/>
					</div>
					<div>
					<p className='text-center' style={{fontSize: '60px'}}>EGRESOS</p>
						<TableGasto 
							bgMultiValue={bgMultiValue} 
							bgTotal={bgTotal}  
							gruposSinPrestamos={gruposSinPrestamos} 
							mesesNombres={mesesNombres} 
							mesesSeleccionadosNums={mesesSeleccionadosNums} 
							onOpenModalDetallexCelda={onOpenModalDetallexCelda}
							totalPorMes={totalPorMes}
							totalGeneral ={totalGeneral }
							selectedMonths ={selectedMonths }
							dataIngresosxMes={dataIngresosxMes}
							/>
					</div>
					
					<div>
						<TableCuentas 
						tipoCuenta={'PorPagar'}
						header={'CUENTAS POR PAGAR'}
								onOpenModalDetallexCelda={onOpenModalDetallexCelda2}
								dataIngresosxMes={dataCuentasBalancePorPagar} 
								background={background} 
								bgTotal={bgTotal} 
								mesesNombres={mesesNombres} 
								mesesSeleccionadosNums={mesesSeleccionadosNums}
								idEmpresa={id_enterprice}
								/>
					</div>
					<div>
						<TableResumen
							bgMultiValue={bgMultiValue}
							bgTotal={bgTotal}
							mesesNombres={mesesNombres}
							mesesSeleccionadosNums={mesesSeleccionadosNums}
							dataIngresos={totalesPorGrupoIngreso}
							dataGastos={gruposSinPrestamos}
							totalPorMesEgresos={totalPorMesEgresos}
							totalPorMesIngresos={totalPorMesIngresos}
						/>
					</div>
				</div>

			<ModalDetallexCelda
				data={dataModal}
				onHide={onCloseModalDetallexCelda}
				obtenerGastosxANIO={obtenerGastosxANIO}
				show={isOpenModalDetallexCelda}
				id_enterprice={id_enterprice}
				anio={anio}
				bgMultiValue={bgMultiValue}
				bgEmpresa={bgTotal}
			/>
			<ModalDetalleIngresosxItem
				data={dataModal1}
				onHide={onCloseModalDetallexCelda1}
				show={isOpenModalDetallexCelda1}
				id_enterprice={id_enterprice}
				anio={anio}
				bgMultiValue={bgMultiValue}
				bgEmpresa={bgTotal}
			/>
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

