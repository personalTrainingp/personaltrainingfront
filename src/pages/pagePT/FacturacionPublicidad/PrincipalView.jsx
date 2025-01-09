import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { DataTable } from './DataTable'
import { PageBreadcrumb } from '@/components'
import { DataGrafico } from './DataGrafico'

export const PrincipalView = () => {
    const data = [
        // {
        //     title: 'publicidad',
        //     data: [
        //         {
        //             fecha: '02/12/2024',
        //             metodo_pago: '',
        //             dolares: 70
        //         },
        //         {
        //             fecha: '09/12/2024',
        //             metodo_pago: '',
        //             dolares: 118
        //         },
        //         {
        //             fecha: '14/12/2024',
        //             metodo_pago: '',
        //             dolares: 118
        //         },
        //         {
        //             fecha: '16/12/2024',
        //             metodo_pago: '',
        //             dolares: 118
        //         },
        //         {
        //             fecha: '16/12/2024',
        //             metodo_pago: '',
        //             dolares: 118
        //         },
        //         {
        //             fecha: '19/12/2024',
        //             metodo_pago: '',
        //             dolares: 14.75
        //         },
        //         {
        //             fecha: '19/12/2024',
        //             metodo_pago: '',
        //             dolares: 29.50
        //         },
        //         {
        //             fecha: '20/12/2024',
        //             metodo_pago: '',
        //             dolares: 9.33
        //         },
        //         {
        //             fecha: '21/12/2024',
        //             metodo_pago: '',
        //             dolares: 65.41
        //         },
        //         {
        //             fecha: '23/12/2024',
        //             metodo_pago: '',
        //             dolares: 118.00
        //         },
        //         {
        //             fecha: '24/12/2024',
        //             metodo_pago: '',
        //             dolares: 29.22
        //         },
        //         {
        //             fecha: '26/12/2024',
        //             metodo_pago: '',
        //             dolares: 118.00
        //         },
        //         {
        //             fecha: '29/12/2024',
        //             metodo_pago: '',
        //             dolares: 118.00
        //         },
        //         {
        //             fecha: '01/01/2025',
        //             metodo_pago: '',
        //             dolares: 118.00
        //         },
        //     ]
        // },
        {
            // title: 'FACTURACION',
            data: [
                {
                    fecha: '24/09/2024',
                    metodo_pago: 'American Express · 5877',
                    dolares: 2
                },{
                    fecha: '24/09/2024',
                    metodo_pago: 'American Express · 5877',
                    dolares: 1.99 
                },{
                    fecha: '27/09/2024',
                    metodo_pago: 'American Express · 5877',
                    dolares: 2
                },{
                    fecha: '27/09/2024',
                    metodo_pago: 'American Express · 5877',
                    dolares: 2
                },{
                    fecha: '27/09/2024',
                    metodo_pago: 'American Express · 5877',
                    dolares: 2.47
                },{
                    fecha: `15/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 24.00 
                },{
                    fecha: `16/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 27.00 
                },{
                    fecha: `17/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 30.00 
                },{
                    fecha: `19/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 33.00 
                },{
                    fecha: `21/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 37.00 
                },{
                    fecha: `23/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 29.07 
                },{
                    fecha: `24/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 16.30 
                },{
                    fecha: `26/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 41.00 
                },{
                    fecha: `29/10/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 46.00 
                },{
                    fecha: `02/11/2024`,
                    metodo_pago: 'Visa · 9877',
                    dolares: 51.00 
                },
                {
                    fecha: '02/12/2024',
                    metodo_pago: '',
                    dolares: 70
                },
                {
                    fecha: '09/12/2024',
                    metodo_pago: '',
                    dolares: 118
                },
                {
                    fecha: '14/12/2024',
                    metodo_pago: '',
                    dolares: 118
                },
                {
                    fecha: '16/12/2024',
                    metodo_pago: '',
                    dolares: 118
                },
                {
                    fecha: '16/12/2024',
                    metodo_pago: '',
                    dolares: 118
                },
                {
                    fecha: '19/12/2024',
                    metodo_pago: '',
                    dolares: 14.75
                },
                {
                    fecha: '19/12/2024',
                    metodo_pago: '',
                    dolares: 29.50
                },
                {
                    fecha: '20/12/2024',
                    metodo_pago: '',
                    dolares: 9.33
                },
                {
                    fecha: '21/12/2024',
                    metodo_pago: '',
                    dolares: 65.41
                },
                {
                    fecha: '23/12/2024',
                    metodo_pago: '',
                    dolares: 118.00
                },
                {
                    fecha: '24/12/2024',
                    metodo_pago: '',
                    dolares: 29.22
                },
                {
                    fecha: '26/12/2024',
                    metodo_pago: '',
                    dolares: 118.00
                },
                {
                    fecha: '29/12/2024',
                    metodo_pago: '',
                    dolares: 118.00
                },
                {
                    fecha: '01/01/2025',
                    metodo_pago: '',
                    dolares: 118.00
                },
            ]
        }
    ]
    const dataPublicidad = data[0].data
    const dataFacturacion=data[0].data
  return (
    <>
    <PageBreadcrumb title={'INVERSION EN REDES'}/>
    <br/>
    <Row>
        <Col xxl={12}>
        <Card className='p-4'>
            <h1 className='text-primary'>INVERSION EN REDES</h1>
            <br/>
            
            <Row>
                    <Col xxl={6}>
                    <DataGrafico dat={dataFacturacion}/>
                    </Col>
                    <Col xxl={6}>
                <DataTable dat={dataFacturacion}/>
                    
                    </Col>
                </Row>
            </Card>
        </Col>
    </Row>
        
    </>
  )
}
