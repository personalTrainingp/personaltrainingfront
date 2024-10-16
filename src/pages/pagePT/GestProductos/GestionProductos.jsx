import { PageBreadcrumb, Table } from '@/components'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { columns, sizePerPageList } from './ColumnsSet'
import { useProductoStore } from '@/hooks/hookApi/useProductoStore'
import { useDispatch } from 'react-redux'
import { ModalProducto } from './ModalProducto'
import { useSelector } from 'react-redux'

const registerProducto = {
  id_marca: '',
  id_usoArt:'',
  id_clasificacion: '',
  id_almacen:'',
  id_unidMedida:'',
  stock_prodInv:'',
  precio_prodInv:''
}
export const GestionProductos = () => {
  const dispatch = useDispatch()
  const [isModalProductoOpen, setisModalProductoOpen] = useState(false)
  const modalProductoOpen = ()=>{
	setisModalProductoOpen(true)
  }
  const modalProductoClose = ()=>{
	setisModalProductoOpen(false)
  }
  const { obtenerProductos } = useProductoStore()
  const { dataproductos } = useSelector(e=>e.prod)
  
  useEffect(() => {
    obtenerProductos()
  }, [])

  return (
    <>
    
			<PageBreadcrumb title="Gestion de productos" subName="E" />
<Row>
  <Col xs={12}>
    <Card>
      <Card.Body>
        <Row>
          <Col sm={5}>
            <Button className="btn btn-danger mb-2" onClick={modalProductoOpen}>
              <i className="mdi mdi-plus-circle me-2"></i> Agregar productos
            </Button>
          </Col>
        </Row>
		<ModalProducto show={isModalProductoOpen} onHide={modalProductoClose}/>

        <Table
          columns={columns}
          data={dataproductos}
          pageSize={10}
          sizePerPageList={sizePerPageList}
          isSortable={true}
          pagination={true}
          isSearchable={true}
          tableClass="table-striped"
          searchBoxClass="mt-2 mb-3"
        />
      </Card.Body>
    </Card>
  </Col>
</Row>
    </>
  )
}
