import { PageBreadcrumb, Table } from '@/components'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { ModalMeta } from './ModalMeta'
import { columns, sizePerPageList } from './ColumnsSet'
import { useSelector } from 'react-redux'
import { useMetaStore } from '@/hooks/hookApi/useMetaStore'
import { useDispatch } from 'react-redux'
import Nouislider from 'nouislider-react'

export const GestMetas = () => {
    const [isModalOpenMetas, setIsModalOpenMetas] = useState(false)
    const dispatch = useDispatch()
    const { dataMetas } = useSelector(e=>e.meta)
    const { obtenerMetas } = useMetaStore()
    const hideModal= ()=>{
        setIsModalOpenMetas(false)
    }
    const showModal = ()=>{
        setIsModalOpenMetas(true)
    }
    useEffect(() => {
        obtenerMetas()
    }, [])
    
  return (
    <>
    
			<PageBreadcrumb title="Metas" subName="E" />
<Row>
    <Col xs={12}>
        <Card>
            <Card.Body>
                <Row>
                    <Col sm={5}>
                        <Button className="btn btn-danger mb-2" onClick={showModal}>
                            <i className="mdi mdi-plus-circle me-2"></i> Agregar Meta
                        </Button>
                    </Col>
                    {/* Sign up Modal */}
                    <Col sm={7}>
                        <div className="text-sm-end">
                            <Button className="btn btn-success mb-2 me-1">
                                <i className="mdi mdi-cog"></i>
                            </Button>

                            <Button className="btn btn-light mb-2 me-1">Importar</Button>

                            <Button className="btn btn-light mb-2">Exportar</Button>
                        </div>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    data={dataMetas}
                    pageSize={5}
                    sizePerPageList={sizePerPageList}
                    isSortable={true}
                    pagination={true}
                    isSelectable={false}
                    isSearchable={true}
                    isNotResponsive={true}
                    tableClass="table-light"
                    searchBoxClass="mt-2 mb-3"
                />
            </Card.Body>
        </Card>
    </Col>
    <ModalMeta show={isModalOpenMetas} onHide={hideModal}/>
</Row>
    </>
  )
}
