import { DateMask } from '@/components/CurrencyMask'
import config from '@/config'
import dayjs from 'dayjs'
import React from 'react'
import { Card, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ItemClinico = ({data, fec_created, onUpdateHClinico, onDeleteHClinico, url}) => {
  return (
    
    <Card className="mb-1 shadow-none border">
    <div className="p-2">
        <Row className="align-items-center">
            <div className="col-auto">
                <div className="avatar-sm">
                    <i className='pi pi-file avatar-title rounded font-24'></i>
                    {/* <span className="avatar-title rounded">.ZIP</span> */}
                </div>
            </div>
            <div className="col ps-0">
                <Link to="" className="text-muted fw-bold">
                    Historial
                </Link>
                <br/>
                <span className='fs-6'>Fecha de creacion: <DateMask date={fec_created} format={'dddd D [de] MMMM [del] YYYY [a las] hh:mm A'}/></span>
            </div>
            <div className="col-auto">
                <Link to={`${config.API_IMG.FILE_HISTORIAL_CLINICO}${url}`} className="btn btn-link btn-lg text-muted">
                    <i className="pi pi-download"></i>
                </Link>
                {/* <Link to="" className="btn btn-link btn-lg text-muted">
                    <i className="pi pi-pencil"></i>
                </Link> */}
                <Link to="" className="btn btn-link btn-lg text-muted" onClick={onUpdateHClinico}>
                    <i className="pi pi-pencil"></i>
                </Link>
                <Link to="" className="btn btn-link btn-lg text-muted" onClick={onDeleteHClinico}>
                    <i className="pi pi-times"></i>
                </Link>
            </div>
        </Row>
    </div>
</Card>
  )
}
