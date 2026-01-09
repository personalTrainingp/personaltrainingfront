import { NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useMemo } from 'react'
import { Table } from 'react-bootstrap'
import { TotalesGeneralesxMes, TotalesPorGrupo } from './helpers/totalesxGrupo'

export const TableCuentas = ({dataIngresosxMes=[], header, background, bgTotal, mesesSeleccionadosNums, mesesNombres, onOpenModalDetallexCelda}) => {
    const totalesPorGrupo = useMemo(()=>{
        return TotalesPorGrupo(dataIngresosxMes).dataTotal
    }, [dataIngresosxMes])
    const { totalPorMes, totalGeneral } = useMemo(() => {
        const { totalGeneral, totalPorMes } = TotalesGeneralesxMes(dataIngresosxMes)
        return {
            totalGeneral,
            totalPorMes
        }
    }, [dataIngresosxMes]);
        
  console.log({totalesPorGrupo, totalPorMes, totalGeneral});
  
  return (
    <>
    <p className='fs-1'>{header}</p>
    <div  className="table-responsive" style={{ width: '95vw' }}>
        <Table className="tabla-egresos">
            <colgroup>
                    <col style={{ width: 350 }} />
                    {mesesSeleccionadosNums.map(mesNum => (
                    <col key={mesNum} style={{ width: 150 }} />
                    ))}
                </colgroup>
                {
                    totalesPorGrupo.map((grp, i, arr)=>{
                        const sumaTotalAnualGrupos = totalesPorGrupo.reduce(
                        (acc, g) => acc + g.totalAnual,
                        0
                        );
                        console.log({grp});
                        
                        return (
                            <React.Fragment key={grp.grupo}>
                                                    <thead className={bgTotal}>
                        <tr>
                            <th className=" fs-1">
                                <div
                                    className={`p-1 rounded rounded-3 ${bgTotal}`}
                                    style={{
                                    width: 450,
                                    hyphens: 'auto',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    lineHeight: '1.2',
                                    }}
                                    
                                    lang="es" // Importante para la división correcta de palabras
                                >
                                    {(
                                    <>
                                        {i + 1}. {grp.grupo}
                                    </>
                                    )}
                                </div>
                                </th>

                                {mesesSeleccionadosNums.map(mesNum => (
                                <th
                                    key={mesNum}
                                    className="text-white text-center p-1 fs-2"
                                >
                                    {mesesNombres[mesNum - 1]}
                                </th>
                                ))}

                                <th className={`${bgTotal} text-center p-1 fs-1`}>
                                TOTAL
                                </th>
                                <th className="text-white text-center p-1 fs-1">
                                %
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                {grp.conceptos?.map((c, idx) => {
                                    const totalConcepto = c.items.reduce(
                                    (sum, it) => sum + (it.monto_total || 0),
                                    0
                                    );
                                    
                                    const cantidadMovimiento = c.items.reduce(
                                    (sum, it) => sum + (it.lenthItems || 0),
                                    0
                                    );
                                    const pctConcepto = grp.totalAnual > 0
                                    ? ((totalConcepto / grp.totalAnual) * 100).toFixed(2)
                                    : '0.00';
                                    console.log({grp});
                                    
                                    return (
                                    <tr key={c.concepto}>
                                        <td className="fw-bold fs-2 sticky-td" style={{color: `${bgTotal}`}}>
                                            <div className="bg-white py-3">
                                            {idx + 1}. {c.concepto}
                                            <br/>
                                            <div >
                                                ({cantidadMovimiento})
                                            </div>
                                            </div>
                                        </td>
                                        {mesesSeleccionadosNums.map(mesNum => {
                                        const itemMes = c.items.find(it => it.mes === mesNum) || { monto_total: 0, mes: mesNum };
                                        return (
                                            <td key={mesNum} className="text-center fs-1">
                                                <div
                                                    className={`cursor-text-primary fs-2 bg-porsiaca text-right ${itemMes.monto_total<=0?'':'fw-bold'}`}
                                                    style={{ width: 150 }}
                                                    onClick={() => onOpenModalDetallexCelda({
                                                    ...itemMes,
                                                    concepto: c.concepto,
                                                    grupo: grp.grupo,
                                                    })}
                                                >
                                                    
                                                    <NumberFormatMoney amount={itemMes.monto_total} />
                                                </div>
                                            </td>
                                        );
                                        })}
                                                                                <td className='fs-2'>
                                                                                    <div className='text-right'>
                                                                                            <NumberFormatMoney amount={totalConcepto} />
                                                                                    </div>
                                                                                </td>
                                    </tr>
                                    );
                                })}
                            </tbody>

                            </React.Fragment>
                        )
                    })
                }
        </Table>
    </div>
    </>
  )
}
