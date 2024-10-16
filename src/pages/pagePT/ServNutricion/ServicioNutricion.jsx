import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { PageBreadcrumb } from '@/components';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FormatoDateMask } from '@/components/CurrencyMask';
import { ModalNutricion } from './ModalNutricion';
import { useServiciosPTStore } from '@/hooks/hookApi/useServiciosPTStore';

export const ServicioNutricion = ({tipo_serv}) => {
	const [products, setProducts] = useState(null);
	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
    const [modalProspecto, setmodalProspecto] = useState(false)
	const toast = useRef(null);
	const dt = useRef(null);
    const { obtenerTodoServiciosPT } = useServiciosPTStore()
	const { dataview } = useSelector(e=>e.servicios)
	useEffect(() => {
		obtenerTodoServiciosPT(tipo_serv)
		// ProductService.getProducts().then((data) => setProducts(data));
	}, [tipo_serv]);
	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
    const cancelModal =()=>{
        setmodalProspecto(false)
    }



	const priceBodyTemplate = (rowData) => {
		return formatCurrency(rowData?.tarifa_servicio);
	};

	const [idProspecto, setidProspecto] = useState(0)
	const [viewProspecto, setviewProspecto] = useState(false)

	const actionBodyTemplate = (rowData) => {
		const onModalviewProspecto = (id)=>{
			setidProspecto(id)
			obtenerProspectoxID(id)
			setviewProspecto(true)
		}
		return (
			<React.Fragment>
				<Button icon="pi pi-pencil" rounded outlined className="mr-2"/>
                <Button icon="pi pi-trash" rounded outlined severity="danger"/>
			</React.Fragment>
		);
	};
    const fechaRegistroBodyTemplate = (rowData)=>{
        return FormatoDateMask(rowData.fecha_registro, "D [de] MMMM [del] YYYY [a las] h:mm A")
    }
	const tarifaBodyTemplate=()=>{
		return 
	}


	return (
		<>
			<PageBreadcrumb title={`${tipo_serv=='FITOL'?'Fitology':'Nutricion'}`} subName="E" />

			<DataTable
				value={dataview}
				selection={selectedProducts}
				onSelectionChange={(e) => setSelectedProducts(e.value)}
				dataKey="id"
				paginator
				rows={10}
				rowsPerPageOptions={[5, 10, 25]}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
				globalFilter={globalFilter}
			>
				<Column field="nombre_servicio" header="Servicio" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="cantidad_servicio" header="Cantidad" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="tarifa_servicio" header="Tarifa" body={priceBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="fecha_registro" header="Fecha de registro" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="estado" header="Estado" sortable style={{ minWidth: '12rem' }}></Column>
				<Column header="Action" sortable style={{ minWidth: '12rem' }} body={actionBodyTemplate}></Column>
			</DataTable>
            <ModalNutricion show={modalProspecto} onHide={cancelModal}/>

		</>
	);
};
