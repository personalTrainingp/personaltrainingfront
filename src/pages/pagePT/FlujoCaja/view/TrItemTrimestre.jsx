import React, { useEffect } from 'react';
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const TrItemVentas = ({ label = '', anio=2024,
	arrayFechas = [], arrayFechaAnterior=[],
	mesDiaDesde,
	mesDiaDespues, id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	const { obtenerIngresosxFecha:obtenerIngresosxFechaAnterior, dataIngresosxFecha:dataIngresosxFechaAnterior } = useFlujoCaja();
	useEffect(() => {
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, [id_empresa, arrayFechas]);
	useEffect(() => {
		obtenerIngresosxFechaAnterior(id_empresa, arrayFechaAnterior)
	}, [id_empresa, arrayFechaAnterior])
	
	const alter = generarMesYanio(
				new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
			).map(e=>{
				const dataIngresos = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const dataIngresosAnterior = dataIngresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return {
					sumaIngresos: dataIngresos,
					dataIngresosAnterior
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{alter.map((e) => {
				return (
					<>
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
					<td className='text-center'>
						{
							anio!==2020 && (
								<NumberFormatMoney
									className={`${className}`}
									amount={(e.sumaIngresos*100)/(e.dataIngresosAnterior)-100>0?(e.sumaIngresos*100)/(e.dataIngresosAnterior)-100:0}
								/>
							)
						}
					</td>
					</>
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
					amount={alter.reduce((total, item)=>total+item.sumaIngresos, 0)/3}
				/>
			</td>
		</tr>
	);
};


export const TrItemEgresos = ({ label = '', anio=2024, arrayFechas = [], arrayFechaAnterior=[], onOpenModalDataItems,mesDiaDesde,
	mesDiaDespues, id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	const { obtenerIngresosxFecha:obtenerIngresosxFechaAnterior, obtenerEgresosxFecha:obtenerEgresosxFechaAnterior, dataGastosxFecha:dataEgresosxFechaAnterior, dataIngresosxFecha:dataIngresosxFechaAnterior } = useFlujoCaja();

	useEffect(() => {
		obtenerEgresosxFechaAnterior(id_empresa, arrayFechaAnterior)
	}, [id_empresa, arrayFechaAnterior])
	
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
	}, []);
	const alter = generarMesYanio(
				new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
			).map(e=>{
				const dataIngresos = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
				const dataIngresosAnterior = dataEgresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
								
				return {
					sumaIngresos: dataIngresos?.reduce((total, item) => total + item.monto, 0),
					data: dataIngresos,
					dataIngresosAnterior
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{alter.map((e) => {
				return (
					<>
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
					<td>
						{
							anio!==2020 && (
									<NumberFormatMoney
										className={`${className} text-change`}
										amount={((e.sumaIngresos*100)/e.dataIngresosAnterior)-100>0?((e.sumaIngresos*100)/e.dataIngresosAnterior)-100:0}
									/>
							)
						}
					</td>
					</>
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
					amount={-(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/3)}
				/>
			</td>
		</tr>
	);
};

export const TrItemUtilidad = ({ label = '', anio=2024, arrayFechas = [], arrayFechaAnterior=[], mesDiaDesde,
	mesDiaDespues, id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	const { obtenerIngresosxFecha:obtenerIngresosxFechaAnterior, obtenerEgresosxFecha:obtenerEgresosxFechaAnterior, dataGastosxFecha:dataEgresosxFechaAnterior, dataIngresosxFecha:dataIngresosxFechaAnterior } = useFlujoCaja();

	useEffect(() => {
		obtenerIngresosxFechaAnterior(id_empresa, arrayFechaAnterior)
		obtenerEgresosxFechaAnterior(id_empresa, arrayFechaAnterior)
	}, [id_empresa, arrayFechaAnterior])
	
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
				new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`),
				new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
			).map((e) => {
				const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const ingresosxMesAnioAnterior = dataIngresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMesAnioAnterior = dataEgresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<>
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
						<td className={`text-center`}>
							<div className={`${((ingresosxMesAnioAnterior-egresosxMesAnioAnterior)>0)?'text-black':((ingresosxMesAnioAnterior-egresosxMesAnioAnterior)==0)?'text-black':'text-change'}`}>
								{
									anio!==2020 && (
										<NumberFormatMoney
										className={`${className}`}
											amount={(((ingresosxMes-egresosxMes)*100/(ingresosxMesAnioAnterior-egresosxMesAnioAnterior))-100)>0?(((ingresosxMes-egresosxMes)*100/(ingresosxMesAnioAnterior-egresosxMesAnioAnterior))-100):0}
										/>
									)
								}
							</div>
						</td>
					</>
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
						amount={(ingresos-egresos)/3}
					/>
				</div>
			</td>
		</tr>
	);
};

export const TrItemInventario = ({ label = '', anio=2024, arrayFechas = [], arrayFechaAnterior=[], mesDiaDesde,
	mesDiaDespues, onOpenModalDataItems, id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	const { obtenerEgresosxFecha:obtenerIngresosxFechaAnterior, dataGastosxFecha:dataIngresosxFechaAnterior } = useFlujoCaja();

	useEffect(() => {
		obtenerIngresosxFechaAnterior(id_empresa, arrayFechaAnterior)
	}, [id_empresa, arrayFechaAnterior])
	
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
	}, []);
	const alter = generarMesYanio(
				new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
			).map(e=>{
				const dataEgresos = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id===97).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								
				const dataEgresosAnterior = dataIngresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id===97).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								
				return {
					sumaIngresos: dataEgresos?.reduce((total, item) => total + item.monto, 0),
					data: dataEgresos,
					sumaEgresosAnterior: dataEgresosAnterior?.reduce((total, item) => total + item.monto, 0)
				}
			})
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{alter.map((e) => {
				return (
					<>
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
					<td>
						{
								anio!==2020 && (
										<NumberFormatMoney
											className={`${className}`}
											amount={e.sumaEgresosAnterior}
										/>
								)
							}
					</td>
					</>
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
					amount={(alter.reduce((total, item)=>total+item.sumaIngresos, 0)/3)}
				/>
			</td>
		</tr>
	);
};

export const TrItemExtraordionario = ({anio=2024, label = '', arrayFechas = [], arrayFechaAnterior=[], mesDiaDesde,
	mesDiaDespues, id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	const { obtenerIngresosxFecha:obtenerIngresosxFechaAnterior, dataIngresosxFecha:dataIngresosxFechaAnterior, obtenerEgresosxFecha:obtenerEgresosxFechaAnterior, dataEgresosxFecha:dataEgresosxFechaAnterior } = useFlujoCaja();

	useEffect(() => {
		obtenerIngresosxFechaAnterior(id_empresa, arrayFechaAnterior)
		obtenerEgresosxFechaAnterior(id_empresa, arrayFechaAnterior)
	}, [id_empresa, arrayFechaAnterior])
	
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
				new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`),
				new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
			).map((e) => {
				const ingresosxMes = dataIngresosxFecha.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMes = dataGastosxFecha.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const ingresosxMesAnterior = dataIngresosxFechaAnterior?.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMesAnterior = dataEgresosxFechaAnterior?.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<>
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
						<td className={`text-center`}>
							<div>
								{
									anio!==2020 && (
										<NumberFormatMoney
										className={`${className}`}
											amount={ingresosxMesAnterior-egresosxMesAnterior}
										/>
									)
								}
							</div>
						</td>
					</>
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
						amount={(ingresos-egresos)/3}
					/>
				</div>
			</td>
		</tr>
	);
};

export const TrItemUtilidadesSuma = ({anio=2024, label = '', arrayFechas = [], arrayFechaAnterior=[], mesDiaDesde,
	mesDiaDespues,  id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	const { obtenerIngresosxFecha:obtenerIngresosxFechaAnterior, dataIngresosxFecha:dataIngresosxFechaAnterior, obtenerEgresosxFecha:obtenerEgresosxFechaAnterior, dataEgresosxFecha:dataEgresosxFechaAnterior } = useFlujoCaja();

	useEffect(() => {
		obtenerIngresosxFechaAnterior(id_empresa, arrayFechaAnterior)
		obtenerEgresosxFechaAnterior(id_empresa, arrayFechaAnterior)
	}, [id_empresa, arrayFechaAnterior])
	
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
				new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`),
				new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
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
								
				const ingresosxMesBOLSAAnioAnterior = dataIngresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMesBOLSAAnioAnterior = dataEgresosxFechaAnterior?.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMesAnioAnterior = dataEgresosxFechaAnterior?.flujoxGrupo?.filter(f=>f.id!==97 && f.id!==153 && f.id!==103 && f.grupo!=="TARJETA CREDITO VISA BBVA"&& f.id!==150).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const ingresosxMesAnioAnterior = dataIngresosxFechaAnterior.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
						<>
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
							<td className={`text-center`}>
									{
										anio!==2020 && (
											<div className={`${(((ingresosxMesBOLSAAnioAnterior-egresosxMesBOLSAAnioAnterior)+(ingresosxMesAnioAnterior-egresosxMesAnioAnterior))>0)?'text-black':(((ingresosxMesBOLSAAnioAnterior-egresosxMesBOLSAAnioAnterior)+(ingresosxMesAnioAnterior-egresosxMesAnioAnterior))==0)?'text-black':'text-change'}`}>
												<NumberFormatMoney
												className={`${className}`}
													amount={(ingresosxMesBOLSAAnioAnterior-egresosxMesBOLSAAnioAnterior)+(ingresosxMesAnioAnterior-egresosxMesAnioAnterior)}
												/>
											</div>
										)
									}
							</td>
						</>
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
						amount={((ingresosBOLSA-egresosBOLSA)+(ingresos-egresos))/3}
					/>
				</div>
			</td>
		</tr>
	);
};