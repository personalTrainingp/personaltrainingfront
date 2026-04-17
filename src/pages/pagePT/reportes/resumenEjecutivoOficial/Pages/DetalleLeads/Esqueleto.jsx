import React from 'react'
import { TrItem } from './TrItem'
import { Table } from 'react-bootstrap'
import dayjs from 'dayjs'

export const Esqueleto = ({labelTitle='', dataMES=[], dataConMesesYanio,  dataMontoAnio, labelTotalX='', labelTotalY}) => {
  return (
    <div>
    <div className='text-center'>
            <span className='fs-1'>
                {labelTitle}
            </span>
    </div>
    <div className="table-responsive" style={{ width: '100%' }}>
        
        <Table  className="tabla-egresos" style={{width: '100%'}}  bordered>
            <thead className='bg-change'>
                <tr className='fs-1' style={{width: '350px'}}>
                    <td className='sticky-td-598 fs-1 text-center text-white' style={{width: '350px'}}></td>
                    {
                        dataMES.map(d=>{
                            return (
                                <th className='fs-1 text-center text-white' style={{width: '240px'}}>
                                    {dayjs.utc(`${d.fecha}-15`, 'YYYY-M-DD').format('MMMM')}
                                </th>
                            )
                        })
                    }
                    <td className='fs-1 text-center text-white' style={{width: '240px'}}>{labelTotalX}</td>
                </tr>
            </thead>
            <tbody>
                <TrItem anio={2026} data={dataConMesesYanio.filter(f=>f.anio===2026)} montoAnio={dataMontoAnio.find(f=>f.anio===2026)?.monto}/>
                <TrItem anio={2025} data={dataConMesesYanio.filter(f=>f.anio===2025)} montoAnio={dataMontoAnio.find(f=>f.anio===2025)?.monto}/>
                <TrItem anio={2024} data={dataConMesesYanio.filter(f=>f.anio===2024)} montoAnio={dataMontoAnio.find(f=>f.anio===2024)?.monto}/>
                {/* <TrItem anio={'TOTAL'} data={dataConMesesYanio} montoAnio={dataMontoAnio.find(f=>f.anio===2024)?.monto}/> */}
                {/* <TrItem anio={'TOTAL'} data={dataConMesesYanio}/> */}
            </tbody>
        </Table>
        </div>
    </div>
  )
}
