import { PageBreadcrumb } from '@/components'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useInventarioStore } from '@/hooks/hookApi/useInventarioStore'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import sinImage from '@/assets/images/SinImage.jpg'
import { Image } from 'primereact/image'
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button'
import { ModalJornada } from './ModalJornada'
import { useJornadaStore } from '@/hooks/hookApi/useJornadaStore'
import dayjs from 'dayjs'

export const GestionJornada = () => {
    const [isOpenModalJornada, setisOpenModalJornada] = useState(false)
    const { obtenerTablaJornada } = useJornadaStore()
    const { dataView } = useSelector(d=>d.DATA)
    const onOpenModalJornada = ()=>{
        setisOpenModalJornada(true)
    }
    const onCloseModalJornada = ()=>{
        setisOpenModalJornada(false)
    }
    useEffect(() => {
        obtenerTablaJornada()
    }, [])
    console.log(dataView);
    
  return (
    <>
    <PageBreadcrumb title={'JORNADAS'} subName={'T'}/>
        <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={5}>
                                    <Button label='Agregar jornada' onClick={onOpenModalJornada}/>
                                </Col>
                                <Col sm={7}>
                                </Col>
                            </Row>
                                <br/>
                            <Row>
                                <Col xxl={12}>
                                <Table
                            className="table-centered mb-0"
                        >
                            <thead className="bg-primary">
                                <tr>
                                    {/* <th className='text-white  p-1'>ID</th> */}
                                    <th className='text-white  p-1'>TOTAL DE TIEMPO EN 4 SEMANAS</th>
                                    <th className='text-white  p-1'>OBSERVACION DE LA JORNADA</th>
                                    <th className='text-white  p-1'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataView.map(d=>(
                                        <tr>
                                            <td>{calculateTotalHours(d.items).totalHours} HORAS CON {calculateTotalHours(d.items).remainingMinutes} MINUTOS</td>
                                            <td>{d.items[0].observacion}</td>
                                            <td></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                    </Table>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
				</Col>
                <ModalJornada show={isOpenModalJornada} onHide={onCloseModalJornada}/>
        </Row>
    </>
  )
}




const calculateTotalHours = (data) => {
    let totalMinutes = 0;

  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key.endsWith("ENTRADA")) {
        const day = key.split("_")[0];
        const entrada = entry[`${day}_ENTRADA`];
        const salida = entry[`${day}_SALIDA`];

        const [entradaHours, entradaMinutes] = entrada.split(":").map(Number);
        const [salidaHours, salidaMinutes] = salida.split(":").map(Number);

        // Convert times to minutes and calculate the difference
        const entradaTotalMinutes = entradaHours * 60 + entradaMinutes;
        const salidaTotalMinutes = salidaHours * 60 + salidaMinutes;
        const difference = salidaTotalMinutes - entradaTotalMinutes;

        // Add to total if difference is positive
        if (difference > 0) {
          totalMinutes += difference;
        }
      }
    });
  });

  // Convert total minutes to hours and minutes
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return { totalHours, remainingMinutes };
}  