import React, { useEffect } from 'react'
import { useInformeEjecutivoStore } from '../../useInformeEjecutivoStore'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from '../../helpers/generarMesYanio'
import { DateMask, DateMaskStr, DateMaskStr1 } from '@/components/CurrencyMask'

export const AppReporteSeguimientoInactivo = () => {
  const {obtenerSeguimientos, dataSeguimientos:tabla } = useInformeEjecutivoStore()
  useEffect(() => {
    obtenerSeguimientos()
  }, [])
  return (
    <div>
    <div style={{ overflow: "auto", maxHeight: "80vh" }}>
      <Table className="tabla-egresos" style={{width: '100%'}} bordered>
        
        <thead>
          <tr className=''>
            <th colSpan={2} className='fs-2 text-white bg-change' style={{width: '400px'}}>
              Venta
            </th>
            {agrupar(tabla.columnas?.map(f=>f.split('-')[0]))?.map((col) => (
              <td key={col} colSpan={col.cantidad} className={`sticky-top-598 ${(col.valor=='2024' || col.valor=='2026')?'bg-change-pastel':'bg-change'} text-white text-center fs-2`}
               style={{width: `${col.cantidad*200}px`}}
               >
                <div style={{fontSize: '60px'}}>
                  {col.valor}
                </div>
              </td>
            ))}
          </tr>
          <tr className=''>
            <th colSpan={2} className='fs-2 text-white bg-change'>
              Vencimiento
            </th>
            {tabla?.columnas?.map((col) => (
              <th key={col} className={`sticky-top-598-100 ${DateMaskStr(col, 'YYYY')==='2024' || DateMaskStr(col, 'YYYY')==='2026'?'bg-change-pastel':'bg-change'} text-white text-center fs-2`} 
              
              >
                <div className={`${DateMaskStr(col, 'YYYY')==='2024'?'bg-change-pastel':''} text-center`}>
                  {DateMaskStr(col, 'MMMM')}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tabla.filas?.map((fila, index) => {
            const anio = new Date(fila).getFullYear();
  const prevAnio = index > 0 ? new Date(tabla.filas[index - 1]).getFullYear() : null;

  const mostrarAnio = anio !== prevAnio;

            return (
            (
            <tr key={fila} className='fs-2 text-center text-white' style={{width: '440px'}}>
            {mostrarAnio && (
              <td rowSpan={
                tabla.filas.filter(f => new Date(f).getFullYear() === anio).length
              }>
                
                {anio.toString()}
              </td>
            )}
              {/* eje Y */}
              <td className='sticky-td-598 text-white'>
                <div className='text-center'>
                  <div className='text-center'>
                    {DateMaskStr(fila, 'MMMM')}
                  </div>
                </div>
              </td>
              {/* celdas */}
              {tabla.columnas.map((col) => {
                const cell = tabla.data?.[fila]?.[col];

                return (
                  <td
                    key={col}
                    style={{
                      // background: getColor(cell?.cantidad || 0),
                      cursor: "pointer"
                    }}
                    onClick={() => console.log(cell?.items)}
                  >
                    <div style={{fontSize: '70px'}}>
                    {(cell?.cantidad!=0?cell?.cantidad:'')}
                    </div>
                  </td>
                );
              })}
            </tr>
          )
            )
          })}
        </tbody>

      </Table>
    </div>
    </div>
  )
}
function agrupar(data=[]) {
  
const resultado = Object?.entries(
  data?.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {})
).map(([valor, cantidad]) => ({ valor, cantidad }));
return resultado;
}