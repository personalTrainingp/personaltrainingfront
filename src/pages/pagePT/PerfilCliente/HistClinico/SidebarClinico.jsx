import { useForm } from '@/hooks/useForm';
import { Sidebar } from 'primereact/sidebar'
import React from 'react'
import { Button, Col, Row } from 'react-bootstrap';
const registerConsulta = {
  id_parametro_antec_pat: 1,
  descripcion_antec_pat: '',
  antec_pat_de_algun_familiar: '',
  antec_pat_fumado: '',
  antec_pat_consumes_farmaco: '',
  antec_pat_tomas_alcohol: '',
  antec_pat_realizas_actividad_fisica: '',
  antec_pat_modific_tu_alimentacion_ultimos6meses: '',
  antec_pat_cual_es_tu_apetito: '',
  antec_pat_hora_de_mas_hambre: '',
  antec_pat_alimentos_preferidos:'',
  antec_pat_alimentos_desagradables:'',
  antec_pat_alimentos_alergias:'',
  antec_pat_alimentos_suplemento_complemento:'',
  antec_pat_alimentos_segun_estado_animo:'',
  antec_pat_tratam_perdida_peso:'',
  horaDeDespierto: '',
  horaDeDormir: '',
  
}
export const SidebarClinico = ({show, onHide}) => {
  useForm(registerConsulta)
  const onStartSubmitClinico = ()=>{

  }
  return (
    <Sidebar visible={show} onHide={onHide} style={{width: '1400px'}}>
        <h2>Registrar consulta</h2>
        <form onSubmit={onStartSubmitClinico}>
						<Row>
							<Col lg={6}>
								{/* <div className="mb-4">
									<label htmlFor="nombre_pgm" className="form-label">
										Nombre del programa*
									</label>
									<input
										className="form-control"
										name="name_pgm"
										value={name_pgm}
										onChange={onUpdateInputChange}
										id="name_pgm"
										placeholder="Nombre del programa"
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
										onChange={onUpdateInputChange}
										id="desc_pgm"
										placeholder="Descripcion del programa"
										style={{ maxHeight: '100px' }}
										required
									/>
								</div> */}
								<Button type="submit">Actualizar informacion</Button>
							</Col>
						</Row>
					</form>
    </Sidebar>
  )
}
