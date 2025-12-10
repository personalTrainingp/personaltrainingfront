import React from 'react'
import { Table } from 'react-bootstrap'

export const TableVentas = ({data, background, bgTotal, mesesSeleccionadosNums, mesesNombres}) => {
  return (
    <Table>
        <thead className={background}>
						<tr>
							<th className=" fs-1">
								<div
									className={`p-1 rounded rounded-3 ${bgTotal}`}
									style={{
									width: 450,
									hyphens: 'auto',
									wordBreak: 'break-word',
									overflowWrap: 'break-word',
									whiteSpace: 'normal',
									lineHeight: '1.2',
									}}
									
									lang="es" // Importante para la división correcta de palabras
								>
                                    VENTAS
								</div>
								</th>

							{mesesSeleccionadosNums.map(mesNum => (
							<th
								key={mesNum}
								className="text-white text-center p-1 fs-2"
							>
								{mesesNombres[mesNum - 1]}
							</th>
							))}

							<th className={`${bgTotal} text-center p-1 fs-1`}>
							TOTAL
							</th>
							<th className="text-white text-center p-1 fs-1">
							%
							</th>
						</tr>
						</thead>
                        <tbody>
                            <tr>
                                
                            </tr>
                        </tbody>
    </Table>
  )
}
