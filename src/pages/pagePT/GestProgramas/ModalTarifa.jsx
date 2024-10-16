import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';
import { useForm } from '@/hooks/useForm';
import { arrayEstados } from '@/types/type';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from 'react-select'

export const ModalTarifa = ({ show, onHide, showSemana, select_SEMANA }) => {
	const { select_TARIFA } = useSelector((e) => e.programaPT);
  const { startDeleteTarifaPgm, startUpdateTarifaPgm, startRegisterTarifaPgm }= useProgramaTrainingStore()
  const {
    descripcionTarifa_tt,
    estado_tt,
    id_st,
    id_tt,
    nombreTarifa_tt,
    tarifaCash_tt,
    formState,
    onInputChangeReact,
    onInputChange,
	onResetForm
   }=useForm(select_TARIFA)

	const onSubmitTarifa = (e) => {
    e.preventDefault()
    
    if(id_tt===0){
      startRegisterTarifaPgm(formState, select_SEMANA.id_st)
	  cancelModal()
      return 
    }
    startUpdateTarifaPgm(formState, select_SEMANA.id_st)
	cancelModal()
	};
	const cancelModal = ()=>{
		onResetForm()
		onHide()
	}
	return (
		<>
			<Modal show={show} onHide={cancelModal}>
				<Modal.Header>
					<Modal.Title>{'Agregar tarifa'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={onSubmitTarifa}>
						<div className="mb-2">
							<label htmlFor="nombreTarifa_tt" className="form-label">
								Nombre de la tarifa*
							</label>
							<input
								className="form-control"
								name="nombreTarifa_tt"
								id="nombreTarifa_tt"
								placeholder="Nombre de la tarifa"
								onChange={onInputChange}
								value={nombreTarifa_tt}
								required
							/>
						</div>
						<div className="mb-2">
							<label htmlFor="descripcionTarifa_tt" className="form-label">
								Descripcion de la tarifa*
							</label>
							<textarea
								className="form-control"
								name="descripcionTarifa_tt"
								id="descripcionTarifa_tt"
								placeholder="Descripcion"
								onChange={onInputChange}
								value={descripcionTarifa_tt}
								required
							/>
						</div>
						<div className="mb-2">
							<label htmlFor='tarifaCash_tt' className="form-label">Tarifa</label>
							<input
								className="form-control"
								name="tarifaCash_tt"
								id="tarifaCash_tt"
								placeholder="Tarifa en dinero"
								onChange={onInputChange}
								value={tarifaCash_tt}
								required
							/>
						</div>
            <div className="mb-2">
              <label className="form-label col-form-label">Estado:</label>
              <div>
                <Select
                  onChange={(e) => onInputChangeReact(e, 'estado_tt')}
                  name="estado_st"
                  placeholder={'Seleccione el estado'}
                  className="react-select"
                  classNamePrefix="react-select"
                  options={arrayEstados}
                  value={arrayEstados.find(
                    (option) => option.value === estado_tt
                  )}
                  required
                />
              </div>
            </div>
            <Button type='submit'>{
              id_tt===0?'Agregar tarifa':'Actualizar tarifa'
            }</Button>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};
