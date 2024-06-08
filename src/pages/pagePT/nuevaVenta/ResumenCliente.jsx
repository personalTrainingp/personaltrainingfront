import { Link } from 'react-router-dom';
import avatar from '@/assets/images/users/avatar-2.jpg'


export const ResumenCliente = ({data}) => {
	// console.log(data);
	// if(data){
	// 	return (<>
	// 	CARGANDO..
	// 	</>)
	// }
	return (
		<div className="mt-lg-0">
			{/* <h4 className="header-title ">Datos del cliente</h4> */}
			<table className='table-striped'>
				<tbody>
				{data.id_cliente !==0 && (
					<>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Nombres y apellidos del cliente: </td>
							<td>Carlos Rosales Morales</td>
						</tr>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Estado del cliente: </td>
							<td>Nuevo</td>
						</tr>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Ultima compra de membresia:</td>
							<td className=''>
                                No tiene
							</td>
						</tr>
					</>
				)
				}
				</tbody>
				
			</table>
		</div>
	);
}
