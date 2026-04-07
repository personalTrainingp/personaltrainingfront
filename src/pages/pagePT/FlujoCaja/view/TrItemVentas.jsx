import React, { useEffect } from 'react';
import { useFlujoCaja } from '../hook/useFlujoCajaStore';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const TrItemVentas = ({ label = '', arrayFechas = [], id_empresa = 0 }) => {
	const { obtenerIngresosxFecha, dataIngresosxFecha } = useFlujoCaja();
	useEffect(() => {
		obtenerIngresosxFecha(id_empresa, arrayFechas);
	}, []);

	console.log({
		dataIngresosgen: dataIngresosxFecha[0]?.items
			.filter((f) => f.mes === 4)
			.flatMap((f) => f.items),
	});
	return (
		<tr>
			<td className={`sticky-td-${id_empresa}`}>{label}</td>
			{generarMesYanio(
				new Date('2024-01-01 15:45:47.6640000 +00:00'),
				new Date('2024-12-31 15:45:47.6640000 +00:00')
			).map((e) => {
				return (
					<td>
						<NumberFormatMoney
							amount={dataIngresosxFecha[0]?.items
								?.filter((f) => f.mes === e.mes)
								.flatMap((f) => f.items)
								?.reduce((total, item) => total + item.monto, 0)}
						/>
					</td>
				);
			})}
			<td>
				<NumberFormatMoney
					amount={dataIngresosxFecha[0]?.items
						?.flatMap((f) => f.items)
						?.reduce((total, item) => total + item.monto, 0)}
				/>
				{/*
				 */}
			</td>
		</tr>
	);
};
