import config from '@/config'
import React from 'react'
import { Card, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const ItemDieta = ({id_dieta_cli, url, nombre_dieta, descripcion_dieta, onDeleteDieta}) => {
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
                <span><strong>Nombre del plan: </strong>{ nombre_dieta }</span>
                <br/>
                <span><strong>Descripcion: </strong>{ descripcion_dieta }</span>
            </div>
            <div className="col-auto">
                <Link to={`${config.API_IMG.FILE_DIETA}${url}`} className="btn btn-link btn-lg text-muted">
                    <i className="pi pi-download"></i>
                </Link>
                <Link to="" className="btn btn-link btn-lg text-muted" onClick={onDeleteDieta}>
                    <i className="pi pi-times"></i>
                </Link>
            </div>
        </Row>
    </div>
</Card>
  )
}
