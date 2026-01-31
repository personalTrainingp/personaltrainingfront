import { InputButton, InputSelect, InputText } from "@/components/InputText";
import { useForm } from "@/hooks/useForm";
import { Modal } from "react-bootstrap";
import { useTerminoSistema } from "./useTerminoSistema";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const customTS = {
  label_param: '',
  estado_param: 1
}
export const ModalCustomTermSistema = ({ show, onHide, entidad, grupo, id = 0, label = '' }) => {
  const { obtenerTerminologiaSistemaxID, dataTerminoxID, registrarTerminologiaxEntidadyGrupo, actualizarTerminologia } = useTerminoSistema()
  const { formState, onInputChange, label_param, estado_param, onResetForm } = useForm(id!==0?dataTerminoxID:customTS)
  const { dataViewTerm } = useSelector(e=>e.TERM)
  const optionsDataEntidades = dataViewTerm?.map(dv=>{
    return {
      label: dv.entidad_param,
      value: dv.entidad_param,
    }
  })
  const optionsDataGrupos = dataViewTerm?.map(dv=>{
    return {
      label: dv.grupo_param,
      value: dv.grupo_param,
    }
  })
  useEffect(() => {
    if (id!==0) {
      obtenerTerminologiaSistemaxID(id)
    }
  }, [id])
  const onSubmitTerminologia = ()=>{
    if(id!==0){
      actualizarTerminologia(formState, id, entidad, grupo)
    }else{
      registrarTerminologiaxEntidadyGrupo(formState, entidad, grupo)
    }
    cancelarTerminologia()
  }
  const cancelarTerminologia = ()=>{
    onResetForm();
    onHide();
  }
  return (
    <Modal show={show} onHide={cancelarTerminologia} >
      <Modal.Header>
        {id!==0?'ACTUALIZAR TERMINOLOGIA':'AGREGAR TERMINOLOGIA'}
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="my-2">
            <InputText label={'VALOR'} nameInput={'label_param'} onChange={onInputChange} value={label_param} required/>
          </div>
          <div>
            <InputButton label={'AGREGAR'} onClick={onSubmitTerminologia}/>
            <InputButton label={'SALIR'} variant={'_link'} onClick={cancelarTerminologia}/>
          </div>
        </form>

      </Modal.Body>
    </Modal>
  );
};
