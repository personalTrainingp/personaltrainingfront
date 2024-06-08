import React from 'react'
import { Col, Row } from 'react-bootstrap'

export const TabSectionHorario = () => {
  return (
    
    <Row className="mt-4">
    <form onSubmit={onStartSubmitPost}>
        <Row>
            <input
                className="form-control"
                value={id_horarioPgm}
                onChange={onPostInputHorarioChange}
                type="hidden"
                required
            />
            <Col xl={2} className="p-1">
                <div className="mb-2">
                    {/* <Flatpickr
                        options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: 'H:i',
                            time_24hr: true,
                        }}
                        placeholder="Horario"
                        className="form-control"
                        value={time_HorarioPgm}
                        name="time_HorarioPgm"
                        id="time_HorarioPgm"
                        onChange={(e) =>
                            onInputChangeFlaticon(
                                e,
                                'time_HorarioPgm'
                            )
                        }
                        required
                    /> */}
                </div>
            </Col>
            <Col xl={2} className="p-1">
                <div className="mb-2">
                    <input
                        className="form-control"
                        placeholder="Aforo"
                        type="number"
                        value={aforo_HorarioPgm}
                        name="aforo_HorarioPgm"
                        id="aforo_HorarioPgm"
                        onChange={onPostInputHorarioChange}
                        required
                    />
                </div>
            </Col>
            <Col xl={4} className="p-1">
                <div className="mb-2">
                    <Select
                        onChange={(e) =>
                            onInputChangeReact(
                                e,
                                'trainer_HorarioPgm'
                            )
                        }
                        name={'trainer_HorarioPgm'}
                        placeholder={
                            'Seleccione el entrenador(a)'
                        }
                        className="react-select"
                        classNamePrefix="react-select"
                        options={DataTrainerPrueba}
                        value={DataTrainerPrueba.find(
                            (option) =>
                                option.value ===
                                trainer_HorarioPgm
                        )}
                        required
                    ></Select>
                </div>
            </Col>
            <Col xl={2} className="p-1">
                <div className="mb-2">
                    <input
                        type="button"
                        className={`form-control text-white p-1
                            ${isActive ? 'bg-success' : 'bg-danger'}
                            `}
                        value={isActive ? 'Activo' : 'Inactivo'}
                        name="estado_HorarioPgm"
                        onClick={onClickChangeisActive}
                        id="estado_HorarioPgm"
                    />
                </div>
            </Col>
            <Col xl={2} className="p-1">
                <Button type="submit" className="form-control">
                    {/* <i className={`mdi ${formStateHr.id_horarioPgm == 0?'mdi-plus':'mdi-square-edit-outline'}`}></i> */}
                    {formStateHr.id_horarioPgm == 0
                        ? 'Agregar'
                        : 'Actualizar'}
                </Button>
            </Col>
            {!(formStateHr.id_horarioPgm == 0) && (
                <Col xl={1}>
                    <Button
                        className="btn-danger"
                        onClick={onClickDelete}
                    >
                        <i className="mdi mdi-delete"></i>
                    </Button>
                </Col>
            )}
        </Row>
    </form>
    <DataTable
        columns={columns}
        data={data}
        dense={true}
        onRowClicked={handleRowClick}
        noDataComponent={<p>No hay horarios disponibles</p>}
    />
</Row>
  )
}
