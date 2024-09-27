import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { ItemPago } from './ItemPago'
import { Table } from 'react-bootstrap'
import { GraficoPago } from './GraficoPago'
import { Loading } from '@/components/Loading'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { DateMask, MoneyFormatter } from '@/components/CurrencyMask'
function sumarMontosPorMoneda(data, tipoMoneda) {
	return data
	  .reduce((total, item) => total + item.monto, 0); // Suma los montos
  }
export const ModalReportePagos = ({monto, codigo_pago, nombre_prov, tipo_moneda, onHide, show}) => {
	const { obtenerEgresosPorCodigoProv, gastosxContratoProv } = useProveedorStore()
	useEffect(() => {
		if(codigo_pago!=='' && codigo_pago!==null){
			obtenerEgresosPorCodigoProv(codigo_pago, tipo_moneda)
		}
	}, [codigo_pago, tipo_moneda])
  return (
		<>
			{
				<Dialog
					header={`Pagos del #${codigo_pago} - ${nombre_prov}`}
					onHide={onHide}
					visible={show}
					position="right"
					style={{ height: '100rem', width: '60rem' }}
				>
					{codigo_pago == 0 ? (
						<>
						Cargando...
						</>
					) : (
						<>
							<GraficoPago abono={sumarMontosPorMoneda(gastosxContratoProv)} saldo={monto-sumarMontosPorMoneda(gastosxContratoProv)}/>
							<h2>
								SALDO: <MoneyFormatter symbol={tipo_moneda=='PEN'?'S/. ':'$ '} amount={monto-sumarMontosPorMoneda(gastosxContratoProv)}/>
							</h2>
							<h2>
								ABONADO: <MoneyFormatter symbol={tipo_moneda=='PEN'?'S/. ':'$ '} amount={sumarMontosPorMoneda(gastosxContratoProv)}/>
							</h2>
							<Table responsive className="table-centered mb-0">
								<thead>
									<tr>
										<th scope="col">ID</th>
										<th scope="col">Fecha de comprobante</th>
										<th scope="col">Fecha de pago</th>
										<th scope="col">N operacion</th>
										<th scope="col">Monto</th>
										<th scope="col">Observacion</th>
									</tr>
								</thead>
								<tbody>
									{
										gastosxContratoProv?.map((gasto) => (
											<tr key={gasto.id}>
												<td>
													{gasto.id}
												</td>
												<td>
													<DateMask date={gasto.fec_comprobante} format={'dddd D [de] MMMM [del] YYYY'}/>
												</td>
												<td>
													<DateMask date={gasto.fec_pago} format={'dddd D [de] MMMM [del] YYYY'}/>
												</td>
												<td>{gasto.n_operacion}</td>
												<td><MoneyFormatter amount={gasto.monto} symbol={gasto.moneda=='PEN'?'S/. ':'$ '}/></td>
												<td>{gasto.descripcion}</td>
											</tr>
                                        )) || []
									}
								</tbody>
							</Table>
						</>
					)}
				</Dialog>
			}
		</>
  );
}
