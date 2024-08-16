import { MoneyFormatter } from '@/components/CurrencyMask';
import React, { useEffect } from 'react'
import { Card, ProgressBar } from 'react-bootstrap'

export const SemanasxPrograma = ({data}) => {
	// useEffect(() => {
	// 	if(data==undefined) return;
	// }, [data])
	// const newData = data.map(e=>e.items)
	// data = data.map(e=>{
	// 	return e.items.map(e=>{
	// 		return {
	// 			tarifa_monto: e.tarifa_monto
	// 		}
	// 	})
	// })
	
	console.log(data);
	// data = data.map(e=>{
	// 	re
	// })
	const sumaItemsLength = data.reduce((total, element) => {
		return total + element.items.length;
	}, 0);
	const sumaItemsTotal_monto = data.reduce((total, element) => {
		return total + element.items.reduce((acc, item) => {
			return acc + item.tarifa_monto;
		}, 0);
	}, 0);
	console.log(sumaItemsTotal_monto);
  return (
    <div>
        <Card>
			<table className="table table-bordered table-centered mb-0">
				<thead className="table-light">
					<tr>
						<th>SEMANAS</th>
						<th>CANTIDAD</th>
						<th>MONTO VENTAS BRUTAS</th>
						<th>TICKET MEDIO</th>
					</tr>
				</thead>
				<tbody>
					{
						data.map(e=>(
							<tr>
							<td>{e.semana} semanas</td>
							<td>
								<div className="progress-w-percent mb-0">
									<span class="w-100 progress-value">{e.items.length} ({(e.items.length/sumaItemsLength)*100}%)</span>
									<ProgressBar animated now={(e.items.length/sumaItemsLength)*100} className="progress-sm" style={{backgroundColor: '#00000042', height: '15px', width: '100%'}} variant="orange" />
								</div>
							</td>
							<td>
								<div className="progress-w-percent mb-0">
									<span class="w-100 progress-value"><MoneyFormatter amount={e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)}/> ({((e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/sumaItemsTotal_monto)*100).toFixed(2)}%)</span>
									<ProgressBar animated now={((e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/sumaItemsTotal_monto)*100).toFixed(2)} className="progress-sm" style={{backgroundColor: '#00000042', height: '15px', width: '100%'}} variant="orange" />
								</div>
							</td>
							<td>
								<MoneyFormatter amount={(e.items.reduce((suma, item) => suma + item.tarifa_monto, 0)/e.items.length)}/>
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
