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
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-white fs-2`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				return (
					<td className=''>
						<NumberFormatMoney
							amount={dataIngresosxFecha.flatMap((f) => f.items)
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


export const TrItemEgresos = ({ label = '', arrayFechas = [], id_empresa = 0 }) => {
	const { obtenerEgresosxFecha, dataGastosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerEgresosxFecha(id_empresa, arrayFechas);
	}, []);
	console.log({dataGastosxFecha: dataGastosxFecha.flatMap((f) => f.items).sort((a, b)=>a.mes-b.mes).map(m=>{
		return {
			...m,
			total: m.items.reduce((total, item)=>item.monto+ total, 0)
		}
	}), arrayFechas});
	
	return (
		<tr>
			<td className={`border-left-10 border-right-10 sticky-td-${id_empresa}`}>{label}</td>
			{generarMesYanio(
				new Date(arrayFechas[0]),
				new Date(arrayFechas[1])
			).map((e) => {
				return (
					<td>
						<NumberFormatMoney
							amount={dataGastosxFecha.flatMap((f) => f.items)
								?.filter((f) => f.mes === e.mes && f.anio === e.anio)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)}
						/>
					</td>
				);
			})}
			<td>
				<NumberFormatMoney
					amount={dataGastosxFecha.flatMap((f) => f.items)
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
			</td>
		</tr>
	);
};
