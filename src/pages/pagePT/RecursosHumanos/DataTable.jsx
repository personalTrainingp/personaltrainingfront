import { NumberFormatMoney } from '@/components/CurrencyMask'
import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { ModalDataDetalleTable } from './ModalDataDetalleTable'

export const DataTable = () => {
    const [isOpenModalDetalleData, setisOpenModalDetalleData] = useState(false)
    const [selectMes, setselectMes] = useState('')
    const [selectitems, setselectitems] = useState([])
    // Simulando datos para la tabla
  const data = [
    {
        mes: '12/2024',
        items_colaboradores_activos: [
            {cci: '', banco: 'bbva',cargo: 'contadora', nombre_apellidos: 'OFELIA VASQUEZ GARCIA', monto_pago: 2000, dias_tardanzas: 0, descuento: 0 }, 
            {cci: '00219319363020306118', banco: 'bcp',cargo: 'administracion', nombre_apellidos: 'MIRTHA MARQUEZ LEVANO', monto_pago: 2000, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0263629197-19', banco: 'bbva',cargo: 'venta', nombre_apellidos: 'ATENAS CORAL FIGUEROA', monto_pago: 1400, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0262250437', banco: 'bbva',cargo: 'sistemas', nombre_apellidos: 'CARLOS ROSALES MORALES', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0263567728', banco: 'bbva',cargo: 'supervision', nombre_apellidos: 'ALVARO SALAZAR GOMEZ', monto_pago: 2500, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0186-0200373041', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'JULIO CESAR TORRES ITURRIZAGA', monto_pago: 2000, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0186-0200506513', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'MILAGROS GALVAN DE LA CRUZ', monto_pago: 1550, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0227529488', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'VERONICA ROCIO GUTIERREZ REYNA', monto_pago: 1900, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0264721216', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'YASMIN JOSEFINA OLORTEGUI PEREZ', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0267745574', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'JESICA ROMERO ALONSO', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '', banco: 'bbva',cargo: 'entrenador (a)', nombre_apellidos: 'CHRISTOPHER WILLY GARAY FIGUEROA', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0814-0264733613', banco: 'bbva',cargo: 'NUTRICIONISTA', nombre_apellidos: 'TERESA ISABEL CHUECA GARCIA PYE', monto_pago: 1300, dias_tardanzas: 0, descuento: 0 },
            {cci: '0011-0135-0201264485', banco: 'bbva',cargo: 'MANTENIMIENTO', nombre_apellidos: 'CARLOS CHUQUILLANQUI', monto_pago: 1800, dias_tardanzas: 0, descuento: 0 },
        ],
    }
  ]
  const onClickDetalleData = (items, mesAnio)=>{
    onOpenModalDetalleData()
      setselectitems(items)
      setselectMes(mesAnio)
  }
  const onOpenModalDetalleData = ()=>{
    setisOpenModalDetalleData(true)
  }
  const onCloseModalDetalleData = ()=>{
    setisOpenModalDetalleData(false)
  }
  return (
    <>
    <Table>
        <thead>
            <tr>
                <th>MES</th>
                <th>COLABORADORES BENEFICIADOS</th>
                <th>MONTO A PAGAR FICTICIO</th>
                <th>MONTO A PAGAR REAL</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {
                data.map(d=>{
                    return (
                        <tr>
                            <td>{d.mes}</td>
                            <td>{d.items_colaboradores_activos.length}</td>
                            <td><NumberFormatMoney amount={d.items_colaboradores_activos.reduce((acc, item) => acc + item.monto_pago, 0)}/></td>
                            <td><NumberFormatMoney amount={d.items_colaboradores_activos.reduce((acc, item) => acc + item.monto_asistido, 0)}/></td>
                            <td> <a onClick={()=>onClickDetalleData(d.items_colaboradores_activos, d.mes)} className='text-primary underline cursor-pointer'>VER DETALLE</a></td>
                        </tr>
                    )
                })
            }
        </tbody>
    </Table>
    <ModalDataDetalleTable show={isOpenModalDetalleData} onHide={onCloseModalDetalleData} data={selectitems} mesAnio={selectMes}/>
    </>
  )
}
