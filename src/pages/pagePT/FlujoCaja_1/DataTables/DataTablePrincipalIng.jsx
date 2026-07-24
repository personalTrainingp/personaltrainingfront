import { FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import { InputText } from '@/components/InputText';
import { onUpdateGrupoGastos, onUpdateGrupoIngresos } from '@/store/dataImaginaria/imaginariaSlice';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

export const  DataTablePrincipalIng = ({anio, cat='', id_empresa, sumaTotal, itemsxDias=[], conceptos=[], fechas=[], nombreGrupo='', index='', bgTotal, bgPastel, data=[]}) => {
  const fecha = new Date()
  const anioActual = fecha.getFullYear()
  const mesActual = fecha.getMonth()+1
  const sumaMontototal = conceptos.reduce((total, item)=>item?.monto+total, 0)
  const sumaLentotal = conceptos.reduce((total, item)=>item?.len+total, 0)
  const funSumaTotal = (mes)=>{
    return conceptos.flatMap(f=>f.itemsxDia).filter(f=>f.mes===mes).reduce((total, item)=>total+item.monto, 0)
  }
  const funSumatoriaFinal = (mes=1)=>{
    return data.flatMap(f=>f.itemsxDia).filter(f=>f.mes===mes).reduce((total, item)=>total+item.monto, 0)
  }
  return (
    <>
      <Table className="tabla-egresos fs-3" style={{ width: '100%' }} bordered>
        <thead>
          <tr>
            <th style={{width: '500px'}} className={` text-break fs-1 border-top-10 border-bottom-10 border-left-10 border-right-10 bg-white sticky-td-${id_empresa}-white text-black `}>{index}. {nombreGrupo}</th>
            {
              fechas.map(f=>{
                return (
                  <React.Fragment key={`${f.mesStr}`}>
                  <td className={`text-center border-black ${bgTotal}`} style={{width: '180px'}}>{dayjs(`${f.anio}-${f.mes}-1`, 'YYYY-M-D').format('MMM [.]')}</td>
                  </React.Fragment>
                )
              })
            }
            <th className={`text-center border-top-10 border-left-10 border-bottom-10 sticky-td-1-right-${id_empresa}`} style={{width: '200px'}}>TOTAL <br/> ANUAL</th>
            <th className='text-center border-top-10 border-bottom-10' style={{width: '120px'}}>%<br/>PART. <br/> ANUAL</th>
            <th className={`text-center border-top-10 border-right-10 border-bottom-10 sticky-td-right-${id_empresa}`} style={{width: '200px'}}>PROMEDIO<br/>MENSUAL <br/> ANUAL</th>
          </tr>
        </thead>
        <tbody>
          {
            // TODO: ACA HUBO UN SORT: .sort((a, b)=>a.orden-b.orden)
            conceptos.filter(f=>f.monto_proyectado!==0 || f.monto!==0).map((c, i)=>{
              return (
                <tr key={''}>
                  <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 ${bgTotal} ${c.id==1272 ?`sticky-td-${id_empresa}-white`:''} ${c.id==941 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1117 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1124 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1046 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1285 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1134 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1247 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1251 ? `sticky-td-${id_empresa}-white`:''} ${c.id==1271 ? `sticky-td-${id_empresa}-white`:''}`}>
                    <span 
                      className={`${c.id==1272 ?`bg-white text-black`:''} ${c.id==941 ? `bg-white text-black`:''} ${c.id==1117 ? 'bg-white text-black':''} ${c.id==1124 ? 'bg-white text-black':''} ${c.id==1046 ? 'bg-white text-black':''} ${c.id==1285 ? 'bg-white text-black':''} ${c.id==1134 ? 'bg-white text-black':''} ${c.id==1247 ? 'bg-white text-black':''} ${c.id==1251 ? 'bg-white text-black':''} ${c.id==1271 ? 'bg-white text-black':''}`}
                    >
                      {i+1}. {(c.nombre_gasto)}
                    </span>
                  </td>
                  {
                    c.itemsxDia.map(m => (
                          <ItemMes
                              key={m.id}
                              fecha={m.fecha}
                              id_concepto={c.id}
                              m={m}
                              mesSTR={m.mesSTR}
                              cat={cat}
                              monto_no_pagados={m.monto_no_pagados}
                              monto_pagados={m.monto_pagados}
                          />
                      ))
                  }
                <td className={`text-center border-left-10 sticky-td-1-right-${id_empresa} sticky-td-${id_empresa}-white`}>
                  {
                    cat==='ingresos'? (
                      <NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes<=mesActual-1).reduce((total, im)=>total+im?.monto, 0)}/>
                    ): (
                      <NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes<=mesActual-1).reduce((total, im)=>total+im?.monto, 0)}/>
                    )
                  }
                  </td>
                <td className='fs-3 text-center '>{(((c.itemsxDia?.reduce((total, im)=>total+im?.monto, 0))/sumaMontototal)*100).toFixed(2)}%</td>
                <td className={`text-center border-right-10 sticky-td-right-${id_empresa} sticky-td-${id_empresa}-white`}>
                  {
                    cat==='ingresos'? (
                      <NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes<=mesActual-1).reduce((total, im)=>total+im?.monto, 0)/Number(mesActual-1)}/>
                    ): (
                      <NumberFormatMoney amount={c.itemsxDia?.filter(f=>f.mes<=mesActual-1).reduce((total, im)=>total+im?.monto, 0)/Number(mesActual-2)}/>
                    )
                  }
                  </td>
                </tr>
              )
            })
          }
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10  ${bgTotal}`}>TOTAL</td>
            {
              fechas.map((f, i)=>{
                return (
                  <React.Fragment key={i}>
                  <td className={`text-center ${bgTotal}`} style={{width: '120px'}}>
                    <NumberFormatMoney amount={funSumaTotal(f.mes)}/>
                  </td>
                  </React.Fragment>
                )
              })
            }
            <th colSpan={3} className={`text-center fs-2 ${bgTotal} border-left-10`}>TOTAL ANUAL</th>
          </tr>
          <tr>
            <td className={`sticky-td-${id_empresa} border-left-10 border-right-10 border-bottom-10 ${bgTotal}`}>% <span className='mx-1'></span> PARTICIPACION</td>
            {
              fechas.map((f, i)=>{
                return (
                  <React.Fragment key={i}>
                  <td className={`text-center ${bgTotal}`} style={{width: '120px'}}>
                    <NumberFormatMoney amount={(funSumaTotal(f.mes)/funSumatoriaFinal(f.mes))*100}/>
                  </td>
                  </React.Fragment>
                )
              })
            }
            <td className={`text-end border-bottom-10 border-left-10`}>
              <NumberFormatMoney
              className='fs-2'
                amount={
                  sumaMontototal
                }
              />
            </td>
            <td className='fs-2 text-center border-bottom-10 '>{'100'}</td>
            <td className={`fs-2 text-center border-bottom-10 border-right-10`}><NumberFormatMoney className='fs-2' amount={sumaMontototal/dataTotalFormular(anio)}/></td>
          </tr>
        </tbody>
      </Table>

    </>
  )
}
export const ItemMes = ({mesSTR, monto_pagados, monto_no_pagados, id_concepto, fecha, cat}) => {
  const dispatch = useDispatch();

  const [editando, setEditando] = useState(false);
  const [montoPagado, setMontoPagado] = useState(monto_pagados);

  useEffect(() => {
    setMontoPagado(monto_pagados);
  }, [monto_pagados]);

  const guardar = () => {
    dispatch(
      onUpdateGrupoGastos({
        id_gasto: id_concepto,
        fecha,
        monto_pagados: Number(montoPagado),
      })
    );

    setEditando(false);
  };

  const cancelar = () => {
    setMontoPagado(monto_pagados);
    setEditando(false);
  };

  return (
    <td className="text-center">
      {mesSTR}

      <div>
        {(monto_pagados !== 0 || monto_no_pagados === 0) && (
          <>
            {!editando ? (
              <div
                className="fs-2"
                style={{ cursor: "pointer" }}
                onDoubleClick={() => setEditando(true)}
                title="Doble clic para editar"
              >
                <NumberFormatMoney amount={montoPagado} />
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <InputText
                  autoFocus
                  className="fs-2 text-center"
                  style={{ width: "120px" }}
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") guardar();
                    if (e.key === "Escape") cancelar();
                  }}
                />

                <button
                  className="btn btn-success btn-sm"
                  onClick={guardar}
                >
                  ✔
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={cancelar}
                >
                  ✖
                </button>
              </div>
            )}
          </>
        )}

        {monto_no_pagados > 0 && (
          <>
            <span className="text-change">
              <NumberFormatMoney amount={monto_no_pagados} />
            </span>
            <br />
          </>
        )}
      </div>
    </td>
  );
}

function dataTotalFormular(anio=2024) {
    const hoy = new Date()
  // Año actual
const year = hoy.getFullYear();

// Mes actual (0 = enero, 11 = diciembre)
const month = hoy.getMonth()+ 1;
const ultimaFecha = new Date(year, month , 0);
const diaUltimaFecha = ultimaFecha.getDate()
const diaActual = hoy.getDate()
if(anio===year){
  return diaActual==diaUltimaFecha?0:month-1;
}else{
  return 12;
}
}
