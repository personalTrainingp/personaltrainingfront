import { InputButton, InputSelect, InputText } from "@/components/InputText";
import { useForm } from "@/hooks/useForm";
import { Modal } from "react-bootstrap";
import { useTerminoSistema } from "./useTerminoSistema";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const customTS = {
  param_label: '',
  estado_param: 1,
  orden: 0
}
export const ModalCustomTermGrupo = ({ show, onHide,  id = 0, label = '', id_empresa }) => {
  const {  obtenerTerminoGrupoxID, dataGrupo, postTerminoGrupo, updateTerminoGrupo } = useTerminoSistema()
  const { formState, onInputChange, param_label, orden, onResetForm } = useForm(id!==0?dataGrupo:customTS)
  useEffect(() => {
    if (id!==0) {
      obtenerTerminoGrupoxID(id)
    }
  }, [id])
  const onSubmitTerminologia = ()=>{
    if(id!==0){
      updateTerminoGrupo(id, formState, id_empresa)
    }else{
      postTerminoGrupo(id_empresa, formState)
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
        {id!==0?'ACTUALIZAR TERMINOLOGIA':'AGREGAR TERMINOLOGIA'} {id}
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="my-2">
            <InputText label={'VALOR'} nameInput={'param_label'} onChange={onInputChange} value={param_label} required/>
          </div>
          <div className="my-2">
            <InputText label={'ORDEN'} nameInput={'orden'} onChange={onInputChange} value={orden} required/>
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
