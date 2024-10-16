import React from 'react'

export const VentaxSemana = () => {
  return (
    <>
        <div className="table-responsive">
                                                
                                                <div className="table-responsive mt-4">
                                                    
                                                    <div className="card-body d-flex justify-content-center align-items-center m-0 p-2">
                                                    </div> 
                                                    <table className="table table-bordered table-centered mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>RANKING DE SEMANAS</th>
                                                                <th>CANTIDAD</th>
                                                                <th>MONTO VENTA BRUTA</th>
                                                                <th>TICKET MEDIO</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>12 SEMANAS</td>
                                                                <td>
                                                                    <div className="progress-w-percent mb-0 float-right">
                                                                        <span className="w-100 progress-value">478 (43.35%)</span>
                                                                        <div className="progress">
                                                                            <div className="progress-bar bg-orange" role="progressbar" aria-valuenow="43.35" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="progress-w-percent mb-0">
                                                                        <span className="w-100 progress-value">514,740.00 (40.53%)</span>
                                                                        <div className="progress" style="background-color: #00000042;">
                                                                            <div className="progress-bar bg-orange" role="progressbar" aria-valuenow="40.53" aria-valuemin="0" aria-valuemax="100"></div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>1,205.48</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div> 
    </>
  )
}
