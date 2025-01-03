import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap'

export const ModalItems = ({show, onHide, data, labelNam}) => {
    console.log(data, "data modalll");
    
  return (
    <Dialog header={labelNam} visible={show} onHide={onHide}>

        <Table>
        <thead>
						<tr>
							<th>Product</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>ASOS Ridley High Waist</td>
							<td>$79.49</td>
							<td>
								<span className="badge bg-primary">82 Pcs</span>
							</td>
							<td>$6,518.18</td>
						</tr>
						<tr>
							<td>Marco Lightweight Shirt</td>
							<td>$128.50</td>
							<td>
								<span className="badge bg-primary">37 Pcs</span>
							</td>
							<td>$4,754.50</td>
						</tr>
						<tr>
							<td>Half Sleeve Shirt</td>
							<td>$39.99</td>
							<td>
								<span className="badge bg-primary">64 Pcs</span>
							</td>
							<td>$2,559.36</td>
						</tr>
						<tr>
							<td>Lightweight Jacket</td>
							<td>$20.00</td>
							<td>
								<span className="badge bg-primary">184 Pcs</span>
							</td>
							<td>$3,680.00</td>
						</tr>
						<tr>
							<td>Marco Shoes</td>
							<td>$28.49</td>
							<td>
								<span className="badge bg-primary">69 Pcs</span>
							</td>
							<td>$1,965.81</td>
						</tr>
					</tbody>
        </Table>
    </Dialog>
  )
}
