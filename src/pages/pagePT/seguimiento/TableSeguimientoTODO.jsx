import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator, locale } from 'primereact/api';
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
import { FormatoDateMask, FormatoTimeMask } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { TabPanel, TabView } from 'primereact/tabview';
import { StatisticSeguimiento } from './StatisticSeguimiento';
import { useSelector } from 'react-redux';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';
import { Row } from 'react-bootstrap';
import { BtnExportSeguimiento } from './BtnExportSeguimiento';
import { arrayFacturas } from '@/types/type';
import { useSeguimientoStore } from './useSeguimientoStore';
import { Link } from 'react-router-dom';
dayjs.extend(utc);
locale('es')

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
export const TableSeguimientoTODO = ({dae, classNameFechaVenc, id_empresa, statisticsData, SeguimientoClienteActivos, esTodo, labelSesiones, labelSesionesPendientes, isClienteActive, sesionesCongReg}) => {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedCustomers, setSelectedCustomers] = useState([]);
	const { reporteSeguimiento, obtenerReporteSeguimiento, obtenerReporteSeguimientoTODO, viewSeguimiento, agrupado_programas, loadinData } = useReporteStore();
	const { dataSeguimientos, obtenerTodoSeguimiento } = useSeguimientoStore()
	const { dataView } = useSelector(e=>e.DATA)
	useEffect(() => {
		obtenerReporteSeguimientoTODO(id_empresa, isClienteActive)
		obtenerTodoSeguimiento(id_empresa, isClienteActive)
	  }, [])
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
	// console.log(customers, "customers");
	
	useEffect(() => {
		const fetchData = () => {
			setCustomers(getCustomers(viewSeguimiento));
			setLoading(false);
		};
		fetchData();
	}, [viewSeguimiento]);
	// console.log(viewSeguimiento, "view");
	
	const getCustomers = (data) => {
		return [...(data || [])].map((d) => {
			// console.log(data, "getCustomers");
			
            // Crea una copia del objeto antes de modificarlo
			const labelFactura =  arrayFacturas.find(f=>f.value ===d.tb_ventum.id_tipoFactura)?.label
            let newItem = { ...d };
			newItem.ProgramavsSemana = `${d.tb_ProgramaTraining?.name_pgm} | ${d.tb_semana_training?.semanas_st*5} Sesiones | ${dayjs(d.horario.split('T')[1].split('.')[0], 'hh:mm:ss').format('hh:mm A')}`;
			let fechaaaa = new Date(d.fec_fin_mem_new).toISOString()
			newItem.fecha_fin_new = dayjs.utc(fechaaaa)
			// d.dias = diasUTC(new Date(d.fec_fin_mem), new Date(d.fec_fin_mem_new));
			newItem.diasFaltan = diasLaborables(new Date(), dayjs.utc(fechaaaa))
			newItem.distrito = d.tb_ventum.tb_cliente.tb_distrito?.distrito;
			newItem.labelFactura = labelFactura
			newItem.diasExt = d.tb_extension_membresia[d.tb_extension_membresia.length-1]?.dias_habiles
			newItem.name_Ext = d.tb_extension_membresia[d.tb_extension_membresia.length-1]?.tipo_extension
			newItem.inicio_Ext = d.tb_extension_membresia[d.tb_extension_membresia.length-1]?.extension_inicio
			newItem.fin_Ext = d.tb_extension_membresia[d.tb_extension_membresia.length-1]?.extension_fin

			return newItem;
		});
	};
	const diasPorTerminarBodyTemplate = (rowData) => {
		return (
			<div>
				<span className='mr-2 fw-bold fs-3'>
					{rowData.diasFaltan} 
				</span>
					{labelSesiones}
			</div>
		);
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
		return 	<span>
					<span>
						{FormatoDateMask(rowData.fecha_fin_new, 'dddd D') }
					</span>
					{FormatoDateMask(rowData.fecha_fin_new, ' [de] MMMM [del] YYYY') }
				</span>
	};
	const statusBodyTemplate = (rowData) => {
        if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null){
            if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && diasLaborables(new Date().toISOString(), rowData.fec_fin_mem_new)<=0) {
                return ''
            }
            if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && diasLaborables(new Date().toISOString(), rowData.fec_fin_mem_new)>0){
                return ''
            }
        }
		if(encontrarObjeto(rowData.tb_extension_membresia, new Date()).tipo_extension==='REG'){
			return (
				<>
				<Message icon={'pi pi-gift'} severity="error" text={
				<>
				<span className='fw-bold fs-2 mr-2'>
					{rowData.diasExt} 
				</span>
				SESIONES DE REGALO
				<br/>
				<span className='fw-bold mr-2'>
					Desde: 
				</span>
				{dayjs(rowData.inicio_Ext, 'YYYY-MM-DD').format('dddd DD  [del] MMMM [DE] YYYY')}
				<br/>
				<span className='fw-bold mr-2'>
					Hasta: 
				</span>
				{dayjs(rowData.fin_Ext, 'YYYY-MM-DD').format('dddd DD  [del] MMMM [DE] YYYY')}
				</>
			}  />  
				</>
			);
		}
		if(encontrarObjeto(rowData.tb_extension_membresia, new Date()).tipo_extension==='CON'){
			return <Message icon={'pi pi-slack'} severity="info" text={
				<>
				<span className='fw-bold fs-2 mr-2'>
					{rowData.diasExt} 
				</span>
				SESIONES DE CONGELAMIENTO
				<br/>
				<span className='fw-bold mr-2'>
					Desde: 
				</span>
				{dayjs(rowData.inicio_Ext, 'YYYY-MM-DD').format('dddd DD [del] MMMM [DE] YYYY')}
				<br/>
				<span className='fw-bold mr-2'>
					Hasta: 
				</span>
				{dayjs(rowData.fin_Ext, 'YYYY-MM-DD').format('dddd DD [del] MMMM [DE] YYYY')}
				</>
			} />;
		}
	};
    // const isActiveBodyTemplate = (rowData)=>{
    //     if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null){
    //         if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && diasLaborables(new Date().toISOString(), rowData.fec_fin_mem_new)<=0) {
    //             return <Message severity="error" text="INACTIVO" />
    //         }
    //         if(encontrarObjeto(rowData.tb_extension_membresia, new Date())===null && diasLaborables(new Date().toISOString(), rowData.fec_fin_mem_new)>0){
    //             return <Message severity="success" text="ACTIVO" />
    //         }
    //     }
    // }
	const IdBodyTemplate = (rowData, { rowIndex })=>{
        return (
            <div className={`flex align-items-center gap-2`}>
                <span>{rowIndex + 1}</span>
            </div>
        );
	}
	const SociosbodyTemplate = (rowData)=>{
		return (
            <div className={`align-items-center gap-2`}>
                <Link  to={`/historial-cliente/${rowData.tb_ventum.tb_cliente.uid}`} className={`font-bold hover-text`}>{rowData.tb_ventum.tb_cliente.nombres_apellidos_cli}</Link>
                <div>Email: {rowData.tb_ventum.tb_cliente.email_cli} </div>
                <div>Telefono: {rowData.tb_ventum.tb_cliente.tel_cli?rowData.tb_ventum.tb_cliente.tel_cli.replace(/ /g, "").match(/.{1,3}/g).join('-'):''} </div>
                <div className={`fw-bold`}>Distrito: <span className={`'${rowExtension(rowData)}'`}>{rowData.distrito} </span></div>
                {/* <div>EDAD: {rowData.distrito} </div> */}
            </div>
        );
	}
	const programaSesioneBodyTemplate = (rowData)=>{
		return (
			<div className=''>
			<span className='fw-semibold font-20'>
			{rowData.ProgramavsSemana.split('|')[0]} 
			</span>
			<br/>
			<span className='fw-semibold font-20'>
			{rowData.labelFactura} 
			</span>
			<br/>
			{rowData.ProgramavsSemana.split('|')[1]}
			<br/>
			
			<FormatoTimeMask
				date={rowData.ProgramavsSemana.split('|')[2]}
				format={'hh:mm A'}
			/>
			{/* {rowData.ProgramavsSemana.split('|')[2]} */}
			</div>
		)
	}

	// const dateFilterTemplate = (options) => {
	// 	return (
	// 		<Calendar
	// 			value={options.value}
	// 			onChange={(e) => options.filterCallback(e.value, options.index)}
	// 			dateFormat="mm/dd/yy"
	// 			placeholder="mm/dd/yyyy"
	// 			mask="99/99/9999"
	// 		/>
	// 	);
	// };
	    // Función para asignar una clase CSS a la fila
		const rowClassName = (rowData) => {
			return rowExtension(rowData);
		};
		const rowExtension = (rowData)=>{
			switch (encontrarObjeto(rowData.tb_extension_membresia, new Date())?.tipo_extension) {
				case 'REG':
					return 'row-danger'
					break;
				case 'CON':
				return 'row-congelamiento'
				break;
				default:
					return 'row-color-danger'
					break;
	}
		}
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
						header="Programas / Semana"
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
								 header={<span>SESIONES <br/> REGALO / <br/> CONGELAMIENTO</span>}
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
							        <StatisticSeguimiento  data={viewSeguimiento} statisticsData={agrupado_programas} />
                                </Row>
				<DataTable
					value={customers}
					size='small'
					rowClassName={rowClassName}
					paginator
					header={header}
					rows={10}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					rowsPerPageOptions={[10, 25, 50, 300]}
					dataKey="id"
					stripedRows
					selection={selectedCustomers}
					onSelectionChange={(e) => setSelectedCustomers(e.value)}
					filters={filters}
					filterDisplay="menu"
					globalFilterFields={["labelFactura", "tb_ventum.tb_cliente.nombres_apellidos_cli", "distrito",  "ProgramavsSemana", "dias"]}
					emptyMessage="Sin clientes."
					currentPageReportTemplate="Mostrando {first} HASTA {last} DE {totalRecords} ITEMS"
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
						body={SociosbodyTemplate}
						filterPlaceholder="Search by name"
						style={{ minWidth: '20rem' }}
					/>
					<Column
						field="ProgramavsSemana"
						header="Programas / Sesiones / Horario"
						sortable
						filterField="ProgramavsSemana"
						style={{ minWidth: '14rem' }}
						body={programaSesioneBodyTemplate}
						filter
						filterPlaceholder="Buscar programa, semana o horario"
					/>
					<Column
						field="dias"
						header={labelSesionesPendientes}
						sortable
						dataType="numeric"
						style={{ minWidth: '12rem' }}
						body={diasPorTerminarBodyTemplate}
						filter
					/>
					<Column
						header="Fecha de vencimiento"
						sortable
						dataType="date"
						style={{ minWidth: '10rem' }}
						body={dateBodyTemplate}
						// filter
						// filterElement={dateFilterTemplate}
					/>
					<Column 
								 field="status" 
								 header={<span>SESIONES <br/> CONGELAMIENTO/ <br/> REGALO  </span>}
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
