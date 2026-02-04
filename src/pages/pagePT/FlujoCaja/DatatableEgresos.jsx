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
	const { obtenerVentasxFechaxEmpresa, dataVentasxMes, dataIngresosxMes, obtenerIngresosxFechaxEmpresa } = useVentasStore()
	const dispatch = useDispatch();
	useEffect(() => {
		if(id_enterprice || arrayRangeDate){
			obtenerVentasxFechaxEmpresa(arrayRangeDate, id_enterprice)
			obtenerIngresosxFechaxEmpresa(arrayRangeDate, id_enterprice)
			obtenerGastosxANIO(arrayRangeDate, id_enterprice);
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
	const totalesPorGrupoIngreso = useMemo(()=>{
		return TotalesPorGrupo(dataIngresosxMes).dataTotal
	}, [dataIngresosxMes])
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
					<div>
						<p className='text-center' style={{fontSize: '60px'}}>INGRESOS</p>
						{id_enterprice}
						<TableGasto 
								bgPastel={bgPastel}
								id_empresa={id_enterprice}
								onOpenModalDetallexCelda={onOpenModalDetallexCelda1}
								dataEgresosxMes={id_enterprice!==800?[...dataVentasxMes.filter(ing=>ing.grupo==='INGRESOS')]:dataIngresosxMes} 
								background={background} 
								bgTotal={bgTotal} 
								mesesNombres={mesesNombres} 
								mesesSeleccionadosNums={mesesSeleccionadosNums}
								anio={anio}
								bgMultiValue={bgMultiValue} 
								totalPorMes={totalPorMes}
								totalGeneral ={totalGeneral }
								/>
					</div>
					<div>
					<p className='text-center' style={{fontSize: '60px'}}>EGRESOS</p>
						<TableGasto 
							bgMultiValue={bgMultiValue} 
							bgPastel={bgPastel}
							bgTotal={bgTotal}  
							id_empresa={id_enterprice}
							mesesNombres={mesesNombres} 
							mesesSeleccionadosNums={mesesSeleccionadosNums} 
							onOpenModalDetallexCelda={onOpenModalDetallexCelda}
							totalPorMes={totalPorMes}
							totalGeneral ={totalGeneral }
							selectedMonths ={selectedMonths }
							dataEgresosxMes={dataGastosxANIO.filter(ing=>ing.grupo!=='COMPRA PRODUCTOS/ACTIVOS' )}
							anio={anio}
							/>
					</div>
					
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
							dataGastos={dataGastosxANIO.filter(ing=>ing.grupo!=='COMPRA PRODUCTOS/ACTIVOS')}
							dataIngresos={id_enterprice!==800?[...dataVentasxMes.filter(ing=>ing.grupo==='INGRESOS')]:dataIngresosxMes}
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
				arrayRangeDate={arrayRangeDate}
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