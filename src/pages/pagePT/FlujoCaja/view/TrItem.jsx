import React, { useEffect } from 'react';
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const TrItemVentas = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='' }) => {
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
							amount={dataIngresosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA PRODUCTOS/ACTIVOS').flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)}
						/>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<NumberFormatMoney
					amount={dataIngresosxFecha[0]?.items
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
			</td>
		</tr>
	);
};


export const TrItemEgresos = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='' }) => {
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
				return (
					<td className='text-center'>
						<NumberFormatMoney
							amount={dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA PRODUCTOS/ACTIVOS')
								.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)}
						/>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<NumberFormatMoney
					amount={dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA PRODUCTOS/ACTIVOS').flatMap((f) => f.items)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
			</td>
		</tr>
	);
};

export const TrItemUtilidad = ({ label = '', arrayFechas = [], id_empresa = 0, classNameTotal='' }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha, obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);
	const ingresos = dataIngresosxFecha[0]?.items
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)
	const egresos = dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA PRODUCTOS/ACTIVOS').flatMap((f) => f.items)
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
				const egresosxMes = dataGastosxFecha.filter((f)=>f.grupo!=='PRESTAMOS A TERCEROS'&& f.grupo!=='COMPRA PRODUCTOS/ACTIVOS')
								.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)
				return (
					<td className={`text-center`}>
						<div className={`${((ingresosxMes-egresosxMes)>0)?'text-ISESAC':'text-change'}`}>
							<NumberFormatMoney
								amount={ingresosxMes-egresosxMes}
							/>
						</div>
					</td>
				);
			})}
			<td className={classNameTotal}>
				<div className={`${((ingresos-egresos)>0)?'text-ISESAC':'text-change'}`}>
					<NumberFormatMoney
						amount={ingresos-egresos}
					/>
				</div>
			</td>
		</tr>
	);
};
