import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { SelectButton } from 'primereact/selectbutton'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import phChange from '@/assets/images/brand-change/change-avatar.png'
import phFs45 from '@/assets/images/brand-change/fs-avatar.png'
import phMuscle from '@/assets/images/brand-change/muscle-avatar.png'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'

export const UtilidadesProgramas = () => {
  
  const dataUtilidades=[
    {
      anio: '2024',
      mes: 'Nuevo',
      total_ingresos: <NumberFormatMoney amount={57573}/>,
      total_gasto: <NumberFormatMoney amount={3198.5}/>,
      total_bene: <NumberFormatMoney amount={54374.5}/>,
      margen: '0.94%'
  },
    {
        anio: '2024',
        mes: 'Reinscrito',
        total_ingresos: <NumberFormatMoney amount={18568}/>,
        total_gasto: <NumberFormatMoney amount={1031}/>,
        total_bene: <NumberFormatMoney amount={17537}/>,
        margen: '0.94%'
    },
    {
        anio: '2024',
        mes: 'Renovacion',
        total_ingresos: <NumberFormatMoney amount={37093}/>,
        total_gasto: <NumberFormatMoney amount={2060.72}/>,
        total_bene: <NumberFormatMoney amount={35032.28}/>,
        margen: '0.94%'
    },
] 
  const [pgm, setpgm] = useState(1)
  const programas=[
    {
      value: 1,
      // name: (<img style={{width: '120px', height: '40px'}} src={phChange}></img>)
      name: (<img style={{width: '120px', height: '40px'}} src={phChange}></img>)
    },
    {
      value: 2,
      name: (<img style={{width: '120px', height: '40px'}} src={phMuscle}></img>)
    },
    {
      value: 3,
      name: (<img style={{width: '70px', height: '40px'}} src={phFs45}></img>)
    },
  ]
  
  const onSeleccionar = (e) => {
    // Si el usuario intenta deseleccionar, evitarlo
    if (e.value) {
      setpgm(e.value);
    }
};
  return (
    <Card>
    <Card.Header>
        <Card.Title className='text-center font-20'>Utilidades por programas</Card.Title>
    </Card.Header>
    <Card.Body>
      <div className='d-flex justify-content-center'>
          <SelectButton className='programas-selectsButtons' value={pgm} onChange={onSeleccionar} optionLabel="name" options={programas} />
      </div>
      <DataTable value={dataUtilidades} size={'small'}>
          <Column header="" field='mes'></Column>
          <Column header="INGRESOS(S/.)" field='total_ingresos'></Column>
          <Column header="INGRESOS($)" field='total_ingresos'></Column>
          <Column header="EGRESOS" field='total_gasto'></Column>
          <Column header="UTILIDADES" field='total_bene'></Column>
          <Column header="Margen %" field='margen'></Column>
      </DataTable>
    </Card.Body>
    </Card>
  )
}
