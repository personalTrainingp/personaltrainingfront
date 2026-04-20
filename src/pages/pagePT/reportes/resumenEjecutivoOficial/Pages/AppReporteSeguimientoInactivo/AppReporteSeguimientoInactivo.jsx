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
          <tr className='bg-change'>
            <th className='fs-2' style={{width: '350px'}}>
              Venta →
              <br/>
              Vencimiento ↓
            </th>

            {tabla?.columnas?.map((col) => (
              <th key={col} className='fs-2 text-center text-white' style={{width: '240px'}}>
                <div className='text-center'>
                  {DateMaskStr(col, 'MMMM')}
                  <br/>
                  {DateMaskStr(col, 'YYYY')}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tabla.filas?.map((fila) => (
            <tr key={fila} className='fs-2 text-center text-white' style={{width: '240px'}}>
              
              {/* eje Y */}
              <td>
                <div className='text-center'>
                  <div className='text-center'>
                    {DateMaskStr(fila, 'MMMM')}
                    <br/>
                    {DateMaskStr(fila, 'YYYY')}
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
                    <div className='fs-1'>
                    {(cell?.cantidad!=0?cell?.cantidad:'')}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

      </Table>
    </div>
    </div>
  )
}
