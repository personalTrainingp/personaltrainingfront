import React, { useEffect, useState, useMemo } from 'react'
import Select from 'react-select'                    // <-- importar react-select
import { useFlujoCajaStore } from './hook/useFlujoCajaStore'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalDetallexCelda } from './ModalDetallexCelda'
import { useDispatch } from 'react-redux'
import { onSetViewSubTitle } from '@/store'
import { onSetRangeDate } from '@/store/data/dataSlice'

export const DatatableEgresos = ({
  id_enterprice,
  anio,
  nombre_empresa,
  background,
  arrayRangeDate,
  bgMultiValue
}) => {
  const [dataModal, setDataModal] = useState(null)
  const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false)
  const { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore()
  const dispatch = useDispatch()

  // 1) Nombres de los meses (índices 0–11)
  const mesesNombres = useMemo(
    () => [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMB.',
      'OCTUBRE',
      'NOVIEMB.',
      'DICIEMBRE'
    ],
    []
  )

  // 2) Crear opciones para react-select (value=1..12, label=“ENERO” etc)
  const monthOptions = useMemo(
    () =>
      mesesNombres.map((nombre, idx) => ({
        value: idx + 1,
        label: nombre
      })),
    [mesesNombres]
  )

  // 3) Estado local para los meses seleccionados (inicialmente, todos)
  const [selectedMonths, setSelectedMonths] = useState(monthOptions)

  // 4) Cada vez que cambia empresa o año, recargar datos
  useEffect(() => {
    obtenerGastosxANIO(anio, id_enterprice)
  }, [anio, id_enterprice])

  // 5) Al cambiar nombre_empresa, actualizar subtítulo y rango de fechas
  useEffect(() => {
    dispatch(onSetViewSubTitle(nombre_empresa))
    dispatch(onSetRangeDate(arrayRangeDate))
  }, [nombre_empresa])

  // 6) Calcular totales por grupo
  const totalesPorGrupo = useMemo(() => {
    return dataGastosxANIO.map(g => {
      const mesesSuma = Array.from({ length: 12 }, () => 0)
      g.conceptos.forEach(concepto => {
        concepto.items.forEach(({ mes, monto_total }) => {
          mesesSuma[mes - 1] += monto_total || 0
        })
      })
      const totalAnual = mesesSuma.reduce((sum, m) => sum + m, 0)
      return {
        grupo: g.grupo,
        mesesSuma,
        totalAnual,
        conceptos: g.conceptos
      }
    })
  }, [dataGastosxANIO])

  // 7) Calcular totales generales por mes para la última fila
  const { totalPorMes, totalGeneral } = useMemo(() => {
    const totales = Array.from({ length: 12 }, () => 0)
    dataGastosxANIO.forEach(grupo => {
      grupo.conceptos.forEach(concepto => {
        concepto.items.forEach(item => {
          totales[item.mes - 1] += item.monto_total || 0
        })
      })
    })
    const sumaAnual = totales.reduce((acc, v) => acc + v, 0)
    return { totalPorMes: totales, totalGeneral: sumaAnual }
  }, [dataGastosxANIO])

  // 8) Funciones para abrir/cerrar el modal
  const onCloseModalDetallexCelda = () => {
    setIsOpenModalDetallexCelda(false)
    setDataModal(null)
  }
  const onOpenModalDetallexCelda = itemDetail => {
    setDataModal(itemDetail)
    setIsOpenModalDetallexCelda(true)
  }

  // 9) Extraer lista de meses numéricos seleccionados (por ejemplo [1, 3, 7])
  const mesesSeleccionadosNums = useMemo(
    () => selectedMonths.map(opt => opt.value),
    [selectedMonths]
  )
  const widthHeadergrupos = 150
  const backgroundMultiValue = bgMultiValue
  return (
    <>
      <div>
        {/* === MULTI‐SELECT PARA ELEGIR MESES === */}
        <div style={{ marginBottom: '1rem', width: '95vw' }}>
          <Select
            options={monthOptions}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            value={selectedMonths}
            onChange={setSelectedMonths}
            placeholder="Selecciona uno o varios meses..."
            styles={{
              control: provided => ({
                ...provided,
                fontSize: '1.9rem',
                color: 'white'
              }),
              menuList: (provided, state) => ({
                ...provided,
                padding: '12px 16px',   // Espaciado interno para que cada opción sea más “alta”
              }),
                 // Contenedor de las etiquetas seleccionadas ("pills")
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: backgroundMultiValue,       // fondo rojo para cada etiqueta
                color: 'white'
              }),
                  // Texto dentro de cada pill
              multiValueLabel: (provided) => ({
                ...provided,
                color: 'white',               // texto blanco sobre rojo
                fontSize: '1.45vw',
              }),
            }}
          />
        </div>

        {/* === TABLA ÚNICA CON TODOS LOS GRUPOS Y LA SUMA GENERAL === */}
        <div className="table-responsive" style={{ width: '95vw' }}>
          <Table striped responsive>
            {/* ==== Para cada grupo: encabezado, conceptos, total de grupo ==== */}
            {totalesPorGrupo.map((grp, i) => (
              <React.Fragment key={grp.grupo}>
                {/* Encabezado del grupo */}
                <thead className={background}>
                  <tr>
                    <th className="text-black fs-2">
                      <div className="p-1 rounded rounded-3" style={{ width: 350 }}>
                        {i + 1}. {grp.grupo==='ATENCIÓN AL CLIENTE'?(<>ATENCION AL <span className='ml-5'>CLIENTE</span></>):grp.grupo==='COMPRA PRODUCTOS/ACTIVOS'?(<>COMPRA INSUMOS <span className='ml-5'>ACTIVOS</span></>):grp.grupo}
                      </div>
                    </th>
                    {/* Sólo iterar sobre los meses seleccionados */}
                    {mesesSeleccionadosNums.map(mesNum => (
                      <th key={mesNum} className="text-white text-center p-1 fs-2">
                        <div className='' style={{ width: 150 }}>
                          {mesesNombres[mesNum - 1]}
                        </div>
                      </th>
                    ))}
                    <th className="text-center p-1 fs-2 text-black ">
                      <div className='' style={{ width: 150 }}>
                        TOTAL
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Filas de cada concepto */}
                  {grp.conceptos.map((c, idx) => {
                    const totalConcepto = c.items.reduce(
                      (sum, it) => sum + (it.monto_total || 0),
                      0
                    )
                    return (
                      <tr key={c.concepto}>
                        <td className="fw-bold fs-2">
                          <div>
                            {idx + 1}.{' '}
                            {c.concepto ===
                            'ARRENDAMIENTO DE LOCAL  INCLUYE:  LUZ DEL SUR, SEDAPAL, ARBITRIOS' ? (
                              <>
                                ARRENDAMIENTO DE LOCAL  INCLUYE:{' '}
                                <br />
                                LUZ DEL SUR
                                <br /> SEDAPAL
                                <br /> ARBITRIOS
                              </>
                            ) : (
                              c.concepto
                            )}
                          </div>
                        </td>
                        {/* Celdas de monto por mes seleccionado */}
                        {mesesSeleccionadosNums.map(mesNum => {
                          const itemMes =
                            c.items.find(it => it.mes === mesNum) || {
                              monto_total: 0,
                              mes: mesNum
                            }
                          return (
                            <td
                              key={mesNum}
                              className="text-center fs-1"
                            >
                              <div
                                className="cursor-text-primary fs-2"
                                style={{ width: 150 }}
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
                        {/* Total anual del concepto */}
                        <td className="text-center fs-2" style={{width: '20px'}}>
                          <div
                            className="cursor-text-primary fw-bold"
                            style={{ width: 150 }}
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
                    <td className="fw-bolder fs-2">TOTAL</td>
                    {mesesSeleccionadosNums.map(mesNum => (
                      <td key={mesNum} className="text-center fw-bolder fs-2">
                        <div 
                          // className='bg-danger'
                            style={{ width: 150 }}
                          >
                          <NumberFormatMoney amount={grp.mesesSuma[mesNum - 1]} />
                        </div>
                      </td>
                    ))}
                    <td className="text-center fw-bolder fs-2">
                      <div 
                          // className='bg-danger'
                            style={{ width: 150 }}
                        >
                      <NumberFormatMoney amount={grp.totalAnual} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </React.Fragment>
            ))}

            {/* ==== Sección final: encabezado de MESES y fila de GASTOS ==== */}
            <thead className={background}>
              <tr>
                <th style={{ width: '300px' }} className="text-black fs-2">
                  MES
                </th>
                {mesesSeleccionadosNums.map(mesNum => (
                  <th key={mesNum} className="text-white text-center p-1 fs-2">
                    <div 
                    // className='bg-danger' 
                     style={{ width: 150 }}
                    >
                      {mesesNombres[mesNum - 1]}
                    </div>
                  </th>
                ))}
                    <th className="text-center p-1 fs-2 text-black ">
                      <div className='' style={{ width: 150 }}>
                        TOTAL
                      </div>
                    </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold fs-2">TOTAL EGRESOS</td>
                {mesesSeleccionadosNums.map(mesNum => (
                  <td
                    key={mesNum}
                    className="text-center fs-2 fw-bold"
                    style={{ width: '100px' }}
                  >
                    <div className=''>
                      <NumberFormatMoney amount={totalPorMes[mesNum - 1]} />
                    </div>
                  </td>
                ))}
                <td className="text-center fw-bolder fs-2">
                  <div 
                    // className='bg-danger' 
                     style={{ width: 150 }}
                  >
                    <NumberFormatMoney amount={totalGeneral} />
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <ModalDetallexCelda
        data={dataModal}
        onHide={onCloseModalDetallexCelda}
        obtenerGastosxANIO={obtenerGastosxANIO}
        show={isOpenModalDetallexCelda}
        id_enterprice={id_enterprice}
        anio={anio}
      />
    </>
  )

}


export const TablaSumaGastosPorMes = ({
  dataGastosxANIO,
  background,
  mesesMostrar = [],        // array de números de mes (1..12) a mostrar
  mesesNombres
}) => {
  // Calcular totales de todos los grupos y conceptos, mes a mes
  const { totalPorMes, totalGeneral } = useMemo(() => {
    const totales = Array.from({ length: 12 }, () => 0)

    dataGastosxANIO.forEach(grupo => {
      grupo.conceptos.forEach(concepto => {
        concepto.items.forEach(item => {
          totales[item.mes - 1] += item.monto_total || 0
        })
      })
    })

    const sumaAnual = totales.reduce((acc, v) => acc + v, 0)
    return { totalPorMes: totales, totalGeneral: sumaAnual }
  }, [dataGastosxANIO])

  return (
    <div className='w-25' style={{ marginBottom: '2rem' }}>
      <div className="table-responsive" style={{ width: '100%' }}>
        <Table striped responsive>
          <thead className={background}>
            <tr>
              <th style={{width: '300px'}} className="text-black fs-2">MESES</th>

              {/* Sólo las columnas de meses seleccionados */}
              {mesesMostrar.map(mesNum => (
                <th key={mesNum} className="text-white fs-4">
                  <div className=''>
                    {mesesNombres[mesNum - 1]}
                  </div>
                </th>
              ))}

              <th className="fw-bolder fs-2">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold fs-2">GASTOS</td>
              {mesesMostrar.map(mesNum => (
                <td
                  key={mesNum}
                  className="text-center fs-2"
                  style={{ width: '70px' }}
                >
                  <NumberFormatMoney amount={totalPorMes[mesNum - 1]} />
                </td>
              ))}
              <div className='fs-2 fw-bold'>
                <NumberFormatMoney amount={totalGeneral} />
              </div>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}
