import { Row, Col, Button, ButtonGroup, Modal } from 'react-bootstrap';
import { FileInput, PageBreadcrumb, Table } from '@/components';
import ProjectCard from './ProjectCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import sinImage from '@/assets/images/imageBlanck.jpg';
import 'flatpickr/dist/themes/material_green.css';
import { useForm } from '@/hooks/useForm';
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';
import { useSelector } from 'react-redux';
import { columns, sizePerPageList } from './ColumnsSet';
import { arrayDataTrainer } from '@/types/type';
const RegisterprogramaaTraining = {
	nombre_pgm: '',
	desc_pgm: '',
	sigla_pgm: ''
};
const registerImgProgram = {
	base64_pgm: '',
};
export const GestProgramas = () => {
	const [onModal, setonModal] = useState(false);
	const [isActive, setisActive] = useState(true);
	const [viewImage, setviewImage] = useState(sinImage);
	const { datapgmPT } = useSelector((e) => e.programaPT);
	const [fileAvatar, setfileAvatar] = useState(null)
	// const [selectedFile, setSelectedFile] = useState(sinImage);
	const { startRegisterProgramaTraining, startRegisterLogoTest, startObtenerTBProgramaPT } = useProgramaTrainingStore();
	const {
		nombre_pgm,
		desc_pgm,
		sigla_pgm,
		formState,
		onInputChange: onRegisterInputChange,
		onInputChangeButton,
		onResetForm
	} = useForm(RegisterprogramaaTraining);
	const { formState: formStateImg, onFileChange: onRegisterFileChange } =
		useForm(registerImgProgram);
	useEffect(() => {
		startObtenerTBProgramaPT();
	}, []);
	const ClickModalOpen = () => {
		setonModal(true);
	};
	const ClickModalClose = () => {
		setonModal(false);
		setviewImage(sinImage);
		onResetForm()
	};
	const onStartSubmitRegister = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', fileAvatar);
		startRegisterLogoTest(formData, formState);
		// onResetForm()
		// setonModal(false)
		// setviewImage(sinImage)
	};
	const ViewDataImg = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			setviewImage(reader.result);
		};
		reader.readAsDataURL(file);
		setfileAvatar(file)
	};
	return (
		<>
			<PageBreadcrumb title="Gestion de programas" subName="Projects" />
			<Row className="mb-2">
				<Col sm={4}>
					<Link onClick={ClickModalOpen} className="rounded-pill mb-3 btn btn-danger">
						<i className="mdi mdi-plus"></i> Crear un nuevo Programa
					</Link>
				</Col>
			</Row>
			<Modal show={onModal} onHide={ClickModalClose} size="lg">
				<Modal.Header>
					<Modal.Title>Registrar un programa</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={onStartSubmitRegister}>
						<Row>
							<Col lg={6}>
								<img src={viewImage} style={{ width: '100%', height: '30vh' }} />
								<input
									type="file"
									className="form-control mt-2"
									accept="image/png, image/jpeg, image/jpg"
									onChange={(e) => {
										onRegisterFileChange(e);
										ViewDataImg(e);
									}}
									name="base64_pgm"
									required
								/>
							</Col>
							<Col lg={6}>
								<div className="mb-4">
									<label htmlFor="nombre_pgm" className="form-label">
										Nombre del programa*
									</label>
									<input
										className="form-control"
										name="nombre_pgm"
										value={nombre_pgm}
										onChange={onRegisterInputChange}
										id="nombre_pgm"
										placeholder="Nombre del programa"
										required
									/>
								</div>
								<div className="mb-4">
									<label htmlFor="nombre_pgm" className="form-label">
										Sigla del programa*
									</label>
									<input
										className="form-control"
										name="sigla_pgm"
										value={sigla_pgm}
										onChange={onRegisterInputChange}
										id="sigla_pgm"
										placeholder="Sigla del programa"
										required
									/>
								</div>
								<div className="mb-4">
									<label htmlFor="desc_pgm" className="form-label">
										Descripcion del programa*
									</label>
									<textarea
										className="form-control"
										name="desc_pgm"
										value={desc_pgm}
										onChange={onRegisterInputChange}
										id="desc_pgm"
										placeholder="Descripcion del programa"
										style={{ maxHeight: '100px' }}
										required
									/>
								</div>
								<Button type="submit">Registrar informacionnn</Button>
							</Col>
						</Row>
					</form>
				</Modal.Body>
			</Modal>
			<Row>
			</Row>
		</>
	);
};
