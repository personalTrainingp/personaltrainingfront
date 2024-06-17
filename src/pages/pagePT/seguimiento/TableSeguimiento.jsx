import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { FormatoDateMask } from '@/components/CurrencyMask';

function obtenerMayorExtensionFin(extensions) {
	let mayorFecha = '';
	extensions.forEach((extension) => {
		if (mayorFecha === '' || new Date(extension.extension_fin) > new Date(mayorFecha)) {
			mayorFecha = extension.extension_fin;
		}
	});
	return new Date(mayorFecha);
}
export const TableSeguimiento = () => {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedCustomers, setSelectedCustomers] = useState([]);
	const { reporteSeguimiento, obtenerReporteSeguimiento } = useReporteStore();
	const { diasLaborables, daysUTC } = helperFunctions();
	const [filters, setFilters] = useState({
		['tb_ventum.tb_cliente.nombres_apellidos_cli']: {
			value: null,
			matchMode: FilterMatchMode.STARTS_WITH,
		},
		vencimiento_REGALOS_CONGELAMIENTO: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
		},
		ProgramavsSemana: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dias: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		estado_seguimiento: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
	});
	const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [representatives] = useState([
		{ name: 'Amy Elsner', image: 'amyelsner.png' },
		{ name: 'Anna Fali', image: 'annafali.png' },
		{ name: 'Asiya Javayant', image: 'asiyajavayant.png' },
		{ name: 'Bernardo Dominic', image: 'bernardodominic.png' },
		{ name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
		{ name: 'Ioni Bowcher', image: 'ionibowcher.png' },
		{ name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
		{ name: 'Onyama Limba', image: 'onyamalimba.png' },
		{ name: 'Stephen Shaw', image: 'stephenshaw.png' },
		{ name: 'XuXue Feng', image: 'xuxuefeng.png' },
	]);
	const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

	const getSeverity = (status) => {
		switch (status) {
			case 'unqualified':
				return 'danger';

			case 'qualified':
				return 'success';

			case '':
				return 'info';
			case 'renewal':
				return null;
		}
	};

	useEffect(() => {
		obtenerReporteSeguimiento();
	}, []);
	useEffect(() => {
		const fetchData = () => {
			setCustomers(getCustomers(reporteSeguimiento));
			setLoading(false);
		};
		fetchData();
		// initFilters();
	}, [reporteSeguimiento]);

	const getCustomers = (data) => {
		return [...(data || [])].map((d) => {
			d.ProgramavsSemana = `${d.tb_ProgramaTraining?.name_pgm} / ${d.tb_semana_training?.semanas_st} Semanas`;
			d.vencimiento_REGALOS_CONGELAMIENTO = new Date(
				`${d.tb_extension_membresia.length > 0 ? new Date(obtenerMayorExtensionFin(d.tb_extension_membresia)) : new Date(d.fec_fin_mem)}`
			);
            d.dias = diasLaborables(new Date(), d.vencimiento_REGALOS_CONGELAMIENTO)
			return d;
		});
	};

	const formatDate = (value) => {
		return value.toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};
	const diasPorTerminarBodyTemplate = (rowData) => {
		const { diasLaborables, daysUTC } = helperFunctions();
		if (rowData.tb_extension_membresia?.length > 0) {
			const fecha_fin_nueva = new Date(
				obtenerMayorExtensionFin(rowData.tb_extension_membresia)
			);
			return diasLaborables(new Date(), fecha_fin_nueva);
		}

		return diasLaborables(new Date(), rowData.fec_fin_mem);
	};

	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };

		_filters['global'].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};

	const renderHeader = () => {
		return (
			<div className="flex flex-wrap gap-2 justify-content-between align-items-center">
				{/* <h4 className="m-0">Customers</h4> */}
				<IconField iconPosition="left">
					<InputIcon className="pi pi-search" />
					<InputText
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Keyword Search"
					/>
				</IconField>
			</div>
		);
	};
	const dateBodyTemplate = (rowData) => {
		return FormatoDateMask(rowData.vencimiento_REGALOS_CONGELAMIENTO, 'D [de] MMMM [de] YYYY');
	};
	const statusBodyTemplate = (rowData) => {

		return JSON.stringify(rowData);
	};

	const dateFilterTemplate = (options) => {
		return (
			<Calendar
				value={options.value}
				onChange={(e) => options.filterCallback(e.value, options.index)}
				dateFormat="mm/dd/yy"
				placeholder="mm/dd/yyyy"
				mask="99/99/9999"
			/>
		);
	};

	const header = renderHeader();

	return (
		<div className="card">
			<DataTable
				value={customers}
				paginator
				header={header}
				rows={10}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				rowsPerPageOptions={[10, 25, 50]}
				dataKey="id"
				selection={selectedCustomers}
				onSelectionChange={(e) => setSelectedCustomers(e.value)}
				filters={filters}
				filterDisplay="menu"
				globalFilterFields={[]}
				emptyMessage="No customers found."
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
			>
				<Column
					field="tb_ventum.tb_cliente.nombres_apellidos_cli"
					header="Clientes"
					sortable
					filter
					filterPlaceholder="Search by name"
					style={{ minWidth: '14rem' }}
				/>
				<Column
					field="ProgramavsSemana"
					header="Programas / Semana"
					sortable
					filterField="ProgramavsSemana"
					style={{ minWidth: '14rem' }}
					filter
					filterPlaceholder="Search by country"
				/>
				<Column
					field="vencimiento_REGALOS_CONGELAMIENTO"
					header="Vencimiento"
					sortable
					filterField="vencimiento_REGALOS_CONGELAMIENTO"
					dataType="date"
					style={{ minWidth: '12rem' }}
					body={dateBodyTemplate}
					filter
					filterElement={dateFilterTemplate}
				/>
				<Column
					field="dias"
					header="Dias"
					sortable
					dataType="numeric"
					style={{ minWidth: '12rem' }}
					body={diasPorTerminarBodyTemplate}
					filter
				/>
				<Column 
                    field="status" 
                    header="Status" 
                    sortable 
                    filterMenuStyle={{ width: '14rem' }} 
                    style={{ minWidth: '12rem' }} 
                    body={statusBodyTemplate} 
                    filter 
                    // filterElement={statusFilterTemplate} 
                    />
			</DataTable>
		</div>
	);
};

// import React, { useState, useEffect } from 'react';
// import { FilterMatchMode, FilterOperator } from 'primereact/api';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { IconField } from 'primereact/iconfield';
// import { InputIcon } from 'primereact/inputicon';
// import { Button } from 'primereact/button';
// import { Calendar } from 'primereact/calendar';
// import { useSelector } from 'react-redux';
// import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
// import { MultiSelect } from 'primereact/multiselect';
// import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
// import { helperFunctions } from '@/common/helpers/helperFunctions';
// import { FormatoDateMask } from '@/components/CurrencyMask';

// export default function TableSeguimiento() {
//     const [customers, setCustomers] = useState(null);
//     const [filters, setFilters] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [globalFilterValue, setGlobalFilterValue] = useState('');
//     const { reporteSeguimiento, obtenerReporteSeguimiento } = useReporteStore()
//     useEffect(() => {
//         obtenerReporteSeguimiento()
//     }, [])
//         useEffect(() => {
//         const fetchData = () => {
//             setCustomers(getCustomers(reporteSeguimiento));
//             setLoading(false);
//         };
//         fetchData()
//         initFilters();
//         }, [reporteSeguimiento]);

// function obtenerMayorExtensionFin(extensions) {
//     let mayorFecha = "";
//     extensions.forEach(extension => {
//         if (mayorFecha === "" || new Date(extension.extension_fin) > new Date(mayorFecha)) {
//             console.log(mayorFecha);
//             mayorFecha = extension.extension_fin;
//         }
//     });
//     return new Date(mayorFecha);
//     }
// const { diasLaborables, daysUTC } = helperFunctions()
//     const getCustomers = (data) => {
//         return data.map(item => {
//             // Crea una copia del objeto antes de modificarlo
//             let newItem = { ...item };
//             // Realiza las modificaciones en la copia
//             newItem.ProgramavsSemana = `${item.tb_ProgramaTraining.name_pgm} / ${item.tb_semana_training.semanas_st} Semanas`;
//             newItem.vencimiento_REGALOS_CONGELAMIENTO=`${item.tb_extension_membresia.length>0?new Date(obtenerMayorExtensionFin(item.tb_extension_membresia)):new Date(item.fec_fin_mem)}`
//             // Calcula la fecha de vencimiento teniendo en cuenta las extensiones de membresía
//             // newItem.vencimiento_REGALOS_CONGELAMIENTO = new Date(item.fec_fin_mem);

//             return newItem;
//         });
//     };
//     const formatDate = (value) => {
//         const newValue = new Date(value)
//         return newValue;
//     };
//     const formatCurrency = (value, currency) => {
//         return value.toLocaleString('en-ES', { style: 'currency', currency });
//     };
//     const clearFilter = () => {
//         initFilters();
//     };

//     const onGlobalFilterChange = (e) => {
//         const value = e.target.value;
//         let _filters = { ...filters };

//         _filters['global'].value = value;
//         setFilters(_filters);
//         setGlobalFilterValue(value);
//     };

//     const initFilters = () => {
//         setFilters({
//             ['tb_ventum.tb_cliente.nombres_apellidos_cli']: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//             'vencimiento_REGALOS_CONGELAMIENTO': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//             'ProgramavsSemana': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//             'dias': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//             'estado_seguimiento': { value: null, matchMode: FilterMatchMode.STARTS_WITH}
//         });
//         setGlobalFilterValue('');
//     };
//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-between">
//                 <IconField iconPosition="left">
//                     <InputIcon className="pi pi-search" />
//                     <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
//                 </IconField>
//                 <Button type="button" icon="pi pi-filter-slash" label="Limpiar filtros" outlined onClick={clearFilter} />
//             </div>
//         );
//     };

//     const ProgramaSemanasBodyTemplate = (rowData) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <span>{rowData.ProgramavsSemana}</span>
//             </div>
//         );
//     };

//     const ClientesBodyTemplate = (rowData) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <span>{rowData.tb_ventum.tb_cliente.nombres_apellidos_cli}</span>
//             </div>
//         );
//     };
//     const fecRegistroBodyTemplate = (rowData)=>{
//         return FormatoDateMask(rowData.vencimiento_REGALOS_CONGELAMIENTO, 'D [de] MMMM [de] YYYY');
//     }
//     const estadoSeguimientoBodyTemplate = (rowData)=>{
//         return;
//     }
//     const dateFilterTemplate = (options) => {
//         return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
//     };
//     const diasPorTerminarBodyTemplate = (rowData)=>{
//         const { diasLaborables, daysUTC } = helperFunctions()
// 			if(rowData.tb_extension_membresia?.length>0){
// 				const fecha_fin_nueva = new Date(obtenerMayorExtensionFin(rowData.tb_extension_membresia))
// 				return diasLaborables(new Date(), fecha_fin_nueva);
// 			}

// 			return diasLaborables(new Date(), rowData.fec_fin_mem);
//     }

//     const header = renderHeader();

//     return (
//         <div className="card">
//             <DataTable size='large'
//                         value={customers}
//                         paginator
//                         showGridlines
//                         rows={10}
//                         loading={loading}
//                         dataKey="id"
//                         stripedRows
//                         sortMode="multiple"
//                         filters={filters}
//                         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//                         rowsPerPageOptions={[10, 25, 50]}
//                         filterDisplay="menu"
//                         globalFilterFields={[]}
//                         header={header}
//                         emptyMessage="Egresos no encontrados.">
//                 {/* <Column header="Tipo de gasto" filterField="tb_parametros_gasto.nombre_gasto" sortable style={{ minWidth: '10rem' }} body={tipoGastoBodyTemplate} filter /> */}
//                 {/* <Column header="Monto" filterField="monto" style={{ minWidth: '10rem' }} sortable body={montoBodyTemplate} filter/> */}
//                 <Column header="Clientes" filterField="tb_ventum.tb_cliente.nombres_apellidos_cli" style={{ minWidth: '10rem' }} sortable body={ClientesBodyTemplate} filter/>
//                 <Column header="Programa/Semana" filterField={`ProgramavsSemana`} style={{ minWidth: '10rem' }} sortable body={ProgramaSemanasBodyTemplate} filter/>

//                 <Column header="Vencimiento" filterField="vencimiento_REGALOS_CONGELAMIENTO" sortable style={{ minWidth: '10rem' }} body={fecRegistroBodyTemplate} filter filterElement={dateFilterTemplate}  dataType="date" />
//                 <Column header="Dias" filterField="dias" sortable style={{ minWidth: '10rem' }} body={diasPorTerminarBodyTemplate} filter/>
//                 {/* <Column header="Proveedor" filterField="tb_Proveedor.razon_social_prov" style={{ minWidth: '10rem' }} sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}
//                 body={proveedorBodyTemplate} filter filterElement={proveedorFilterTemplate} /> */}

//                 <Column header="Estado de seguimiento" filterField="estado_seguimiento" style={{ width: '4rem' }} body={estadoSeguimientoBodyTemplate}/>
//             </DataTable>
//         </div>
//     );
// }

// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { CustomerService } from './ColumnsSet';
// import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
// import { FilterMatchMode } from 'primereact/api';

// export default function TableSeguimiento() {
//     const [loading, setLoading] = useState(false);
//     const [customers, setCustomers] = useState(null);
//     const { obtenerReporteSeguimiento, reporteSeguimiento } = useReporteStore()
//     const [lazyState, setlazyState] = useState({
//         first: 0,
//         rows: 10,
//         page: 1,
//         sortField: null,
//         sortOrder: null,
//         filters: {
//             'tb_ventum.tb_cliente.nombres_apellidos_cli': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//             'tb_ProgramaTraining.name_pgm': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         }
//     });
//     const [filters, setFilters] = useState({
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         status: { value: null, matchMode: FilterMatchMode.EQUALS },
//         verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     });
//     useEffect(() => {
//       obtenerReporteSeguimiento()
//     }, [])

//     // let networkTimeout = null;

//     useEffect(() => {
//         // loadLazyData();
//         setLoading(true);
//         const loadLazyData =() => {
//             setCustomers(reporteSeguimiento);
//             // try {
//             //     // setTotalRecords(data.totalRecords);
//             // } catch (error) {
//             //     console.error("Error loading data: ", error);
//             // } finally {
//                 setLoading(false);
//             // }
//         };
//         loadLazyData();
//     }, [reporteSeguimiento]);

//     // const loadLazyData = () => {
//     //     setLoading(true);

//     //     if (networkTimeout) {
//     //         clearTimeout(networkTimeout);
//     //     }

//     //     //imitate delay of a backend call
//     //     networkTimeout = setTimeout(() => {

//     //         CustomerService.getCustomers({ lazyEvent: JSON.stringify(lazyState) }).then((data) => {
//     //             setTotalRecords(data.totalRecords);
//     //             setCustomers(data.customers);
//     //             setLoading(false);
//     //         });
//     //     }, Math.random() * 1000 + 250);
//     // };

//     const onPage = (event) => {
//         setlazyState(event);
//     };

//     const onSort = (event) => {
//         setlazyState(event);
//     };

//     const onFilter = (event) => {
//         event['first'] = 0;
//         setlazyState(event);
//     };

//     return (
//             <DataTable
//                 value={customers}
//                 paginator
//                 showGridlines
//                 rows={10}
//                 loading={loading}
//                 dataKey="id"
//                 stripedRows
//                 sortMode="multiple"
//                 filters={lazyState.filters}
//                 rowsPerPageOptions={[10, 25, 50]}
//                 lazy
//                 filterDisplay="row"
//                 onPage={onPage}
//                 onSort={onSort}
//                 onFilter={onFilter}
//                 tableStyle={{ minWidth: '75rem' }}
//                 >
//                 <Column field="tb_ventum.tb_cliente.nombres_apellidos_cli" header="Clientes" sortable filter filterPlaceholder="Search" />
//                 <Column field="tb_ProgramaTraining.name_pgm" header="Programa / Semana" sortable filter filterPlaceholder="Search" />
//                 <Column field="name" header="Vencimiento" sortable filter filterPlaceholder="Search" />
//                 <Column field="name" header="Dias" sortable filter filterPlaceholder="Search" />
//                 <Column field="company" sortable filter header="Estados" filterPlaceholder="Search" />
//             </DataTable>
//     );
// }
