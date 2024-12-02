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
import dayjs from 'dayjs';
import { FormatoDateMask } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { TabPanel, TabView } from 'primereact/tabview';
import { StatisticSeguimiento } from './StatisticSeguimiento';
import { useSelector } from 'react-redux';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';
import { Row } from 'react-bootstrap';
import { BtnExportSeguimiento } from './BtnExportSeguimiento';
dayjs.extend(utc);

// function obtenerMayorExtensionFin(extensions) {
// 	let mayorFecha = '';
// 	extensions.forEach((extension) => {
// 		if (mayorFecha === '' || new Date(extension.extension_fin) > new Date(mayorFecha)) {
// 			mayorFecha = extension.extension_fin;
// 		}
// 	});
    
//     console.log(extensions);
// 	return new Date(mayorFecha);
// }
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
export const TableSeguimiento = ({dae, statisticsData, SeguimientoClienteActivos, id_empresa}) => {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedCustomers, setSelectedCustomers] = useState([]);
	const { reporteSeguimiento, obtenerReporteSeguimiento, agrupado_programas, loadinData } = useReporteStore();
	const { dataView } = useSelector(e=>e.DATA)
	useEffect(() => {
		obtenerReporteSeguimiento(SeguimientoClienteActivos, id_empresa)
	  }, [])
	  console.log(dataView);
	  
	const { diasLaborables, daysUTC } = helperFunctions();
	const [filters, setFilters] = useState({
		
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

	useEffect(() => {
		if(dataView.length<=0){
			const fetchData = () => {
				setCustomers(getCustomers(dataView));
				setLoading(false);
			};
			fetchData();
		}
	}, [dataView]);

	const getCustomers = (data) => {
		return [...(data || [])].map((d) => {
			
            // Crea una copia del objeto antes de modificarlo
            let newItem = { ...d };
			newItem.ProgramavsSemana = `${d.tb_ProgramaTraining?.name_pgm} | ${d.tb_semana_training?.semanas_st} Semanas | ${dayjs(d.horario.split('T')[1].split('.')[0], 'hh:mm:ss').format('hh:mm A')}`;
			let fechaaaa = new Date(d.fec_fin_mem_new).toISOString()
			newItem.fecha_fin_new = dayjs.utc(fechaaaa)
			// d.dias = diasUTC(new Date(d.fec_fin_mem), new Date(d.fec_fin_mem_new));
			newItem.diasFaltan = diasLaborables(new Date(), dayjs.utc(fechaaaa))
			newItem.distrito = d.tb_ventum.tb_cliente.tb_distrito?.distrito;
			return newItem;
		});
	};
	
	const diasPorTerminarBodyTemplate = (rowData) => {
		return `${rowData.diasFaltan} sesiones`;
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
			<div className="d-flex">
				{/* <h4 className="m-0">Customers</h4> */}
				<IconField iconPosition="left">
					<InputIcon className="pi pi-search" />
					<InputText
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Buscador global"
					/>
				</IconField>
				<BtnExportSeguimiento dataExport={customers}/>
			</div>
		);
	};
	const dateBodyTemplate = (rowData) => {
		// console.log(rowData); JSON.stringify(rowData.fecha_fin_new)
		//dayjs(rowData.fecha_fin_new).format('D [de] MMMM [del] YYYY')
		return 	<span>{FormatoDateMask(rowData.fecha_fin_new, 'dddd D [de] MMMM [del] YYYY') }</span>
	};
	
	const formatDate = (value) => {
		return value.toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};
	const statusBodyTemplate = (rowData) => {
        if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null){
            if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && diasLaborables(new Date().toISOString(), rowData.fec_fin_mem_new)<=0) {
                return <Message severity="error" text="INACTIVO" />
            }
            if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && diasLaborables(new Date().toISOString(), rowData.fec_fin_mem_new)>0){
                return <Message severity="success" text="ACTIVO" />
            }
        }
		if(encontrarObjeto(rowData.tb_extension_membresia, new Date()).tipo_extension==='REG'){
			return <Message icon={'pi pi-gift'} severity="error" text={'REGALO'} />;
		}
		if(encontrarObjeto(rowData.tb_extension_membresia, new Date()).tipo_extension==='CON'){
			return <Message icon={'pi pi-slack'} severity="info" text={'CONGELAMIENTO'} />;
		}
	};
	
	const IdBodyTemplate = (rowData, { rowIndex })=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowIndex + 1}</span>
            </div>
        );
	}
	
	const SociosbodyTemplate = (rowData)=>{
		return (
            <div className="align-items-center gap-2">
                <div className='font-bold '>{rowData.tb_ventum.tb_cliente.nombres_apellidos_cli}</div>
                <div>Email: {rowData.tb_ventum.tb_cliente.email_cli} </div>
                <div>Telefono: {rowData.tb_ventum.tb_cliente.tel_cli?rowData.tb_ventum.tb_cliente.tel_cli.replace(/ /g, "").match(/.{1,3}/g).join('-'):''} </div>
                <div className='fw-bold text-primary'>Distrito: {rowData.distrito} </div>
                {/* <div>EDAD: {rowData.distrito} </div> */}
            </div>
        );
	}
	
	const programaSesioneBodyTemplate = (rowData)=>{
		return (
			<>
			<span className='text-primary fw-semibold font-20'>
			{rowData.ProgramavsSemana.split('|')[0]} 
			</span>
			<br/>
			{rowData.ProgramavsSemana.split('|')[1]}
			<br/>
			{rowData.ProgramavsSemana.split('|')[2]}
			</>
		)
	}
	console.log(dataView);
	

	const header = renderHeader();
	return (
			<>
				{
					loadinData?(
							<DataTable
					size='small'
                    value={Array.from({ length: 10 }, (v, i) => i)} 
                    className="p-datatable-striped"
				>
					<Column
						field="tb_ventum.tb_cliente.nombres_apellidos_cli"
						header="SOCIOS"
						sortable
						filter
						filterPlaceholder="Search by name"
						style={{ minWidth: '14rem' }}
						body={<Skeleton/>}
					/>
					<Column
						header="Programa / Semanas / HORARIO"
						sortable
						body={<Skeleton/>}
						style={{ minWidth: '14rem' }}
						filter
						filterPlaceholder="Search by country"
					/>
					<Column
						header="Vencimiento"
						sortable
						dataType="date"
						style={{ minWidth: '12rem' }}
						body={<Skeleton/>}
						// filter
						// filterElement={dateFilterTemplate}
					/>
					<Column
						header="sesiones pendientes"
						sortable
						dataType="numeric"
						style={{ minWidth: '12rem' }}
						body={<Skeleton/>}
						filter
					/>
					<Column 
								 header="Status" 
								 sortable 
								 filterMenuStyle={{ width: '14rem' }} 
								 style={{ minWidth: '12rem' }} 
								 body={<Skeleton/>} 
								 filter 
								 // filterElement={statusFilterTemplate} 
								 />
				</DataTable>
					):(
<>
	
							<Row>
								<StatisticSeguimiento  data={dataView} statisticsData={agrupado_programas} />
							</Row>
				<DataTable
					value={customers}
					size='small'
					stripedRows
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
					globalFilterFields={["tb_ventum.tb_cliente.nombres_apellidos_cli", "ProgramavsSemana", "dias"]}
					emptyMessage="Sin clientes."
					currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} entries"
				>
					
				<Column
					// field="tb_ventum.tb_cliente.nombres_apellidos_cli"
					header="Id"
					body={IdBodyTemplate}
					filterPlaceholder="Search by name"
					style={{ minWidth: '2rem' }}
				/>
					<Column
						field="tb_ventum.tb_cliente.nombres_apellidos_cli"
						header="Socios"
						sortable
						filter
						filterPlaceholder="Search by name"
						body={SociosbodyTemplate}
						style={{ minWidth: '14rem' }}
					/>
					<Column
						field="ProgramavsSemana"
						header="Programas / Semanas / Horario"
						body={programaSesioneBodyTemplate}
						sortable
						filterField="ProgramavsSemana"
						style={{ minWidth: '14rem' }}
						filter
						filterPlaceholder="Search by country"
					/>
					<Column
						header="VENCIMIENTO"
						sortable
						dataType="date"
						style={{ minWidth: '12rem' }}
						body={dateBodyTemplate}
						// filter
						// filterElement={dateFilterTemplate}
					/>
					<Column
						field="dias"
						header="SESIONES PENDIENTES"
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
</>
					)
				}
			</>
	);
};
