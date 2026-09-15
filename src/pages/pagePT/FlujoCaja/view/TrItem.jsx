import React, { useEffect } from 'react';
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { obtenerAnioMesDiaActualPeru } from '../helpers/fechaPeru';

// Tamaño del TOTAL ANUAL / PROMEDIO: siempre más grande que el de los meses
// (className). Antes quedaba fijo en 35px/45px sin importar el tamaño de
// los meses, así que en la fila TOTAL (className='fs-1', ~40px, más grande
// que 'fs-2' de las filas normales) los meses terminaban viéndose más
// grandes que su propio total/promedio.
const fontSizeTotal = (className, anio) => {
	const filaGrande = className === 'fs-1'
	if (anio === 2020) return filaGrande ? '55px' : '45px'
	return filaGrande ? '45px' : '35px'
}

export const TrItemVentas = ({ label = '', anio=2024,
	arrayFechas = [],
	arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='',
	dataIngresosxFecha: dataIngresosxFechaProp, ocultarMeses = false }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha: dataIngresosxFechaFetched } = useFlujoCaja();
	// Si el padre ya trae los datos (fila TOTAL con las 4 empresas juntas),
	// los usamos directo y no volvemos a pedirlos por id_empresa.
	const dataIngresosxFecha = dataIngresosxFechaProp ?? dataIngresosxFechaFetched;
	useEffect(() => {
		if (!dataIngresosxFechaProp) {
			obtenerIngresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	const alter = generarMesYanio(
				arrayDates[0], arrayDates[1]
			).map(e=>{
				const dataIngresos = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return {
					sumaIngresos: dataIngresos
				}
			})
	const alterMesCompleto = generarMesYanio(
				arrayDates[0], arrayDates[1]
			).map(e=>{
				const dataIngresos = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => Number(f.mes) === Number(e.mes))
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return {
					sumaIngresos: dataIngresos
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && alter.map((e) => {
				return (
					<td className='text-center'>
						{
							anio!==2020 && (
								<NumberFormatMoney
									className={`${className}`}
									amount={e.sumaIngresos}
								/>
							)
						}
					</td>
				);
			})}
			<td className={classNameTotal}>
				<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
					amount={alterMesCompleto.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
			</td>
			<td className={classNameTotal}>
				{
					anio!==2020 ? (
						<NumberFormatMoney
									className=''
									style={{fontSize: fontSizeTotal(className, anio)}}
							amount={alterMesCompleto.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio)}
						/>
					):(
						<>-</>
					)
				}
			</td>
		</tr>
	);
};


export const TrItemEgresos = ({ label = '', anio=2024, arrayFechas = [], onOpenModalDataItems, arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='',
	dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched } = useFlujoCaja();
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched;
	useEffect(() => {
		if (!dataGastosxFechaProp) {
			obtenerEgresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	const alter = generarMesYanio(
				arrayDates[0], arrayDates[1]
			).map(e=>{
				const dataIngresos = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								
				return {
					sumaIngresos: dataIngresos?.reduce((total, item) => total + item.monto, 0),
					data: dataIngresos
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && alter.map((e) => {
				return (
					<td className='text-center'>
						<div onClick={()=>onOpenModalDataItems?.(e.data)}>
							{
								anio!==2020 && (
										<NumberFormatMoney
											className={`${className} text-change`}
											amount={-e.sumaIngresos}
										/>
								)
							}
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div onClick={()=>onOpenModalDataItems?.(alter.flatMap(e=>e.data ?? []))}>
				<NumberFormatMoney
							className='text-change'
							style={{fontSize: fontSizeTotal(className, anio)}}
					amount={-alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
				</div>
			</td>
			<td className={classNameTotal}>
				{
					anio!==2020?(<>
					<NumberFormatMoney
								className='text-change'
								style={{fontSize: fontSizeTotal(className, anio)}}
						amount={-(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio))}
					/>
					</>):(<>-</>)
				}
			</td>
		</tr>
	);
};

export const TrItemUtilidad = ({ label = '', anio=2024, arrayFechas = [], id_empresa = 0, classNameTotal='', className='',
	dataIngresosxFecha: dataIngresosxFechaProp, dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched, obtenerIngresosxFecha, dataIngresosxFecha: dataIngresosxFechaFetched } = useFlujoCaja();
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched;
	const dataIngresosxFecha = dataIngresosxFechaProp ?? dataIngresosxFechaFetched;
	useEffect(() => {
		if (!dataGastosxFechaProp) {
			obtenerEgresosxFecha(id_empresa, arrayFechas);
		}
		if (!dataIngresosxFechaProp) {
			obtenerIngresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	// Se calcula el arreglo mensual primero (igual que TrItemVentas/TrItemEgresos)
	// y el total anual sale de sumarlo, en vez de buscar un grupo por id fijo
	// (ej. id===112): ese id es la fila de "INGRESOS" de UNA empresa puntual en
	// la BD, no un código compartido entre las 4 empresas, así que con datos
	// consolidados solo agarraba la utilidad de una de ellas.
	const alter = generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map(e=>{
				const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0) ?? 0
				const egresosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0) ?? 0
				return { ingresosxMes, egresosxMes }
			})
	const ingresos = alter.reduce((total, m) => total + m.ingresosxMes, 0)
	const egresos = alter.reduce((total, m) => total + m.egresosxMes, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa}  text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && alter.map((m) => {
				const utilidadxMes = m.ingresosxMes - m.egresosxMes
				return (
					<td className='text-center'>
						<div className={`${(utilidadxMes>=0)?'text-black':'text-change'}`}>
							{
								anio!==2020 && (
									<NumberFormatMoney
									className={`${className}`}
										amount={utilidadxMes}
									/>
								)
							}
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div className={`${((ingresos-egresos)>0)?'text-black':'text-change'}`}>
					<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
						amount={ingresos-egresos}
					/>
				</div>
			</td>
			<td className={classNameTotal}>
				<div className={`${((ingresos-egresos)>0)?'text-black':'text-change'}`}>
					{
						anio!==2020 ? (
							<>
							<NumberFormatMoney
									className=''
									style={{fontSize: fontSizeTotal(className, anio)}}
								amount={(ingresos-egresos)/anioCantidad(anio)}
							/>
							</>
						):(<>-</>)
					}
				</div>
			</td>
		</tr>
	);
};


export const TrItemEgresosNoPagados = ({ label = '', anio=2024, arrayFechas = [], onOpenModalDataItems, arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='',
	dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched } = useFlujoCaja();
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched;
	useEffect(() => {
		if (!dataGastosxFechaProp) {
			obtenerEgresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	const alter = generarMesYanio(
				arrayDates[0], arrayDates[1]
			).map(e=>{
				const dataIngresos = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								.filter(f=>f.id_estado_gasto===1424)
				return {
					sumaIngresos: dataIngresos?.reduce((total, item) => total + item.monto, 0),
					data: dataIngresos
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && alter.map((e) => {
				return (
					<td className='text-center'>
						<div onClick={()=>onOpenModalDataItems?.(e.data)}>
							{
								anio!==2020 && (
										<NumberFormatMoney
											className={`${className} text-change`}
											amount={-e.sumaIngresos}
										/>
								)
							}
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div onClick={()=>onOpenModalDataItems?.(alter.flatMap(e=>e.data ?? []))}>
				<NumberFormatMoney
							className='text-change'
							style={{fontSize: fontSizeTotal(className, anio)}}
					amount={-alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
				</div>
			</td>
			<td className={classNameTotal}>
				{
					anio!==2020 ? (<>
						<NumberFormatMoney
									className='text-change'
									style={{fontSize: fontSizeTotal(className, anio)}}
							amount={-(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio))}
						/>
					</>): (<>-</>)
				}
			</td>
		</tr>
	);
};



export const TrItemInventario = ({ label = '', anio=2024, arrayFechas = [], onOpenModalDataItems, arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='',
	dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched } = useFlujoCaja();
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched;
	useEffect(() => {
		if (!dataGastosxFechaProp) {
			obtenerEgresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	const alter = generarMesYanio(
				arrayDates[0], arrayDates[1]
			).map(e=>{
				const dataIngresos = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id===97).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								
				return {
					sumaIngresos: dataIngresos?.reduce((total, item) => total + item.monto, 0),
					data: dataIngresos
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && alter.map((e) => {
				return (
					<td className='text-center'>
						<div onClick={()=>onOpenModalDataItems?.(e.data)}>
							{
								anio!==2020 && (
										<NumberFormatMoney
											className={`${className}`}
											amount={e.sumaIngresos}
										/>
								)
							}
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div onClick={()=>onOpenModalDataItems?.(alter.flatMap(e=>e.data ?? []))}>
				<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
					amount={alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
				</div>
			</td>
			<td className={classNameTotal}>
				{
					anio!==2020 ? (<>
				<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
					amount={(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio))}
				/>
					</>): (<>-</>)
				}
			</td>
		</tr>
	);
};



export const TrItemExtraordionario = ({anio=2024, label = '', arrayFechas = [], arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='',
	dataIngresosxFecha: dataIngresosxFechaProp, dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched, obtenerIngresosxFecha, dataIngresosxFecha: dataIngresosxFechaFetched } = useFlujoCaja();
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched;
	const dataIngresosxFecha = dataIngresosxFechaProp ?? dataIngresosxFechaFetched;
	useEffect(() => {
		if (!dataGastosxFechaProp) {
			obtenerEgresosxFecha(id_empresa, arrayFechas);
		}
		if (!dataIngresosxFechaProp) {
			obtenerIngresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	// filter (no find): ver comentario equivalente en TrItemUtilidad.
	const ingresos = dataIngresosxFecha.flujoxGrupo.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.flujoxGrupo.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className='text-center'>
						<div>
							{
								anio!==2020 && (
									<NumberFormatMoney
									className={`${className}`}
										amount={ingresosxMes-egresosxMes}
									/>
								)
							}
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div>
					<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
						amount={ingresos-egresos}
					/>
				</div>
			</td>
			<td className={classNameTotal}>
				{
					anio!==2020 ? (<>
					
				<div>
					<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
						amount={(ingresos-egresos)/anioCantidad(anio)}
					/>
				</div>
					</>): (<>-</>)
				}
			</td>
		</tr>
	);
};

export const TrItemUtilidadesSuma = ({anio=2024, label = '', arrayFechas = [], arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='',
	dataIngresosxFecha: dataIngresosxFechaProp, dataGastosxFecha: dataGastosxFechaProp, ocultarMeses = false }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha: dataGastosxFechaFetched, obtenerIngresosxFecha, dataIngresosxFecha: dataIngresosxFechaFetched } = useFlujoCaja();
	const dataGastosxFecha = dataGastosxFechaProp ?? dataGastosxFechaFetched;
	const dataIngresosxFecha = dataIngresosxFechaProp ?? dataIngresosxFechaFetched;
	useEffect(() => {
		if (!dataGastosxFechaProp) {
			obtenerEgresosxFecha(id_empresa, arrayFechas);
		}
		if (!dataIngresosxFechaProp) {
			obtenerIngresosxFecha(id_empresa, arrayFechas);
		}
	}, []);
	// filter (no find): ver comentario equivalente en TrItemUtilidad.
	const ingresosBOLSA = dataIngresosxFecha.flujoxGrupo.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresosBOLSA = dataGastosxFecha.flujoxGrupo.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const ingresos = dataIngresosxFecha.flujoxGrupo.filter(f=>f.id===112).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{!ocultarMeses && generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				const ingresosxMesBOLSA = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMesBOLSA = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className='text-center'>
						{
							anio!==2020 && (
								<div className={`${(((ingresosxMesBOLSA-egresosxMesBOLSA)+(ingresosxMes-egresosxMes))>0)?'text-black':(((ingresosxMesBOLSA-egresosxMesBOLSA)+(ingresosxMes-egresosxMes))==0)?'text-black':'text-change'}`}>
									<NumberFormatMoney
									className={`${className}`}
										amount={(ingresosxMesBOLSA-egresosxMesBOLSA)+(ingresosxMes-egresosxMes)}
									/>
								</div>
							)
						}
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div className={`${(((ingresosBOLSA-egresosBOLSA)+(ingresos-egresos))>0)?'text-black':'text-change'}`}>
					<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
						amount={(ingresosBOLSA-egresosBOLSA)+(ingresos-egresos)}
					/>
				</div>
			</td>
			<td className={classNameTotal}>
				<div className={`${(((ingresosBOLSA-egresosBOLSA)+(ingresos-egresos))>0)?'text-black':'text-change'}`}>
					{
					anio!==2020 ? (<>
					
				<div>
					<NumberFormatMoney
							className=''
							style={{fontSize: fontSizeTotal(className, anio)}}
						amount={((ingresosBOLSA-egresosBOLSA)+(ingresos-egresos))/anioCantidad(anio)}
					/>
				</div>
					</>): (<>-</>)
				}
				</div>
			</td>
		</tr>
	);
};
// "Hoy" en hora peruana (UTC-5 fijo), no en la zona horaria del entorno donde
// corra el código — evita que el mes/día se adelante cerca de la medianoche
// UTC (7pm-12am hora Perú).
const { anioActual, mesActual } = obtenerAnioMesDiaActualPeru()
// TOTAL ACUMULADO (2024-2026, sentinels anio=2020 y anio=9999): los años ya
// cerrados (2024 y 2025) aportan 12 meses cada uno; el año en curso solo
// aporta los meses ya cerrados (mesActual-1), sin contar el mes actual que
// todavía no tiene el mes completo.
const MESES_ACUMULADO_ANIO_EN_CURSO = (anioActual - 2024) * 12 + (mesActual - 1)
const anioCantidad = (anio=2024)=>{
	switch (anio) {
		case anioActual:
			return mesActual;
		case 2024:
			return 4;
		case 2023:
			return 7;
		case 2020:
		case 9999:
			return MESES_ACUMULADO_ANIO_EN_CURSO;
		default:
			return 12;
	}
}