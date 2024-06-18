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
    
    console.log(extensions);
	return new Date(mayorFecha);
}
function encontrarObjeto(array, fecha_act) {
    //DESTRUCUTRANDO EL ARRAY
    // const { ... } = array;
    // Convertir la fecha_act a un objeto Date
    const fechaActual = new Date(fecha_act);
  
    // Recorrer el array
    for (let i = 0; i < array.length; i++) {
      const objeto = array[i];
      const extensionInicio = new Date(objeto.extension_inicio);
      const extensionFin = new Date(objeto.extension_fin);
  
      // Verificar si fechaActual está entre extensionInicio y extensionFin
      if (fechaActual >= extensionInicio && fechaActual <= extensionFin) {
        return objeto;
      }
    }
  
    // Retornar null si no se encuentra ningún objeto
    return null;
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
		// dias: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null){
            if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && rowData.dias<=0) {
                return 'INACTIVO'
            }
            if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && rowData.dias>0){
                return 'ACTIVO'
            }
        }
		return encontrarObjeto(rowData.tb_extension_membresia, new Date()).tipo_extension;
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
