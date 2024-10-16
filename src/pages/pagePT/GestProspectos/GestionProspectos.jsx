import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
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
import { ModalProspectos } from './ModalProspectos';
import { useProspectoStore } from '@/hooks/hookApi/useProspectoStore';
import { useSelector } from 'react-redux';
import { FormatoDateMask } from '@/components/CurrencyMask';
import { ModalInfoProspecto } from './ModalInfoProspecto';

export const GestionProspectos = () => {
	let emptyProduct = {
		id: null,
		name: '',
		image: null,
		description: '',
		category: null,
		price: 0,
		quantity: 0,
		rating: 0,
		inventoryStatus: 'INSTOCK',
	};

	const [products, setProducts] = useState(null);
	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
	const [product, setProduct] = useState(emptyProduct);
	const [selectedProducts, setSelectedProducts] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
    const [modalProspecto, setmodalProspecto] = useState(false)
	const toast = useRef(null);
	const dt = useRef(null);
	const {Dataprospectos} = useSelector((e) => e.authProspec);
    const { obtenerProspectos, obtenerProspectoxID, prospectoxID } = useProspectoStore()
	useEffect(() => {
        obtenerProspectos()
		// ProductService.getProducts().then((data) => setProducts(data));
	}, []);

	const formatCurrency = (value) => {
		return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	};

	const openNew = () => {
        setmodalProspecto(true)
	};
    const cancelModal =()=>{
        setmodalProspecto(false)
    }

	const hideDialog = () => {
		setSubmitted(false);
		setProductDialog(false);
	};

	const hideDeleteProductDialog = () => {
		setDeleteProductDialog(false);
	};

	const hideDeleteProductsDialog = () => {
		setDeleteProductsDialog(false);
	};

	const saveProduct = () => {
		setSubmitted(true);

		if (product.name.trim()) {
			let _products = [...products];
			let _product = { ...product };

			if (product.id) {
				const index = findIndexById(product.id);

				_products[index] = _product;
				toast.current.show({
					severity: 'success',
					summary: 'Successful',
					detail: 'Product Updated',
					life: 3000,
				});
			} else {
				_product.id = createId();
				_product.image = 'product-placeholder.svg';
				_products.push(_product);
				toast.current.show({
					severity: 'success',
					summary: 'Successful',
					detail: 'Product Created',
					life: 3000,
				});
			}

			setProducts(_products);
			setProductDialog(false);
			setProduct(emptyProduct);
		}
	};

	const editProduct = (product) => {
		setProduct({ ...product });
		setProductDialog(true);
	};

	const confirmDeleteProduct = (product) => {
		setProduct(product);
		setDeleteProductDialog(true);
	};

	const deleteProduct = () => {
		let _products = products.filter((val) => val.id !== product.id);

		setProducts(_products);
		setDeleteProductDialog(false);
		setProduct(emptyProduct);
		toast.current.show({
			severity: 'success',
			summary: 'Successful',
			detail: 'Product Deleted',
			life: 3000,
		});
	};

	const findIndexById = (id) => {
		let index = -1;

		for (let i = 0; i < products.length; i++) {
			if (products[i].id === id) {
				index = i;
				break;
			}
		}

		return index;
	};

	const createId = () => {
		let id = '';
		let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 5; i++) {
			id += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return id;
	};

	const leftToolbarTemplate = () => {
		return (
			<div className="flex flex-wrap gap-2">
				<Button
					label="Nuevo prospecto"
					icon="pi pi-plus"
					severity="success"
					onClick={openNew}
				/>
			</div>
		);
	};
	const imageBodyTemplate = (rowData) => {
		return (
			<img
				src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`}
				alt={rowData.image}
				className="shadow-2 border-round"
				style={{ width: '64px' }}
			/>
		);
	};

	const priceBodyTemplate = (rowData) => {
		return formatCurrency(rowData.price);
	};

	const ratingBodyTemplate = (rowData) => {
		return <Rating value={rowData.rating} readOnly cancel={false} />;
	};

	const statusBodyTemplate = (rowData) => {
		return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
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
				<Button 
					rounded 
					className="mr-2 p-0 border-0 text-decoration-underline" 
					onClick={() => onModalviewProspecto(rowData.id)} 
					>Ver mas informacion
				</Button>
			</React.Fragment>
		);
	};
    const fechaRegistroBodyTemplate = (rowData)=>{
        return FormatoDateMask(rowData.fecha_registro, "dddd D [de] MMMM [del] YYYY [a las] h:mm A")
    }

	const getSeverity = (product) => {
		switch (product.inventoryStatus) {
			case 'INSTOCK':
				return 'success';

			case 'LOWSTOCK':
				return 'warning';

			case 'OUTOFSTOCK':
				return 'danger';

			default:
				return null;
		}
	};

	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<IconField iconPosition="left">
				<InputIcon className="pi pi-search" />
				<InputText
					type="search"
					onInput={(e) => setGlobalFilter(e.target.value)}
					placeholder="Search..."
				/>
			</IconField>
		</div>
	);
	const deleteProductDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
			<Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
		</React.Fragment>
	);

	return (
		<>
			<PageBreadcrumb title="Prospectos" subName="E" />
			<Toolbar left={leftToolbarTemplate}></Toolbar>

			<DataTable
				ref={dt}
				value={Dataprospectos}
				selection={selectedProducts}
				onSelectionChange={(e) => setSelectedProducts(e.value)}
				dataKey="id"
				paginator
				rows={10}
				rowsPerPageOptions={[5, 10, 25]}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
				globalFilter={globalFilter}
				header={header}
			>
				<Column field="nombres_apellidos" header="CLIENTE PROSPECTO" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="celular" header="CELULAR" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="correo" header="CORREO" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="fecha_registro" header="FECHA DE REGISTRO" sortable style={{ minWidth: '12rem' }} body={fechaRegistroBodyTemplate}></Column>
				<Column field="tb_ProgramaTraining.name_pgm" header="PROGRAMA DE INTERES" sortable style={{ minWidth: '12rem' }}></Column>
				<Column field="tb_empleado.nombres_apellidos_empl" header="Asesor comercial:" sortable style={{ minWidth: '12rem' }}></Column>
				<Column header="" style={{ minWidth: '12rem' }} body={actionBodyTemplate}></Column>
			</DataTable>
            <ModalProspectos show={modalProspecto} onHide={cancelModal}/>
			<ModalInfoProspecto show={viewProspecto} onHide={()=>setviewProspecto(false)} data={prospectoxID}/>

			<Dialog
				visible={deleteProductDialog}
				style={{ width: '32rem' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				header="Confirm"
				modal
				footer={deleteProductDialogFooter}
				onHide={hideDeleteProductDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
					{product && (
						<span>
							Deseas eliminar el prospecto <b>{product.name}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</>
	);
};
