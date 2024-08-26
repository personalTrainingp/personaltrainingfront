import { Link } from 'react-router-dom';
import avatar from '@/assets/images/users/avatar-2.jpg'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';


export const ResumenCliente = ({data}) => {
	// console.log(data);
	// if(data){
	// 	return (<>
	// 	CARGANDO..
	// 	</>)
	// }
    const hoy = new Date();
	const { obtenerUltimaMembresiaPorCliente, dataUltimaMembresia } = useTerminoStore()
	const { obtenerClientexID, dataClixID } = useUsuarioStore()
	// const { dataUltimaMembresiaPorCliente } = useSelector(e=>e.parametro)
	const [estadoCliente, setestadoCliente] = useState('')
	useEffect(() => {
		if(data.id_cliente==0) return;
		obtenerUltimaMembresiaPorCliente(data.id_cliente)
		obtenerClientexID(data.id_cliente)
	}, [data.id_cliente])
	// console.log(dataUltimaMembresia);
	
	// const { tb_ProgramaTraining, tb_semana_training, fec_inicio_mem, fec_fin_mem } = dataUltimaMembresia!==undefined?dataUltimaMembresia:[]
	// useEffect(() => {
	// 	if (dataUltimaMembresia?.length === 0) {
	// 		return setestadoCliente('Nuevo');
	// 	}
	// 	const ultimaFechaExpiracion = new Date(fec_fin_mem);
	
	// 	if (ultimaFechaExpiracion >= hoy) {
	// 		return setestadoCliente('Renovación');
	// 	} else {
	// 		return setestadoCliente('Reinscrito');
	// 	}
	// }, [dataUltimaMembresiaPorCliente])
	
	return (
		<div className="mt-lg-0">
			{/* <h4 className="header-title ">Datos del cliente</h4> */}
			<table className='table-striped'>
				<tbody>
				{data.id_cliente !==0 && (
					<>
						<tr className='fs-5'>
							<td className='fw-bold font-12'>Nombres y apellidos del socio: </td>
							<td>{dataClixID.nombres_apellidos_cli}</td>
						</tr>
						<tr className='fs-5'>
							{/* <td className='fw-bold font-12'>Estado del socio: </td>
							<td>{estadoCliente}</td> */}
						</tr>
						<tr className='fs-5'>
							{/* <td className='fw-bold font-12'>Ultima compra de membresia:</td> */}
							{/* <td className=''>
                                {tb_ProgramaTraining?.name_pgm} {tb_semana_training?.semanas_st} 
								{
									(dataUltimaMembresia?.length==0||dataUltimaMembresia===undefined)?'NO TIENE':'SEMANAS'
								}
							</td> */}
						</tr>
					</>
				)
				}
				</tbody>
				
			</table>
		</div>
	);
}
