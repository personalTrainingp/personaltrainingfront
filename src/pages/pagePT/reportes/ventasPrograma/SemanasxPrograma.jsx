import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import React, { useEffect } from 'react'
import { Card, ProgressBar } from 'react-bootstrap'

export const SemanasxPrograma = ({data}) => {
	data =data.reduce((acc, { semana, items }) => {
		const existing = acc.find(group => group.semana === semana);
		if (existing) {
		  existing.items.push(...items);
		} else {
		  acc.push({ semana, items: [...items] });
		}
		return acc;
	  }, []);
	const sumaItemsLength = data.reduce((total, element) => {
		return total + element.items.length;
	}, 0);
	const sumaItemsTotal_monto = data.reduce((total, element) => {
		return total + element.items.reduce((acc, item) => {
			return acc + item.tarifa_monto;
		}, 0);
	}, 0);
	data = data.map(i=>{
		return {
            ...i,
			cantidad: i.items.length
        }
	}).sort((a, b) => b.cantidad - a.cantidad);	
  return (
    <div>
        <Card>
			<table className="table table-bordered table-centered mb-0">
				<thead className="table-light">
					<tr>
						<th className='text-primary font-bold font-20'>RANKING DE SEMANAS VENDIDAS</th>
						<th>CANTIDAD</th>
						<th>MONTO VENTA BRUTA</th>
						<th>TICKET MEDIO</th>
					</tr>
				</thead>
				<tbody>
					{
						data.map(e=>(
							<tr>
							<td className='text-primary font-bold font-20'>{e.semana} semanas</td>
							<td>
								<div className="progress-w-percent mb-0">
									<span className='d-flex justify-content-between'>
										<span className="progress-value" style={{textAlign: 'right'}}>{e.items.length}</span>
										<span className="w-50 progress-value">({((e.items.length/sumaItemsLength)*100).toFixed(2)}%)</span>
									</span>
									<ProgressBar animated now={(e.items.length/sumaItemsLength)*100} className="progress-sm" style={{backgroundColor: '#00000042', height: '15px', width: '100%'}} variant="orange" />
								</div>
							</td>
							<td>
								<div className="progress-w-percent mb-0">
									<span className="w-50 progress-value">({((e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/sumaItemsTotal_monto)*100).toFixed(2)}%)</span>
									<div className='d-flex flex-row justify-content-center'>
										<span>S/.</span>
										<span className="w-50 progress-value text-right"><NumberFormatMoney amount={e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)}/></span>
									</div>
									<ProgressBar animated now={((e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/sumaItemsTotal_monto)*100).toFixed(2)} className="progress-sm" style={{backgroundColor: '#00000042', height: '15px', width: '100%'}} variant="orange" />
								</div>
							</td>
							<td>
								<div className='w-100 text-right' style={{width: '100% !important'}}>
									<div className='d-flex flex-row justify-content-center'>
											<span>S/.</span>
											{/* <MoneyFormatter amount={(e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/e.items.length)}/> */}
											<span className="w-50 progress-value text-right"><NumberFormatMoney amount={(e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/e.items.length)}/></span>
									</div>
								</div>
							</td>
						</tr>
						))
					}
				</tbody>
			</table>
        </Card>
    </div>
  )
}
