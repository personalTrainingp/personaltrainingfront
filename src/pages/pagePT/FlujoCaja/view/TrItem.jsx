import React, { useEffect } from 'react';
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const TrItemVentas = ({ label = '', anio=2024,
	arrayFechas = [], 
	arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerIngresosxFecha(id_empresa, arrayFechas);
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
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{alter.map((e) => {
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
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
			</td>
			<td className={classNameTotal}>
				<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio)}
				/>
			</td>
		</tr>
	);
};


export const TrItemEgresos = ({ label = '', anio=2024, arrayFechas = [], onOpenModalDataItems, arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
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
			{alter.map((e) => {
				return (
					<td className='text-center'>
						<div onClick={()=>onOpenModalDataItems(e.data)}>
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
				<NumberFormatMoney
							className='text-change'
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={-alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
			</td>
			<td className={classNameTotal}>
				<NumberFormatMoney
							className='text-change'
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={-(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio))}
				/>
			</td>
		</tr>
	);
};

export const TrItemUtilidad = ({ label = '', anio=2024, arrayFechas = [], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);
	const ingresos = dataIngresosxFecha.flujoxGrupo.find(f=>f.id===112)?.itemsxDia
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className={`text-center`}>
						<div className={`${((ingresosxMes-egresosxMes)>0)?'text-black':((ingresosxMes-egresosxMes)==0)?'text-black':'text-change'}`}>
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
				<div className={`${((ingresos-egresos)>0)?'text-black':'text-change'}`}>
					<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
						amount={ingresos-egresos}
					/>
				</div>
			</td>
			<td className={classNameTotal}>
				<div className={`${((ingresos-egresos)>0)?'text-black':'text-change'}`}>
					<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
						amount={(ingresos-egresos)/anioCantidad(anio)}
					/>
				</div>
			</td>
		</tr>
	);
};


export const TrItemEgresosNoPagados = ({ label = '', anio=2024, arrayFechas = [], onOpenModalDataItems, arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
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
			{alter.map((e) => {
				return (
					<td className='text-center'>
						<div onClick={()=>onOpenModalDataItems(e.data)}>
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
				<NumberFormatMoney
							className='text-change'
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={-alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
			</td>
			<td className={classNameTotal}>
				<NumberFormatMoney
							className='text-change'
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={-(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio))}
				/>
			</td>
		</tr>
	);
};



export const TrItemInventario = ({ label = '', anio=2024, arrayFechas = [], onOpenModalDataItems, arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
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
			{alter.map((e) => {
				return (
					<td className='text-center'>
						<div onClick={()=>onOpenModalDataItems(e.data)}>
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
				<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={alter.reduce((total, item)=>total+item.sumaIngresos, 0)}
				/>
			</td>
			<td className={classNameTotal}>
				<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
					amount={(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/anioCantidad(anio))}
				/>
			</td>
		</tr>
	);
};



export const TrItemExtraordionario = ({anio=2024, label = '', arrayFechas = [], arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);
	const ingresos = dataIngresosxFecha.flujoxGrupo.find(f=>f.id===121)?.itemsxDia
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.flujoxGrupo.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
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
					<td className={`text-center`}>
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
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
						amount={ingresos-egresos}
					/>
				</div>
			</td>
			<td className={classNameTotal}>
				<div>
					<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
						amount={(ingresos-egresos)/anioCantidad(anio)}
					/>
				</div>
			</td>
		</tr>
	);
};

export const TrItemUtilidadesSuma = ({anio=2024, label = '', arrayFechas = [], arrayDates=[new Date('2024-01-01 15:45:47.6640000 +00:00'), new Date('2024-12-31 15:45:47.6640000 +00:00')], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);
	const ingresosBOLSA = dataIngresosxFecha.flujoxGrupo.find(f=>f.id===121)?.itemsxDia
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresosBOLSA = dataGastosxFecha.flujoxGrupo.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const ingresos = dataIngresosxFecha.flujoxGrupo.find(f=>f.id===112)?.itemsxDia
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.flujoxGrupo.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
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
					<td className={`text-center`}>
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
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
						amount={(ingresosBOLSA-egresosBOLSA)+(ingresos-egresos)}
					/>
				</div>
			</td>
			<td className={classNameTotal}>
				<div className={`${(((ingresosBOLSA-egresosBOLSA)+(ingresos-egresos))>0)?'text-black':'text-change'}`}>
					<NumberFormatMoney
							className=''
							style={{fontSize: `${anio!==2020 ? '35px':'45px'}`}}
						amount={((ingresosBOLSA-egresosBOLSA)+(ingresos-egresos))/anioCantidad(anio)}
					/>
				</div>
			</td>
		</tr>
	);
};
const fechaActual = new Date()
const anioActual = fechaActual.getFullYear()
const mesActual = fechaActual.getMonth()+1
const anioCantidad = (anio=2024)=>{
	switch (anio) {
		case anioActual:
			return mesActual;
		case 2024:
			return 4;
		case 2023:
			return 7;
		default:
			return 12;
	}
}