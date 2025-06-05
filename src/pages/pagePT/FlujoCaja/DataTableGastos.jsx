import React, { useEffect, useState, useMemo } from 'react'
import { useFlujoCajaStore } from './hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalDetallexCelda } from './ModalDetallexCelda'
import { useDispatch } from 'react-redux'
import { onSetViewSubTitle } from '@/store'
import { onSetRangeDate } from '@/store/data/dataSlice'
import { useGastosCIRCUSYSE } from './hook/useGastosCIRCUSYSE'

export const DataTableGastos = ({ id_enterprice, anio, nombre_empresa, background, arrayRangeDate }) => {
  const [dataModal, setDataModal] = useState(null)
  const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false)
  const { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore()
  const { obtenerGastosxANIOCIRCUSYSE:obtenerGastosCIRCUSYANIO, dataGasto:dataGastosCIRCUSYANIO } = useGastosCIRCUSYSE()
  const dispatch = useDispatch()

  // Nombres de los meses (índices 0–11)
  const mesesNombres = useMemo(
    () => [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ],
    []
  )

  // Cargar datos al cambiar empresa o año
  useEffect(() => {
    obtenerGastosCIRCUSYANIO()
    obtenerGastosxANIO(anio, id_enterprice)
  }, [anio, id_enterprice])
  console.log({dataGastosCIRCUSYANIO});
  
  // Actualizar subtítulo cuando cambie la empresa
  useEffect(() => {
    dispatch(onSetViewSubTitle(nombre_empresa))
    dispatch(
      onSetRangeDate(arrayRangeDate))
  }, [nombre_empresa])

  // Calcula los totales por mes para cada grupo (memoizado)
  const totalesPorGrupo = useMemo(() => {
    return dataGastosCIRCUSYANIO.map(g => {
      // sumarMontosPorMes optimizado con reduce
      const mesesSuma = Array.from({ length: 12 }, () => 0)

      g.conceptos.forEach(concepto => {
        concepto.items.forEach(({ mes, monto_total }) => {
          // mes-1 porque suponemos que mes viene 1–12
          mesesSuma[mes - 1] += monto_total || 0
        })
      })
      // total anual del grupo
      const totalAnual = mesesSuma.reduce((sum, m) => sum + m, 0)

      return {
        grupo: g.grupo,
        mesesSuma,
        totalAnual,
        conceptos: g.conceptos
      }
    })
  }, [dataGastosCIRCUSYANIO])

  const onCloseModalDetallexCelda = () => {
    setIsOpenModalDetallexCelda(false)
    setDataModal(null)
  }

  const onOpenModalDetallexCelda = (itemDetail) => {
    setDataModal(itemDetail)
    setIsOpenModalDetallexCelda(true)
  }

  return (
    <>
    <div style={{width: '170rem'}}>
      {totalesPorGrupo.map((grp, i) => (
        <div key={grp.grupo}>
          <div className="table-responsive" style={{ maxWidth: '100%' }}>
            <Table responsive>
              <thead className={background}>
                <tr>
                  <th className="text-black fs-1">
                    <span className="p-1 rounded rounded-3" style={{ width: 360 }}>
                      {i + 1}. {grp.grupo}
                    </span>
                  </th>
                  {mesesNombres.map(nombreMes => (
                    <th key={nombreMes} className="text-white text-center p-1 fs-2">
                      {nombreMes}
                    </th>
                  ))}
                  <th className="text-center p-1 fs-1 text-black">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {grp.conceptos.map((c, idx) => {
                  // Total anual de cada concepto
                  const totalConcepto = c.items.reduce((sum, it) => sum + (it.monto_total || 0), 0)
                  return (
                    <tr key={c.concepto} className={`${c.concepto.includes('(CIRCUS)') ? 'bg-danger' : ''}`}>
                      <td className="fw-bold fs-2 ">
                        <div style={{ width: 550 }}>
                          {idx + 1}. {c.concepto==='ARRENDAMIENTO DE LOCAL  INCLUYE:  LUZ DEL SUR, SEDAPAL, ARBITRIOS'?(<>ARRENDAMIENTO DE LOCAL  INCLUYE:  <br/>LUZ DEL SUR<br/> SEDAPAL<br/> ARBITRIOS</>):c.concepto}
                        </div>
                      </td>

                      {mesesNombres.map((_, mesIdx) => {
                        // Intentamos obtener el item de ese mes (suponiendo ordenado por mes)
                        const itemMes = c.items.find(it => it.mes === mesIdx + 1) || { monto_total: 0, mes: mesIdx + 1 }
                        return (
                          <td key={mesIdx} className="text-center fs-2">
                            <div
                              className="cursor-text-primary"
                              onClick={() =>
                                onOpenModalDetallexCelda({
                                  ...itemMes,
                                  concepto: c.concepto,
                                  grupo: grp.grupo
                                })
                              }
                            >
                              <NumberFormatMoney amount={itemMes.monto_total} />
                            </div>
                          </td>
                        )
                      })}

                      <td className="text-center fs-2">
                        <div
                          className="cursor-text-primary fw-bold"
                          onClick={() =>
                            onOpenModalDetallexCelda({
                              concepto: c.concepto,
                              grupo: grp.grupo,
                              mes: null,
                              monto_total: totalConcepto
                            })
                          }
                        >
                          <NumberFormatMoney amount={totalConcepto} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {/* Fila de totales del grupo */}
                <tr>
                  <td className="fw-bolder fs-1">TOTAL</td>
                  {grp.mesesSuma.map((montoMes, idx) => (
                    <td key={idx} className="text-center fw-bolder fs-1">
                      <NumberFormatMoney amount={montoMes} />
                    </td>
                  ))}
                  <td className="text-center fw-bolder fs-1">
                    <NumberFormatMoney amount={grp.totalAnual} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      ))}

    </div>

      <ModalDetallexCelda
        data={dataModal}
        onHide={onCloseModalDetallexCelda}
        show={isOpenModalDetallexCelda}
      />
    </>
  )
}
