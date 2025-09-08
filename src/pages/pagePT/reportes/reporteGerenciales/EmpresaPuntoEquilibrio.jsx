// Refactor completo de EmpresaPuntoEquilibrio.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Table } from 'react-bootstrap'
import { useReportePuntoEquilibrioStore } from './useReportePuntoEquilibrioStore'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { FechaRangeMES } from '@/components/RangeCalendars/FechaRange'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { ModalConceptos } from './ModalConceptos'

export const EmpresaPuntoEquilibrio = ({ id_empresa, background, textEmpresa, bgHEX, id_empresa_ventas }) => {
  const { obtenerGastosxFecha, dataGastos, dataPrestamos } = useReportePuntoEquilibrioStore()
  const { obtenerVentasPorFecha, dataVentaxFecha } = useVentasStore()
  const { RANGE_DATE } = useSelector(e => e.DATA)

  useEffect(() => {
    obtenerGastosxFecha(RANGE_DATE, id_empresa)
    obtenerVentasPorFecha(RANGE_DATE, id_empresa_ventas)
  }, [id_empresa, RANGE_DATE])
  const [dataProp, setdataProp] = useState({ isView: false, data: [] })
  const openModal = data => setdataProp({ isView: true, data: data.conceptos })
  const closeModal = () => setdataProp({ isView: false, data: [] })
  const totalMontopen = useMemo(() => dataGastos.reduce((sum, g) => sum + (g.montopen || 0), 0), [dataGastos])
  const totalMontousd = useMemo(() => dataGastos.reduce((sum, g) => sum + (g.montousd || 0), 0), [dataGastos])
  const productos = dataVentaxFecha.productos || []
  const membresias = dataVentaxFecha.membresias || []
  const sumaventaProductos = productos.reduce((sum, p) => sum + p.tarifa_monto, 0)
  const getMembresiaData = (cond) => membresias.filter(cond).reduce((acc, item) => {
    acc.cantidad++
    acc.total += item.tarifa_monto
    return acc
  }, { cantidad: 0, total: 0 })
  console.log({membresias, dataVentaxFecha});
  
  const rei = getMembresiaData(m => m.id_origen === 692)
  const reno = getMembresiaData(m => m.id_origen === 691)
  const nuevos = getMembresiaData(m => m.id_origen !== 691 && m.id_origen !== 692)
  const ventasPartidas = {
    cantRei: rei.cantidad,
    cantReno: reno.cantidad,
    cantNuevo: nuevos.cantidad,
    cantProd: productos.length,
    sumaventaRei: rei.total,
    sumaventaReno: reno.total,
    sumaventaNuevos: nuevos.total,
    sumaventaProductos,
    total: rei.total + reno.total + nuevos.total,
    cantTotal: rei.cantidad + reno.cantidad + nuevos.cantidad
  }

  return (
    <div className="w-100">
      <FechaRangeMES rangoFechas={RANGE_DATE} textColor={bgHEX} />
      <br />
      <Row>
        <Col lg={6}>
          <TableGastos data={dataGastos} background={background} textEmpresa={textEmpresa} onOpen={openModal} totalPEN={totalMontopen} totalUSD={totalMontousd} id_empresa={id_empresa} />
          <TablePrestamos data={dataPrestamos} id_empresa={id_empresa} />
        </Col>
        <Col className='ml-8'>
          <TableVentas background={background} textEmpresa={textEmpresa} ventasPartidas={ventasPartidas} />
          <TableResumen totalIngresos={ventasPartidas.total} totalEgresosPEN={totalMontopen} totalEgresosUSD={totalMontousd} id_empresa={id_empresa} textEmpresa={textEmpresa} background={background} />
        </Col>
      </Row>
      <ModalConceptos background={background} textEmpresa={textEmpresa} onHide={closeModal} show={dataProp.isView} dataProp={dataProp.data} />
    </div>
  )

}

const TableGastos = ({ data, background, textEmpresa, onOpen, totalPEN, totalUSD, id_empresa }) => (
  <Table striped style={{fontSize: '25px'}}>
    <thead className={background}>
      <tr>
        <th className="text-white" colSpan={2}>EGRESOS</th>
        <th className="text-white text-center">S/.</th>
        {/* <th className="text-white text-center">{id_empresa !== 601 ? <span className="text-ISESAC">$</span> : '$'}</th> */}
      </tr>
    </thead>
    <tbody>
      {/* {JSON.stringify(data, null, 2)} */}
      {data.map((g, i) => (
        <tr key={i}>
          <td colSpan={2} className="bg-porsiaca text-left fw-bold" onClick={() => onOpen(g)}>
            <div className={`${textEmpresa}`}>
              {i + 1}. {g.grupo}
            </div>
          </td>
          <td className="text-end bg-porsiaca">
            <NumberFormatMoney amount={g.montopen +(g.montousd*3.7) } />
          </td>
        </tr>
      ))}
    </tbody>
    <tfoot className={background}>
      <tr>
        <td colSpan={2} className="text-white fw-bold">Total</td>
        <td className="text-end text-white fw-bold"><NumberFormatMoney amount={totalPEN+(totalUSD*3.7)} /></td>
        {/* <br/>{totalUSD} */}
        {/* <td className="text-end text-white fw-bold"><NumberFormatMoney amount={-totalUSD} /></td> */}
      </tr>
    </tfoot>
  </Table>
)

const TablePrestamos = ({ data, id_empresa }) => (
  <Table striped style={{fontSize: '25px'}}>
    <thead className="bg-azulfuerte">
      <tr>
        <th></th>
        <th>PRESTAMOS</th>
        <th>S/.</th>
        {/* <th>{id_empresa !== 601 ? <span className="text-ISESAC">$</span> : '$'}</th> */}
      </tr>
    </thead>
    <tbody>
      {data.map((g, i) => (
        <tr key={i}>
          <td className="bg-porsiaca">{i + 1}</td>
          <td className="bg-porsiaca">PRESTAMOS RAL</td>
          <td className="text-end bg-porsiaca"><NumberFormatMoney amount={g.montopen} /></td>
        </tr>
      ))}
    </tbody>
  </Table>
)

const TableVentas = ({ background, textEmpresa, ventasPartidas }) => {
  const conceptos = [
    { label: 'NUEVOS', cantidad: ventasPartidas.cantNuevo, monto: ventasPartidas.sumaventaNuevos },
    { label: 'RENOVACIONES', cantidad: ventasPartidas.cantReno, monto: ventasPartidas.sumaventaReno },
    { label: 'REINSCRIPCIONES', cantidad: ventasPartidas.cantRei, monto: ventasPartidas.sumaventaRei },
    { label: 'MONKEY FIT (USUARIOS)', cantidad: 0, monto: ventasPartidas.monkfit || 0 },
  ]

  return (
    <>
      <Table striped style={{fontSize: '25px'}}>
        <thead className={background}>
          <tr>
            <th className='text-white'>INGRESOS</th><th className='text-white'>cant.</th><th className='text-white'>S/.</th>
          </tr>
        </thead>
        <tbody>
          {conceptos.map((c, i) => (
            <tr key={i}>
              <td className="bg-porsiaca text-start">
                <div className={`${textEmpresa} fw-bold`}>
                  {i + 1}. {c.label}
                </div>
              </td>
              <td className="text-end bg-porsiaca">{c.cantidad}</td>
              <td className="text-end bg-porsiaca"><NumberFormatMoney amount={c.monto} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot className={background}>
          <tr>
            <td className="fw-bold text-white">Total</td>
            <td className="fw-bold text-white text-end">{ventasPartidas.cantTotal}</td>
            <td className="fw-bold text-white text-end"><NumberFormatMoney amount={ventasPartidas.total} /></td>
          </tr>
        </tfoot>
      </Table>

      <Table striped>
        <thead className={background} style={{fontSize: '25px'}}>
          <tr>
            <th className='text-white'>PRODUCTOS</th>
            <th className='text-end text-white'><div className='' style={{width: '15px'}}>{ventasPartidas.cantProd}</div></th>
            <th className='text-end text-white'><div className='' style={{width: '15px'}}><NumberFormatMoney amount={ventasPartidas.sumaventaProductos} /></div></th>
          </tr>
        </thead>
      </Table>
    </>
  )
}

const TableResumen = ({ totalIngresos, totalEgresosPEN, totalEgresosUSD, id_empresa, textEmpresa, background }) => (
  <Table striped style={{fontSize: '25px'}}>
    <thead className={`${background} `}>
      <tr >
        <th className='text-white'>UTILIDAD</th>
        <th className='text-white text-end'>S/.</th>
        {/* <th>{id_empresa !== 601 ? <span className="text-ISESAC">$</span> : '$'}</th> */}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="bg-porsiaca text-start">
          <div className={`${textEmpresa} fw-bold`}>
            INGRESOS
          </div>
          </td>
        <td className="text-end bg-porsiaca fw-bold"><NumberFormatMoney amount={totalIngresos} /></td>
        {/* <td></td> */}
      </tr>
      <tr>
        <td className="bg-porsiaca text-start">
          <div className={`${textEmpresa} fw-bold`}>
            EGRESOS
          </div>
        </td>
        <td className="text-end bg-porsiaca fw-bold text-change">-<NumberFormatMoney amount={totalEgresosPEN+(totalEgresosUSD*3.7)} /></td>
        {/* <td className="text-end bg-porsiaca fw-bold text-change"><NumberFormatMoney amount={-totalEgresosUSD} /></td> */}
      </tr>
      <tr>
        <td className="bg-porsiaca text-start">
          <div className={`${textEmpresa} fw-bold`}>
            TOTAL
          </div>
        </td>
        <td className={`text-end bg-porsiaca fw-bold ${totalIngresos - (totalEgresosPEN+(totalEgresosUSD*3.7)) < 0 ? 'text-change' : ''}`}>
          <NumberFormatMoney amount={totalIngresos - (totalEgresosPEN+(totalEgresosUSD*3.7))} />
        </td>
        {/* <td className="text-end bg-porsiaca fw-bold text-change">
          <NumberFormatMoney amount={-totalEgresosUSD} />
        </td> */}
      </tr>
    </tbody>
  </Table>
)
