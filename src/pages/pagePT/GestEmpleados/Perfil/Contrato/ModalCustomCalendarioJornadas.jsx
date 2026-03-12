import React, { useEffect, useState } from 'react'
import { Col, Modal, Row, Button } from 'react-bootstrap'
import CalendariosContrato from './CalendariosContrato'
import { InputButton, InputDate, InputSelect } from '@/components/InputText'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { TabPanel, TabView } from 'primereact/tabview'

export const ModalCustomCalendarioJornadas = ({
  idContrato = 0,
  show = false,
  onHide,
  fechaInicio,
  fechaFin
}) => {
    const { obtenerParametroPorEntidadyGrupo:obtenerNombresDias, DataGeneral:dataNombresDias } = useTerminoStore()
    const { obtenerParametroPorEntidadyGrupo:obtenerEstabilidades, DataGeneral:dataEstabilidades } = useTerminoStore()
    useEffect(() => {
        obtenerNombresDias('dia', 'nombre')
        obtenerEstabilidades('estabilidad-dia', 'empleado')
    }, [])
    
  const [jornadas, setJornadas] = useState([
    {
      id_dia: '',
      id_estabilidad: '',
      hora_inicio: '',
      hora_fin: ''
    }
  ])

  const handleChange = (index, field, value) => {
    const copy = [...jornadas]
    copy[index][field] = value
    setJornadas(copy)
  }

  const agregarForm = () => {
    setJornadas([
      ...jornadas,
      { id_dia: '', id_estabilidad: '', hora_inicio: '', hora_fin: '' }
    ])
  }

  const eliminarForm = (index) => {
    const copy = jornadas.filter((_, i) => i !== index)
    setJornadas(copy)
  }
  const onSubmit = ()=>{
    console.log({jornadas});
    
  }
  return (
    <Modal size='xl' show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>
          AGREGAR JORNADAS
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <TabView>
            <TabPanel header={'JORNADAS'}>
                <Row>
                    {jornadas.map((item, index) => (
                        <Col lg={4}>
                            <Row key={index} className="border p-2 mb-2 position-relative">

                                <Col lg={12} className="text-end mb-2">
                                {jornadas.length > 1 && (
                                    <Button
                                    size="sm"
                                    onClick={() => eliminarForm(index)}
                                    >
                                    x
                                    </Button>
                                )}
                                </Col>

                                <Col lg={12}>
                                <InputSelect
                                    label="DIA"
                                    value={item.id_dia}
                                    options={dataNombresDias}
                                    onChange={(e) =>
                                    handleChange(index, "id_dia", e.target.value)
                                    }
                                />
                                </Col>

                                <Col lg={12}>
                                <InputSelect
                                    label="ESTABILIDAD"
                                    value={item.id_estabilidad}
                                    options={dataEstabilidades}
                                    onChange={(e) =>
                                    handleChange(index, "id_estabilidad", e.target.value)
                                    }
                                />
                                </Col>

                                <Col lg={6}>
                                <InputDate
                                    type="time"
                                    label="HORA INICIO"
                                    value={item.hora_inicio}
                                    onChange={(e) =>
                                    handleChange(index, "hora_inicio", e.target.value)
                                    }
                                />
                                </Col>

                                <Col lg={6}>
                                <InputDate
                                    type="time"
                                    label="HORA FIN"
                                    value={item.hora_fin}
                                    onChange={(e) =>
                                    handleChange(index, "hora_fin", e.target.value)
                                    }
                                />
                                </Col>

                            </Row>
                        </Col>
                    ))}
                        <Col lg={4} >
                            <Button className='w-100 h-100' onClick={agregarForm}>
                            AGREGAR +
                            </Button>
                        </Col>
                </Row>
            </TabPanel>
            <TabPanel header={'CALENDARIO'}>
                    <CalendariosContrato
                    dataJornadaPorSemana={jornadas}
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    estabilidades={[
                        {id: 1695, label: '2 dias si y un dia no', si: 2, no: 1},
                        {id: 1693, label: '1 dias si y un dia no', si: 1, no: 1},
                        {id: 1694, label: 'Fijo', si: 0, no: 0},
                        {id: 1694, label: 'NINGUNO', si: 0, no: 0},
                    ]}
                    />
            </TabPanel>
        </TabView>
      </Modal.Body>
      <Modal.Footer>
        <InputButton label={'AGREGAR JORNADA'} onClick={onSubmit}/>
      </Modal.Footer>
    </Modal>
  )
}