import { PageBreadcrumb } from '@/components'
import { useMarcacionStore } from '@/hooks/hookApi/useMarcacionStore'
import { useForm } from '@/hooks/useForm'
import dayjs from 'dayjs'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
const rangoFechas = {
  rangoDate:new Date(),
  id_programa: 0
}
export const ReporteAsistencia = () => {
  const { formState, rangoDate, id_programa, onInputChange, onInputChangeReact, onResetForm } = useForm(rangoFechas)
  const { obtenerMarcacionEmpl, dataAsistencia } = useMarcacionStore()
  useEffect(() => {
    obtenerMarcacionEmpl(rangoDate)
  }, [])
  console.log(dataAsistencia);
  
  return (
    <>
      <PageBreadcrumb title={'REPORTE DE ASISTENCIAS'} subName={'T'}/>
      <Row>
        <Col lg={12}>
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
              MES
          </label>
          <Calendar id="buttondisplay"
    view="month"
    locale='es'
    value={rangoDate}
    name="rangoDate"
    dateFormat="MM/yy"
    onChange={onInputChange}
    showIcon
    readOnlyInput />
        </div>
        </Col>
        <Col>
          
        <Table
                    responsive
                    striped
                    className="table-centered mb-0 overflow-auto"
                >
                    <thead className="bg-primary">
                        <tr>
                            <th scope="col" className="pe-0 me-0 text-white">COLABORADORES</th>
                            <th scope="col" className="pe-0 me-0 text-white">SABADO 21</th>
                            {

                            }
                            {/* {
                                fechasUnicas.map((fecha , index)=>(
                                    <th className="w-100 text-nowrap" style={{  }} key={index} scope="col">{fecha}</th>
                                ))
                            } */}
                        </tr>
                    </thead>
                    <tbody>
                      {
                        dataAsistencia.map((e, index) => {
                          return (
                            <tr key={e.id}>
                              <td>{e.nombres_apellidos_empl}</td>
                              {
                                e?.asistencias.map(m=>{
                                  
                                  // Ordena los datos en base a `tiempo_marcacion`
                                  const sortedData = m.marcaciones.sort((a, b) => new Date(a.tiempo_marcacion) - new Date(b.tiempo_marcacion));
                                  // Obtiene el primer y último elemento
                                  const firstEntry = sortedData[0];
                                  const lastEntry = sortedData[sortedData.length - 1];
                                  
                                  return (
                                    <td>
                                      E: {dayjs(firstEntry.tiempo_marcacion, 'M/D/YYYY h:mm:ss A').format('hh:mm:ss A')}
                                      <br/>
                                      S: {dayjs(lastEntry.tiempo_marcacion, 'M/D/YYYY h:mm:ss A').format('hh:mm:ss A')}
                                    </td>
                                  )
                                })
                              }
                            </tr>
                          )
                        }
                      )
                      }
                    </tbody>
                </Table>
        </Col>
      </Row>
    </>
  )
}
