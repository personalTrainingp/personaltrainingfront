import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, Row, Col, Table, Badge, Form } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { PageBreadcrumb } from '@/components'
import { InputButton, InputDate, InputSwitch, InputText, InputTextArea } from '@/components/InputText'
import { ImagenUploader } from '@/components/ImagenUploader'
import { useForm } from '@/hooks/useForm'
import { useCheckListStore } from './hook/useCheckListStore'
import { arrayOpcionesCheckList } from './types'
import { Loading } from '@/components/Loading'

const customCheckList = {
	titulo: '',
	fecha_checklist: '',
	responsable: '',
	observacion_general: '',
}

const customItemCheckList = {
	opciones: [],
	observacion: '',
	revisado: false,
}

const FotoPreviewCell = ({ file }) => {
	const objectUrl = useMemo(() => (file instanceof File ? URL.createObjectURL(file) : null), [file])
	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [objectUrl])

	// `file` puede ser un File recien subido, o un string (foto real del
	// articulo que ya viene del inventario / servidor).
	const src = objectUrl || (typeof file === 'string' && file ? file : null)

	if (!src) {
		return (
			<div
				className="d-flex flex-column align-items-center justify-content-center text-muted border rounded mx-auto"
				style={{ width: 70, height: 70 }}
			>
				<i className="ri-image-line fs-4"></i>
				<small style={{ fontSize: '9px' }}>NO HAY IMAGEN</small>
			</div>
		)
	}
	return (
		<img
			src={src}
			alt="foto"
			className="rounded"
			style={{ width: 70, height: 70, objectFit: 'cover' }}
		/>
	)
}

export const FormularioCheckList = () => {
	const { id_empresa, id } = useParams()
	const [searchParams] = useSearchParams()
	const readOnly = searchParams.get('ver') === '1'
	const navigate = useNavigate()
	const idActual = Number(id)
	const idEmpresaActual = Number(id_empresa)

	const {
		dataCheckList,
		obtenerCheckListxID,
		postCheckList,
		updateCheckListxID,
		completarCheckListxID,
		updateCheckListItemxID,
		setdataCheckList,
		loading,
	} = useCheckListStore()

	const { formState, titulo, fecha_checklist, responsable, observacion_general, onInputChange: onInputChangeHeader } =
		useForm(idActual !== 0 ? dataCheckList : customCheckList)

	const [itemEnRevision, setitemEnRevision] = useState(null)
	const {
		formState: itemFormState,
		opciones,
		observacion,
		revisado,
		onInputChange: onInputChangeItem,
		onInputChangeFunction: onInputChangeFunctionItem,
	} = useForm(itemEnRevision || customItemCheckList)
	const [imagenItem, setimagenItem] = useState(null)
	const [fotoAntes, setfotoAntes] = useState(null)
	const [fotoDespues, setfotoDespues] = useState(null)

	useEffect(() => {
		if (idActual !== 0) {
			obtenerCheckListxID(idActual)
		} else {
			setdataCheckList({ items: [] })
		}
	}, [idActual])

	const onSubmitHeader = async () => {
		if (idActual === 0) {
			const creado = await postCheckList(formState, idEmpresaActual)
			if (creado?.id) {
				navigate(`/gestion-checklist/formulario/${idEmpresaActual}/${creado.id}`, { replace: true })
			}
		} else {
			updateCheckListxID(idActual, formState, idEmpresaActual)
		}
	}

	const onFinalizarCheckList = () => {
		confirmDialog({
			message: `Deseas finalizar este checklist? ya no podras editarlo`,
			accept: () => {
				completarCheckListxID(idActual, idEmpresaActual)
				navigate('/gestion-checklist')
			},
		})
	}

	const onRevisarItem = (it) => {
		setitemEnRevision(it)
		setimagenItem(null)
		setfotoAntes(null)
		setfotoDespues(null)
	}
	const onCancelarRevision = () => {
		setitemEnRevision(null)
	}

	const onToggleOpcion = (value) => {
		const yaEsta = (opciones || []).includes(value)
		const nuevasOpciones = yaEsta
			? opciones.filter((o) => o !== value)
			: [...(opciones || []), value]
		onInputChangeFunctionItem('opciones', nuevasOpciones)
	}

	const onChangeImagenItem = (e) => setimagenItem(e.target.files[0])
	const onChangeFotoAntes = (e) => setfotoAntes(e.target.files[0])
	const onChangeFotoDespues = (e) => setfotoDespues(e.target.files[0])

	const onGuardarRevisionItem = () => {
		updateCheckListItemxID(itemEnRevision.id, itemFormState, idActual, imagenItem, fotoAntes, fotoDespues)
		onCancelarRevision()
	}

	const items = dataCheckList.items || []
	const totalItems = items.length
	const revisados = items.filter((it) => it.revisado).length
	const noRevisados = totalItems - revisados

	return (
		<div>
			<Loading show={loading} />
			<PageBreadcrumb title={idActual !== 0 ? 'EDITAR CHECKLIST' : 'AGREGAR CHECKLIST'} subName={'T'} />
			<div className="mb-2">
				<Link to="/gestion-checklist" className="btn btn-primary">
					<i className="mdi mdi-chevron-left"></i> Regresar
				</Link>
			</div>

			<Card>
				<Card.Body>
					<form>
						<Row>
							<Col lg={4}>
								<div className="m-2">
									<InputText
										label={'TITULO'}
										nameInput={'titulo'}
										onChange={onInputChangeHeader}
										value={titulo}
										disabled={readOnly}
									/>
								</div>
							</Col>
							<Col lg={4}>
								<div className="m-2">
									<InputDate
										label={'FECHA'}
										nameInput={'fecha_checklist'}
										onChange={onInputChangeHeader}
										value={fecha_checklist}
										disabled={readOnly}
									/>
								</div>
							</Col>
							<Col lg={4}>
								<div className="m-2">
									<InputText
										label={'RESPONSABLE'}
										nameInput={'responsable'}
										onChange={onInputChangeHeader}
										value={responsable}
										disabled={readOnly}
									/>
								</div>
							</Col>
							<Col lg={12}>
								<div className="m-2">
									<InputTextArea
										label={'OBSERVACION GENERAL'}
										nameInput={'observacion_general'}
										onChange={onInputChangeHeader}
										value={observacion_general}
										disabled={readOnly}
									/>
								</div>
							</Col>
							{!readOnly && (
								<Col lg={12}>
									<InputButton
										label={idActual !== 0 ? 'ACTUALIZAR CHECKLIST' : 'GUARDAR CHECKLIST (genera todos los items del inventario)'}
										onClick={onSubmitHeader}
									/>
								</Col>
							)}
						</Row>
					</form>
				</Card.Body>
			</Card>

			{idActual !== 0 && (
				<Card className="mt-3">
					<Card.Body>
						<h4>ITEMS DEL CHECKLIST</h4>
						<div className="d-flex gap-2 mb-2">
							<Badge bg="secondary">TOTAL: {totalItems}</Badge>
							<Badge bg="success">REVISADO: {revisados}</Badge>
							<Badge bg="danger">NO REVISADO: {noRevisados}</Badge>
						</div>

						{itemEnRevision && (
							<Card className="mb-3 border-primary">
								<Card.Header>REVISANDO: {itemEnRevision.producto}</Card.Header>
								<Card.Body>
									<Row>
										<Col lg={6}>
											<div className="m-2">
												<label className="form-label text-change">FOTO DEL ARTICULO</label>
												<ImagenUploader
													name="imagenItem"
													onChange={onChangeImagenItem}
													value={imagenItem || itemEnRevision?.imagen_item || null}
												/>
											</div>
										</Col>
										<Col lg={6}>
											<div className="m-2">
												<InputSwitch
													label={'ITEM REVISADO'}
													nameInput={'revisado'}
													onChange={onInputChangeItem}
													value={revisado}
												/>
											</div>
										</Col>
										<Col lg={12}>
											<div className="m-2">
												<label className="form-label text-change">TIPO DE MANTENIMIENTO</label>
												<div className="d-flex flex-wrap gap-3">
													{arrayOpcionesCheckList.map((op) => (
														<Form.Check
															key={op.value}
															type="checkbox"
															id={`opcion-${op.value}`}
															label={op.label}
															checked={(opciones || []).includes(op.value)}
															onChange={() => onToggleOpcion(op.value)}
														/>
													))}
												</div>
											</div>
										</Col>
										<Col lg={12}>
											<div className="m-2">
												<InputTextArea
													label={'OBSERVACION'}
													nameInput={'observacion'}
													onChange={onInputChangeItem}
													value={observacion}
												/>
											</div>
										</Col>
										<Col lg={6}>
											<div className="m-2">
												<label className="form-label text-change">FOTO ANTES</label>
												<ImagenUploader
													name="fotoAntes"
													onChange={onChangeFotoAntes}
													value={fotoAntes || itemEnRevision?.foto_antes || null}
												/>
											</div>
										</Col>
										<Col lg={6}>
											<div className="m-2">
												<label className="form-label text-change">FOTO DESPUES</label>
												<ImagenUploader
													name="fotoDespues"
													onChange={onChangeFotoDespues}
													value={fotoDespues || itemEnRevision?.foto_despues || null}
												/>
											</div>
										</Col>
										<Col lg={12}>
											<InputButton label={'GUARDAR REVISION'} onClick={onGuardarRevisionItem} />
											<InputButton label={'CANCELAR'} onClick={onCancelarRevision} variant={'link'} />
										</Col>
									</Row>
								</Card.Body>
							</Card>
						)}

						<Table className="table-centered mb-0 mt-2" striped responsive>
							<thead className="bg-primary fs-4">
								<tr>
									<th className="text-white">ARTICULO</th>
									<th className="text-white">TIPO DE MANTENIMIENTO</th>
									<th className="text-white">OBSERVACION</th>
									<th className="text-white">FOTO ANTES</th>
									<th className="text-white">FOTO DESPUES</th>
									<th className="text-white">REVISADO</th>
									{!readOnly && <th className="text-white">ACCIONES</th>}
								</tr>
							</thead>
							<tbody>
								{items.map((it) => (
									<tr key={it.id}>
										<td>
											<div className="d-flex flex-column align-items-center">
												<FotoPreviewCell file={it.imagen_item} />
												<small className="mt-1">{it.producto}</small>
											</div>
										</td>
										<td>
											{(it.opciones || []).map((op) => (
												<Badge bg="secondary" className="me-1" key={op}>
													{arrayOpcionesCheckList.find((o) => o.value === op)?.label || op}
												</Badge>
											))}
										</td>
										<td>{it.observacion}</td>
										<td>
											<FotoPreviewCell file={it.foto_antes} />
										</td>
										<td>
											<FotoPreviewCell file={it.foto_despues} />
										</td>
										<td>
											<Badge bg={it.revisado ? 'success' : 'danger'}>
												{it.revisado ? 'REVISADO' : 'NO REVISADO'}
											</Badge>
										</td>
										{!readOnly && (
											<td>
												<Button label="REVISAR" icon="pi pi-search" outlined onClick={() => onRevisarItem(it)} />
											</td>
										)}
									</tr>
								))}
							</tbody>
						</Table>
					</Card.Body>
				</Card>
			)}

			<div className="mt-3">
				<InputButton label={'VOLVER'} onClick={() => navigate('/gestion-checklist')} variant={'link'} />
				{!readOnly && idActual !== 0 && (
					<InputButton label={'FINALIZAR CHECKLIST'} onClick={onFinalizarCheckList} />
				)}
			</div>
		</div>
	)
}

export default FormularioCheckList
