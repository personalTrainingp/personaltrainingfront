import { PageBreadcrumb } from '@/components'
import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import TableGestAportes from './TableGestAportes'
import { Button } from 'primereact/button'
import { ModalAportante } from './ModalAportante'

export const GestAportesIngresos = () => {
	const [isOpenModalAportante, setisOpenModalAportante] = useState(false)
	const closeModalAportante = ()=>{
		setisOpenModalAportante(false)
	}
	const openModalAportante = ()=>{
		setisOpenModalAportante(true)
	}
  return (
	<>
		<PageBreadcrumb subName={'T'} title={'GESTION APORTANTES'}/>
		
		<div>
			<Button label="AGREGAR NUEVO" severity="success" raised onClick={openModalAportante} />
        </div>
		<Card>
			<TableGestAportes/>
		</Card>
		<ModalAportante show={isOpenModalAportante} onShow={closeModalAportante} onHide={closeModalAportante}/>
	</>
  )
}





// import React, { useState, useEffect, useRef } from 'react';
// import { classNames } from 'primereact/utils';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';
// import { Rating } from 'primereact/rating';
// import { Toolbar } from 'primereact/toolbar';
// import { IconField } from 'primereact/iconfield';
// import { InputIcon } from 'primereact/inputicon';
// import { Dialog } from 'primereact/dialog';
// import { InputText } from 'primereact/inputtext';
// import { Tag } from 'primereact/tag';
// import { PageBreadcrumb } from '@/components';
// import { Col, Row } from 'react-bootstrap';
// import { useProspectoStore } from '@/hooks/hookApi/useProspectoStore';
// import { useSelector } from 'react-redux';
// import { FormatoDateMask } from '@/components/CurrencyMask';
// import { ModalInfoProspecto } from './ModalInfoProspecto';
// import { ModalAportante } from './ModalAportante';
// import { useAportesIngresosStore } from '@/hooks/hookApi/useAportesIngresosStore';
// import { confirmDialog } from 'primereact/confirmdialog';
// export const GestAportesIngresos = () => {
//   let emptyProduct = {
// 		id: null,
// 		name: '',
// 		image: null,
// 		description: '',
// 		category: null,
// 		price: 0,
// 		quantity: 0,
// 		rating: 0,
// 		inventoryStatus: 'INSTOCK',
// 	};
//   const showToast = (severity, summary, detail, label) => {
//     toast.current.show({ severity, summary, detail, label });
// };
// 	const [products, setProducts] = useState(null);
// 	const [productDialog, setProductDialog] = useState(false);
// 	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
// 	const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
// 	const [product, setProduct] = useState(emptyProduct);
// 	const [selectedProducts, setSelectedProducts] = useState(null);
// 	const [submitted, setSubmitted] = useState(false);
// 	const [globalFilter, setGlobalFilter] = useState(null);
//     const [modalProspecto, setmodalProspecto] = useState(false)
// 	const toast = useRef(null);
// 	const dt = useRef(null);
// 	const {dataView} = useSelector((e) => e.DATA);
//     const { obtenerProspectoxID, prospectoxID } = useProspectoStore()
//     const { obtenerAportes, obtenerAportexID, aportexID, startDeleteAportes, isLoading  } = useAportesIngresosStore()
// 	useEffect(() => {
//     obtenerAportes()
// 		// ProductService.getProducts().then((data) => setProducts(data));
// 	}, []);

//   const formatCurrency = (value, currency) => {
//     return value.toLocaleString('en-ES', { style: 'currency', currency });
// };
// 	const openNew = () => {
//         setmodalProspecto(true)
// 	};
//     const cancelModal =()=>{
//         setmodalProspecto(false)
//     }

// 	const hideDialog = () => {
// 		setSubmitted(false);
// 		setProductDialog(false);
// 	};

// 	const hideDeleteProductDialog = () => {
// 		setDeleteProductDialog(false);
// 	};

// 	const hideDeleteProductsDialog = () => {
// 		setDeleteProductsDialog(false);
// 	};

// 	const saveProduct = () => {
// 		setSubmitted(true);

// 		if (product.name.trim()) {
// 			let _products = [...products];
// 			let _product = { ...product };

// 			if (product.id) {
// 				const index = findIndexById(product.id);

// 				_products[index] = _product;
// 				toast.current.show({
// 					severity: 'success',
// 					summary: 'Successful',
// 					detail: 'Product Updated',
// 					life: 3000,
// 				});
// 			} else {
// 				_product.id = createId();
// 				_product.image = 'product-placeholder.svg';
// 				_products.push(_product);
// 				toast.current.show({
// 					severity: 'success',
// 					summary: 'Successful',
// 					detail: 'Product Created',
// 					life: 3000,
// 				});
// 			}

// 			setProducts(_products);
// 			setProductDialog(false);
// 			setProduct(emptyProduct);
// 		}
// 	};

// 	const editProduct = (product) => {
// 		setProduct({ ...product });
// 		setProductDialog(true);
// 	};

// 	const confirmDeleteProduct = (product) => {
// 		setProduct(product);
// 		setDeleteProductDialog(true);
// 	};

// 	const deleteProduct = () => {
// 		let _products = products.filter((val) => val.id !== product.id);

// 		setProducts(_products);
// 		setDeleteProductDialog(false);
// 		setProduct(emptyProduct);
// 		toast.current.show({
// 			severity: 'success',
// 			summary: 'Successful',
// 			detail: 'Product Deleted',
// 			life: 3000,
// 		});
// 	};

// 	const findIndexById = (id) => {
// 		let index = -1;

// 		for (let i = 0; i < products.length; i++) {
// 			if (products[i].id === id) {
// 				index = i;
// 				break;
// 			}
// 		}

// 		return index;
// 	};

// 	const createId = () => {
// 		let id = '';
// 		let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// 		for (let i = 0; i < 5; i++) {
// 			id += chars.charAt(Math.floor(Math.random() * chars.length));
// 		}

// 		return id;
// 	};

// 	const leftToolbarTemplate = () => {
// 		return (
// 			<div className="flex flex-wrap gap-2">
// 				<Button
// 					label="Nuevo Aporte"
// 					icon="pi pi-plus"
// 					severity="success"
// 					onClick={openNew}
// 				/>
// 			</div>
// 		);
// 	};
// 	const [idProspecto, setidProspecto] = useState(0)
// 	const [viewProspecto, setviewProspecto] = useState(false)

// 	const actionBodyTemplate = (rowData) => {
// 		const onModalviewProspecto = ()=>{
// 			setmodalProspecto(true)
//       obtenerAportexID(rowData.id)
// 		}
//     const onModalCancelar =()=>{
//       confirmDialog({
//         message: '¿Seguro que quiero eliminar el Aporte?',
//         header: 'Eliminar Aporte',
//         icon: 'pi pi-info-circle',
//         defaultFocus: 'reject',
//         acceptClassName: 'p-button-danger',
//         accept:  onAcceptDeleteGasto,
//     });
//     }
//     const onAcceptDeleteGasto = async()=>{
//       await startDeleteAportes(rowData.id)
//       showToast('success', 'Eliminar Aporte', 'Aporte Eliminado correctamente', 'success')
//     }
// 		return (
// 			<React.Fragment>
// 				<Button icon="pi pi-pencil" rounded outlined className="mr-2" 
//                 onClick={onModalviewProspecto} 
//                 />
//                 <Button icon="pi pi-trash" rounded outlined severity="danger" 
//                 onClick={onModalCancelar} 
//                 />
// 			</React.Fragment>
// 		);
// 	};
//     const fechaRegistroBodyTemplate = (rowData)=>{
//         return FormatoDateMask(rowData.fecha_aporte, "D [de] MMMM [del] YYYY")
//     }
//     const montoRegistroBodyTemplate = (rowData)=>{
//       return formatCurrency(rowData.monto_aporte, rowData.moneda?rowData.moneda:'PEN')
//     }

// 	const getSeverity = (product) => {
// 		switch (product.inventoryStatus) {
// 			case 'INSTOCK':
// 				return 'success';

// 			case 'LOWSTOCK':
// 				return 'warning';

// 			case 'OUTOFSTOCK':
// 				return 'danger';

// 			default:
// 				return null;
// 		}
// 	};

// 	const header = (
// 		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
// 			<IconField iconPosition="left">
// 				<InputIcon className="pi pi-search" />
// 				<InputText
// 					type="search"
// 					onInput={(e) => setGlobalFilter(e.target.value)}
// 					placeholder="Search..."
// 				/>
// 			</IconField>
// 		</div>
// 	);
// 	const deleteProductDialogFooter = (
// 		<React.Fragment>
// 			<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
// 			<Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
// 		</React.Fragment>
// 	);
//   console.log(dataView);

// 	return (
// 		<>
// 			<PageBreadcrumb title="Aportes de inversion" subName="E" />
// 			<Toolbar left={leftToolbarTemplate}></Toolbar>

//       <Toast ref={toast}/>
// 			<DataTable
// 				ref={dt}
// 				value={dataView}
// 				selection={selectedProducts}
// 				onSelectionChange={(e) => setSelectedProducts(e.value)}
// 				dataKey="id"
// 				paginator
// 				rows={10}
// 				rowsPerPageOptions={[5, 10, 25]}
// 				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
// 				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
// 				globalFilter={globalFilter}
// 				header={header}
// 			>
// 				<Column field="id" header="Id" sortable></Column>
// 				<Column field="tb_inversionista.nombres_completos" header="Inversionista" sortable style={{ minWidth: '12rem' }}></Column>
// 				<Column field="fecha_aporte" header="Fecha de aporte" sortable style={{ minWidth: '12rem' }} body={fechaRegistroBodyTemplate}></Column>
// 				<Column header="Monto" sortable style={{ minWidth: '12rem' }} body={montoRegistroBodyTemplate}></Column>
// 				<Column header="Action" style={{ minWidth: '12rem' }} body={actionBodyTemplate}></Column>
// 			</DataTable>
//             <ModalAportante show={modalProspecto} onHide={cancelModal} data={aportexID} showToast={showToast} isLoading={isLoading}/>
// 			<Dialog
// 				visible={deleteProductDialog}
// 				style={{ width: '32rem' }}
// 				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
// 				header="Confirm"
// 				modal
// 				footer={deleteProductDialogFooter}
// 				onHide={hideDeleteProductDialog}
// 			>
// 				<div className="confirmation-content">
// 					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
// 					{product && (
// 						<span>
// 							Deseas eliminar al aporte <b>{product.name}</b>?
// 						</span>
// 					)}
// 				</div>
// 			</Dialog>
// 		</>
// 	);
// }
