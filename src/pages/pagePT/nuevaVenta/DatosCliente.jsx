import { Row, Col, Button, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { arrayEstados, arrayFacturas, arrayOrigenDeCliente } from '@/types/type';
import { useForm } from '@/hooks/useForm';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { ResumenCliente } from './ResumenCliente';
import { useDispatch } from 'react-redux';
import { onSetDetalleCli } from '@/store/uiNuevaVenta/uiNuevaVenta';
import Select from 'react-select';
import { MultiOpcionSelect } from '../GestInventario/components/ComponentSelect';
import { useNuevaVentaStore } from './useNuevaVentaStore';

const DatosCliente = ({dataCliente}) => {
	const dispatch = useDispatch()
	const {obtenerParametrosClientes, DataClientes, obtenerParametrosVendedores, DataVendedores} = useTerminoStore()
	const [clienteSelect, setClienteSelect] = useState({})
	const [EmpleadoSelect, setEmpleadoSelect] = useState({})
	const [TipoTransacSelect, setTipoTransacSelect] = useState({})
	const { obtenerUltimaVentaxComprobante, ultimaComprobante } = useNuevaVentaStore()
	const { formState: formStateCliente, 
		id_cli, 
		id_empl, 
		id_tipo_transaccion, 
		numero_transac, 
		id_origen, 
		observacion,
		onInputChangeReact, onInputChange, onInputChangeFunction } = useForm(dataCliente)
	useEffect(() => {
		obtenerParametrosClientes()
		obtenerParametrosVendedores()
	}, [])
	useEffect(() => {
		obtenerUltimaVentaxComprobante(id_tipo_transaccion)
	}, [id_tipo_transaccion])
	
	useEffect(() => {
		dispatch(onSetDetalleCli({
			...formStateCliente, 
			id_cli: id_cli,
			id_empl: id_empl, 
            id_tipo_transaccion: id_tipo_transaccion, 
            numero_transac: numero_transac, 
            id_origen: id_origen, 
            observacion: observacion,
			telefono_cli: clienteSelect?.tel_cli
		}))
	}, [id_cli, id_empl, id_tipo_transaccion, numero_transac, id_origen, observacion])
	
	useEffect(() => {
		const datacli = DataClientes.find(
			(option) => option.value === id_cli
		)
		setClienteSelect(datacli)
	}, [id_cli])
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
	const inputChangeClientes = (e)=>{
		const dataCli = DataClientes.find(
            (option) => option.label === e.value
        )
		onInputChangeReact(e, 'id_cli')
	}
	console.log(DataClientes);
	
	useEffect(() => {
		onInputChangeFunction('numero_transac', `${id_tipo_transaccion==699?'B001-00000':'F001-000000'}${Number(ultimaComprobante?.numero_transac)+1}`)
	}, [formStateCliente])
	return (
		<>
			<form>
				<Card>
					<Card.Header>
						<Card.Title>
							<span className='fs-3 text-change'>
								ASESOR COMERCIAL
							</span>
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<div className="mb-2">
											<Select
												onChange={(e) => onInputChangeReact(e, 'id_empl')}
												name="id_empl"
												placeholder={'Seleccionar el asesor'}
												className="react-select"
												classNamePrefix="react-select"
												options={DataVendedores}
												value={
													DataVendedores.find(
														(option) => option.value === id_empl
													) || 0
												}
												required
											/>
										</div>
					</Card.Body>
				</Card>
				<Row>
					<Col>
						<Row>
							<Col xl={12}>
									<Card>
										<Card.Header>
											<Card.Title className='text-change fs-3'>
												<span className='text-change'>
													socio
												</span>
											</Card.Title>
										</Card.Header>
										<Card.Body>
								<Row>
									<Col xl={12}>
										<div className="mb-2">
											<Select
												onChange={(e) => inputChangeClientes(e)}
												name="id_cli"
												placeholder={'Seleccionar el socio'}
												className="react-select"
												classNamePrefix="react-select"
												options={DataClientes}
												value={DataClientes.find(
													(option) => option.value === id_cli
												)}
												required
											/>
										</div>
									</Col>
									<Col xl={12}>
										<div className="mb-2">
											<Select
												onChange={(e) => onInputChangeReact(e, 'id_origen')}
												name="id_origen"
												placeholder={'Fuente'}
												className="react-select"
												classNamePrefix="react-select"
												options={arrayOrigenDeCliente}
												value={
													arrayOrigenDeCliente.find(
														(option) => option.value === id_origen
													) || 0
												}
												required
											/>
										</div>
									</Col>
									<Col xl={12}>
										<div className="mb-2">
											<Select
												onChange={(e) =>
													onInputChangeReact(e, 'id_tipo_transaccion')
												}
												name="id_tipo_transaccion"
												placeholder={'Tipo de comprobante'}
												className="react-select"
												classNamePrefix="react-select"
												options={arrayFacturas}
												value={
													arrayFacturas.find(
														(option) =>
															option.value === id_tipo_transaccion
													) || 0
												}
												required
											/>
										</div>
									</Col>
									<Col xl={12}>
										<div className="mb-2">
											<input
												type=""
												name="numero_transac"
												id="numero_transac"
												className="form-control"
												placeholder="numero de comprobante"
												value={numero_transac}
												onChange={(e)=>{
													
													onInputChange(e)
												}}
											/>
										</div>
									</Col>
									<Col xl={12}>
										<div className="mb-2">
											<textarea
												name="observacion"
												id="observacion"
												className="form-control"
												placeholder="Observacion"
												value={observacion}
												onChange={onInputChange}
											/>
										</div>
									</Col>
								</Row>
										</Card.Body>
									</Card>
								
							</Col>
						</Row>
					</Col>
				</Row>
			</form>
		</>
	);
};

export default DatosCliente;
