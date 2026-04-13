import React, { useEffect } from 'react';
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const TrItemVentas = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				return (
					<td className='text-center'>
						<NumberFormatMoney
							className={`${className}`}
							amount={dataIngresosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA ACTIVOS').flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)}
						/>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<NumberFormatMoney
							className='fs-1'
					amount={dataIngresosxFecha[0]?.items
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
			</td>
		</tr>
	);
};


export const TrItemEgresos = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
	}, []);
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				const gastoMonto = dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA ACTIVOS')
								.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className='text-center'>
						<NumberFormatMoney
							className={`${gastoMonto===0?'':'text-change'} ${className}`}
							amount={-gastoMonto}
						/>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<NumberFormatMoney
							className='fs-1 text-change'
					amount={-dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA ACTIVOS').flatMap((f) => f.items)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
			</td>
		</tr>
	);
};

export const TrItemUtilidad = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);
	const ingresos = dataIngresosxFecha[0]?.items
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA ACTIVOS').flatMap((f) => f.items)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				const ingresosxMes = dataIngresosxFecha.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				const egresosxMes = dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA ACTIVOS')
								.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className={`text-center`}>
						<div className={`${((ingresosxMes-egresosxMes)>0)?'text-ISESAC':((ingresosxMes-egresosxMes)==0)?'text-black':'text-change'}`}>
							<NumberFormatMoney
							className={`${className}`}
								amount={ingresosxMes-egresosxMes}
							/>
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div className={`${((ingresos-egresos)>0)?'text-ISESAC':'text-change'}`}>
					<NumberFormatMoney
							className='fs-1'
						amount={ingresos-egresos}
					/>
				</div>
			</td>
		</tr>
	);
};



export const TrItemInventario = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='', className='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
	}, []);
	console.log({dataGastosxFecha});
	
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				const gastoMonto = dataGastosxFecha.filter((f)=>f.grupo=='COMPRA ACTIVOS')
								.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className='text-center'>
						<NumberFormatMoney
							className={`${gastoMonto===0?'':''} ${className}`}
							amount={gastoMonto}
						/>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<NumberFormatMoney
							className='fs-1'
					amount={dataGastosxFecha.filter((f)=>f.grupo=='COMPRA ACTIVOS').flatMap((f) => f.items)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
			</td>
		</tr>
	);
};