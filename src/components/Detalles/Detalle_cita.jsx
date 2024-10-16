import React from 'react'
import { MoneyFormatter } from '../CurrencyMask'

export const Detalle_cita = ({e}) => {
  return (
    
    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-12 bg-white rounded shadow-sm mb-5">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="border-0 bg-light p-1">
                                                                    <div className="p-0 px-3 text-uppercase">PROGRAMA</div>
                                                                </th>
                                                                <th scope="col" className="border-0 bg-light p-1">
                                                                    <div className="py-0 text-uppercase">PRECIO</div>
                                                                </th>
                                                                <th scope="col" className="border-0 bg-light p-1">
                                                                    <div className="py-0 text-uppercase">CONTRATO</div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="border-0">
                                                                <a
                                                                                    href="#"
                                                                                    className="text-dark d-inline-block"
                                                                                >
                                                                                    {e?.tb_ProgramaTraining?.name_pgm} | {e?.tb_semana_training?.semanas_st} SEMANAS
                                                                                </a>
                                                                </td>
                                                                <td className="border-0">
                                                                        {<MoneyFormatter amount={e?.tarifa_monto} />}
                                                                </td>
                                                                <td className="border-0">
                                                                    <a style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontSize: '15px'}}>CONTRATO</a>
                                                                {/* <i className='mdi mdi-file-document fs-4' style={{cursor: 'pointer'}}></i> */}
                                                                    {/* <h5 className='fs-3' style={{cursor: 'pointer'}}></h5> */}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
  )
}
