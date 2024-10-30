import { DateMask, FormatoDateMask, MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect } from 'react'
import { Card, ProgressBar } from 'react-bootstrap'

export const VentasxDistritos = ({data}) => {
	console.log(data);
	
  return (
    <div>
        <Card>
            <TabView>
				{
					data.map(d=>(
							<TabPanel header={<>{d.nombre_distrito} - {d.items.length} SOCIOS</>}>
						<table className="table table-bordered table-centered mb-0">
							<thead className="table-light">
								<tr>
									<th className='text-primary font-bold font-20'>SOCIOS</th>
									{/* <th>TIPO</th> */}
									<th>PROGRAMA | SESIONES</th>
								</tr>
							</thead>
							<tbody>
								{
									d.items.map(i=>(
										<tr>
											<td>{i.tb_cliente.nombres_apellidos_cli}</td>
											<td>{i.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm} | {i.detalle_ventaMembresia[0].tb_semana_training.sesiones} SESIONES </td>
										</tr>
									))
								}
							</tbody>
						</table>
							</TabPanel>
					))
				}
            </TabView>
        </Card>
    </div>
  )
}
