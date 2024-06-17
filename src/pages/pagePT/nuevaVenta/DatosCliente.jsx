import { Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { arrayEstados, arrayFacturas, arrayOrigenDeCliente } from '@/types/type';
import { useForm } from '@/hooks/useForm';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { ResumenCliente } from './ResumenCliente';
import { useDispatch } from 'react-redux';
import { onSetDetalleCli } from '@/store/uiNuevaVenta/uiNuevaVenta';
import Select from 'react-select';

const DatosCliente = ({dataCliente}) => {
	const dispatch = useDispatch()
	const {obtenerParametrosClientes, DataClientes, obtenerParametrosVendedores, DataVendedores} = useTerminoStore()
	const [MsgValidation, setMsgValidation] = useState('')
	const [clienteSelect, setClienteSelect] = useState({})
	const [EmpleadoSelect, setEmpleadoSelect] = useState({})
	const [TipoTransacSelect, setTipoTransacSelect] = useState({})
	const { formState: formStateCliente, 
		id_cliente, 
		id_empl, 
		id_tipo_transaccion, 
		numero_transac, 
		id_origen, 
		observacion,
		onInputChangeReact, onInputChange } = useForm(dataCliente)
	useEffect(() => {
		obtenerParametrosClientes()
		obtenerParametrosVendedores()
	}, [])
	useEffect(() => {
		dispatch(onSetDetalleCli({
			...formStateCliente, 
			id_cliente: id_cliente, 
			email_cli: clienteSelect?.email_cli, 
			id_empl: id_empl, 
            id_tipo_transaccion: id_tipo_transaccion, 
            numero_transac: numero_transac, 
            id_origen: id_origen, 
            observacion: observacion,
			label_cli: clienteSelect?.label, 
			label_empl: EmpleadoSelect?.label, 
			label_tipo_transac: TipoTransacSelect?.label
		}))
	}, [id_cliente, 
		id_empl, 
		id_tipo_transaccion, 
		numero_transac, 
		id_origen, 
		observacion])

	useEffect(() => {
		const datacli = DataClientes.find(
			(option) => option.value === id_cliente
		)
		setClienteSelect(datacli)
	}, [id_cliente])
	useEffect(() => {
		const dataEmpl = DataVendedores.find(
			(option) => option.value === id_empl
		)
		setEmpleadoSelect(dataEmpl)
	}, [id_empl])
	useEffect(() => {
		const dataTipoTransac = arrayFacturas.find(
			(option) => option.value === id_tipo_transaccion
		)
		setTipoTransacSelect(dataTipoTransac)
	}, [id_tipo_transaccion])
	
	return (
		<>
		<form>
			<Row>
				<Col>
						<Row>
							<Col xl={12}>
									<Row>
										<Col xl={12}>
											<div className='mb-2'>
											<Select
												onChange={(e) => onInputChangeReact(e, 'id_empl')}
												name="id_empl"
												placeholder={'Seleccionar el asesor'}
												className="react-select"
												classNamePrefix="react-select"
												options={DataVendedores}
												value={DataVendedores.find(
													(option) => option.value === id_empl
												)||0}
												
												required
											/>
											</div>
										</Col>
										<Col xl={12}>
											<div className='mb-2'>
											<Select
												onChange={(e) => onInputChangeReact(e, 'id_cliente')}
												name="id_cliente"
												placeholder={'Seleccionar el cliente'}
												className="react-select"
												classNamePrefix="react-select"
												options={DataClientes}
												value={DataClientes.find(
													(option) => option.value === id_cliente
												)|| 0}
												required
											/>
											</div>
										</Col>
										<Col xl={12}>
										<div className='mb-2'>
											<Select
												onChange={(e) => onInputChangeReact(e, 'id_origen')}
												name="id_origen"
												placeholder={'De donde nos conoce el cliente'}
												className="react-select"
												classNamePrefix="react-select"
												options={arrayOrigenDeCliente}
												value={arrayOrigenDeCliente.find(
													(option) => option.value === id_origen
												) || 0}
												required
											/>
										</div>
										</Col>
										<Col xl={12}>
										<div className='mb-2'>
											<Select
												onChange={(e) => onInputChangeReact(e, 'id_tipo_transaccion')}
												name="id_tipo_transaccion"
												placeholder={'Tipo de comprobante'}
												className="react-select"
												classNamePrefix="react-select"
												options={arrayFacturas}
												value={arrayFacturas.find(
													(option) => option.value === id_tipo_transaccion
												)|| 0}
												required
											/>
										</div>
										</Col>
										<Col xl={12}>
										<div className='mb-2'>
											<input
												type=''
												name='numero_transac'
												id='numero_transac'
												className='form-control'
												placeholder='numero de comprobante'
												value={numero_transac}
												onChange={onInputChange}
											/>
										</div>
										</Col>
										<Col xl={12}>
										<div className='mb-2'>
											<textarea
												name='observacion'
												id='observacion'
												className='form-control'
												placeholder='Observacion general de venta'
												value={observacion}
												onChange={onInputChange}
											/>
										</div>
										</Col>
									</Row>
							</Col>
							<Col xl={12}>
								<ResumenCliente data={formStateCliente}/>
							</Col>
						</Row>
				</Col>
			</Row>
		</form>
		</>
	);
};

export default DatosCliente;
