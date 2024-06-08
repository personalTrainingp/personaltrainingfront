import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
import { useForm } from '@/hooks/useForm';
import { arrayFinanzas } from '@/types/type';
import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// const columns: ReadonlyArray<Column<Customer>> = [
const ActionColumnGF = ({ row }) => {
	const [modal, setmodal] = useState(false);
	const [modalUpdate, setmodalUpdate] = useState(false);
	const { gastoFijo } = useSelector((e) => e.gf_gv);
	const { id_gf,sigla_gf, nombre_gf, diaPago_gf, formState, onInputChange:onInputChangeUpdate } = useForm(gastoFijo);
    const { objetoComparador } = helperFunctions()
	const { startDeleteGastoFijo, obtenerGastoFijo, startUpdateGastoFijo } = useGf_GvStore();

	const ClickStartDelete = () => {
		startDeleteGastoFijo(row.values.id_gf);
		setmodal(false);
	};
	const onStartUpdateGF = (e) => {
        e.preventDefault()
        const respComparador = objetoComparador(gastoFijo, formState)
        if(!respComparador){
            startUpdateGastoFijo(formState)
        }
        setmodalUpdate(false)
    };
	const onModalUpdateGF = () => {
		setmodalUpdate(true);
		obtenerGastoFijo(row.values.id_gf);
        
	};
	return (
		<>
			<Link to="" className="action-icon" onClick={onModalUpdateGF}>
				<i className="mdi mdi-square-edit-outline"></i>
			</Link>
			<Link to="" className="action-icon" onClick={() => setmodal(true)}>
				<i className="mdi mdi-delete"></i>
			</Link>
			<Modal show={modalUpdate} onHide={() => setmodalUpdate(false)}>
				<Modal.Header>
					<Modal.Title>Actualizar el gasto {row.values.nombre_gf}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={onStartUpdateGF}>
						<div className="mb-3">
							<label htmlFor="sigla_gf" className="form-label">
								Sigla del gasto fijo*
							</label>
							<input
								className="form-control"
								name="sigla_gf"
								value={sigla_gf}
								onChange={onInputChangeUpdate}
								id="sigla_gf"
								placeholder="sigla"
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="nombre_gf" className="form-label">
								Nombre del gasto fijo*
							</label>
							<input
								className="form-control"
								type="text"
								name="nombre_gf"
								value={nombre_gf}
								onChange={onInputChangeUpdate}
								id="nombre_gf"
								placeholder="Nombre del gasto fijo"
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="diaPago_gf" className="form-label">
								Cada cuanto tiempo* <span className='text-muted fs-6'>
                                <i className='mdi mdi-information-outline mx-1'></i>
                                La fecha de pago es cada {diaPago_gf} dias
                                </span>
							</label>
							<input
								className="form-control"
								type="number"
								name="diaPago_gf"
								value={diaPago_gf}
								onChange={onInputChangeUpdate}
								id="diaPago_gf"
								placeholder="Digite cada cuantos dia es el gasto fijo"
								required
							/>
						</div>
                        <Button type='submit'>
                            Actualizar gasto fijo
                        </Button>
					</form>
				</Modal.Body>
				<Modal.Body></Modal.Body>
			</Modal>
			<Modal show={modal} onHide={() => setmodal(false)}>
				<Modal.Header>
					<Modal.Title>Eliminar el gasto {row.values.nombre_gf}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					¿Seguro que deseas eliminar este gasto?
					<Modal.Footer>
						<Button onClick={() => setmodal(false)} className="bg-danger">
							Cancelar
						</Button>
						<Button onClick={ClickStartDelete}>Eliminar</Button>
					</Modal.Footer>
				</Modal.Body>
			</Modal>
		</>
	);
};
const columnsParamsG = [
	{
		Header: 'id',
		accessor: 'id',
		defaultCanSort: true,
	},
	{
		Header: 'grupo',
		accessor: 'grupo',
		defaultCanSort: true,
	},
	{
		Header: 'Tipo de gastos',
		accessor: 'id_tipoGasto',
		defaultCanSort: true,
		Cell:({row})=>{
			const asdf = arrayFinanzas.find(objeto => objeto.value === row.original.id_tipoGasto).label
			return asdf
		}
	},
	{
		Header: 'Nombre del gasto',
		accessor: 'nombre_gasto',
		defaultCanSort: true,
	},
	{
		Header: 'Action',
		defaultCanSort: false,
		Cell: ActionColumnGF,
	},
];

const sizePerPageList = [
	{
		text: '1',
		value: 10,
	},
	{
		text: '105',
		value: 25,
	},
	{
		text: '50',
		value: 50,
	},
	{
		text: '50',
		value: 50,
	},
];

export { columnsParamsG, sizePerPageList };
