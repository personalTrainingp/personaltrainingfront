import { NumberFormatMoney } from '@/components/CurrencyMask';
import React from 'react'
import { Table } from 'react-bootstrap';

export const ItemTablePgm = ({arrayEstadistico, labelParam, avatarPrograma, isViewGenere, isViewSesiones, isTarifaCash, onOpenModalSOCIOS}) => {
    console.log(arrayEstadistico, "array estadosi");
    
  return (
    
            <Table
            className="table-centered mb-0"
            striped
            responsive
        >
            
            <thead className='bg-primary fs-3'>
                <tr>
                    <th className='text-white text-center'>{labelParam} </th>
                    {
                        isViewGenere&&(
                            <th className='text-white text-center'>FEMEN </th>
                        )
                    }
                    {
                        isViewGenere&&(
                            <th className='text-white text-center'>MASC </th>
                        )
                    }
                    {
                        isTarifaCash&&(
                            <th className='text-white text-center'>Sesiones </th>
                        )
                    }
                    {
                        isTarifaCash&&(
                            <th className='text-white text-center'>tarifa </th>
                        )
                    }
                    
                    <th className='text-white text-center'>SOCIOS </th>
                    <th className='text-white text-center'>% SOCIOS </th>
                </tr>
            </thead>
            <tbody>
                {
                    arrayEstadistico.map(p=>{
                        return (
                            <tr onClick={()=>onOpenModalSOCIOS(p.items, avatarPrograma, `${labelParam} - ${p.propiedad}`)}>
                                    <td className=''>
                                        <li className='d-flex flex-row justify-content-between p-2'>
                                            <div>
                                                <span className='fw-bold text-primary fs-2'> {p.propiedad}</span>
                                                <br/>
                                                {
                                                    isViewSesiones&& (
                                                        <span className='fw-bold fs-3'>{p.sesiones}</span>
                                                    )
                                                }
                                            </div>
                                        </li>
                                    </td>
                                    {
                                        isViewGenere&& (
                                                <td className=''>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold fs-2'>{1}</span></li>
                                            </td>
                                        )
                                    }
                                    {
                                        isViewGenere&& (
                                                <td className=''>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold fs-2'>{1}</span></li>
                                            </td>
                                        )
                                    }
                                    {
                                        isTarifaCash&& (
                                                <td className=''>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold fs-2'>{p.semanas}</span></li>
                                            </td>
                                        )
                                    }
                                    {
                                        isTarifaCash && (
                                            <td className=''>
                                                <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold fs-2'><NumberFormatMoney amount={p.tarifaCash_tt}/></span></li>
                                            </td>
                                        )
                                    }
                                    <td>
                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                    </td>
                                    <td>
                                        <span style={{fontSize: '40px'}} className='d-flex fw-bold justify-content-end align-content-end align-items-end'>{p.items.length}</span>
                                    </td>
                            </tr>
                        )
                    })
                }
            </tbody>
            
        <tr className='bg-primary'>
                    <td>
                        <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-white fs-2'>TOTAL</span></li>
                    </td>
                    <td></td>
                    <td> 
                    <span style={{fontSize: '40px'}}  className=' d-flex justify-content-end align-content-end align-items-end text-white'>
                        {arrayEstadistico.reduce((acc, curr) => acc + curr.items.length, 0)}
                        
                    </span>
                    </td>
                </tr>
        </Table>
  )
}
