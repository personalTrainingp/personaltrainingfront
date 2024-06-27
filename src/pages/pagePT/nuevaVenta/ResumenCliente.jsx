import { Link } from 'react-router-dom';
import avatar from '@/assets/images/users/avatar-2.jpg'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


export const ResumenCliente = ({data}) => {
	// console.log(data);
	// if(data){
	// 	return (<>
	// 	CARGANDO..
	// 	</>)
	// }
	const { obtenerUltimaMembresiaPorCliente } = useTerminoStore()
	const { dataUltimaMembresiaPorCliente } = useSelector(e=>e.parametro)
	// console.log(data);
	useEffect(() => {
		if(data.id_cliente==0) return;
		obtenerUltimaMembresiaPorCliente(data.id_cliente)
	}, [data.id_cliente])
	const { tb_ProgramaTraining, tb_semana_training, fec_inicio_mem, fec_fin_mem } = dataUltimaMembresiaPorCliente
	console.log(tb_ProgramaTraining, tb_semana_training, fec_inicio_mem, fec_fin_mem);
	return (
		<div className="mt-lg-0">
			{/* <h4 className="header-title ">Datos del cliente</h4> */}
			<table className='table-striped'>
				<tbody>
				{data.id_cliente !==0 && (
					<>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Nombres y apellidos del cliente: </td>
							<td>{data.label_cli}</td>
						</tr>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Estado del cliente: </td>
							<td>Nuevo</td>
						</tr>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Ultima compra de membresia:</td>
							<td className=''>
                                {tb_ProgramaTraining?.name_pgm} {tb_semana_training?.semanas_st} semanas
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
