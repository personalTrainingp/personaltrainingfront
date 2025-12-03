import React, { useEffect } from 'react'
import { useReporteUtilidadxMes } from './useReporteUtilidadxMes'
import { Col, Row, Table } from 'react-bootstrap'
import { NumberFormatter } from '@/components/CurrencyMask'
import dayjs from 'dayjs'

export const App2 = ({idEmpresa}) => {
  const { dataGasto, obtenerGastos } = useReporteUtilidadxMes()
  useEffect(() => {
    obtenerGastos(idEmpresa)
  }, [idEmpresa])
  
  return (
    <div>
      <Row>
        {
          dataGasto.map(gasto=>{
            return (
              <Col lg={3}>
                <Table className="vertical-table">
                    <thead>
                      <tr>
                        <th>
                          <div className='fs-2' style={{width: '300px'}}>
                            {dayjs.utc(gasto.mes, 'YYYY-MM').format('YYYY MMMM')}
                          </div>
                        </th>
                        <th>
                          <div className='fs-2' style={{width: '100px'}}>
                            MONTO
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className='fs-2'>
                            Egreso
                          </div>
                          </td>
                        <td>
                          <div style={{width: '100px'}} className='fs-3'>
                            <NumberFormatter amount={gasto.monto}/>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className='fs-2'>
                            INGRESO
                          </div>
                        </td>
                        <td>
                          <div style={{width: '100px'}}  className='fs-3'>
                            <NumberFormatter amount={0}/>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                </Table>
              </Col>
            )
          })
        }
      </Row>
    </div>
  )
}
