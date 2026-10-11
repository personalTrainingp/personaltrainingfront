import React, { useEffect, useMemo, useState } from 'react';
import { FilterMatchMode, FilterOperator, locale } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { TabPanel, TabView } from 'primereact/tabview';
import { Card } from 'react-bootstrap';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { Loading } from '@/components/Loading';
import config from '@/config';
import sinImage from '@/assets/images/SinImage.jpg';
import { useViewInventario } from './hook/useViewInventario';

const ID_EMPRESA = 2599;
const CHECKS = [
	{ id: 1, label: 'RAL', color: '#2c10cd', textWhite: true },
	{ id: 2, label: 'CIRCUS', color: '#EEBE00' },
	{ id: 3, label: 'REDUCTO', color: '#17a700' },
	{ id: 4, label: 'INSUMOS', color: '#C8A2C8' },
];

const costoTotalSoles = (item) => item.costo_unitario_soles * item.cantidad + item.mano_obra_soles;

// total cantidad y monto de una lista de articulos
const calcularTotales = (items) =>
	items.reduce(
		(acc, item) => {
			const costo_total_soles = costoTotalSoles(item);
			const precio_venta = item.tipoCambio?.precio_venta;
			acc.cantidad += Number(item.cantidad) || 0;
			acc.soles += costo_total_soles || 0;
			acc.dolares += precio_venta ? costo_total_soles / precio_venta : 0;
			return acc;
		},
		{ cantidad: 0, soles: 0, dolares: 0 }
	);

const initFilters = () => ({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	producto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	marca: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
	'parametro_lugar_encuentro.label_param': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
});

export const ViewInventario = () => {
	locale('es');
	const { articulos, isLoading, error, obtenerArticulos } = useViewInventario();
	const [search, setSearch] = useState('');
	const [filters] = useState(initFilters);
	// fila inicial de la paginacion por pestaña, para no volver a la pagina 1 al actualizar datos
	const [firstxTab, setFirstxTab] = useState({});
	// filtro de la tabla por CHECK ID (1 RAL, 2 CIRCUS, 3 REDUCTO, 4 INSUMOS); null = sin filtro
	const [filtroCheckId, setfiltroCheckId] = useState(null);

	useEffect(() => {
		obtenerArticulos(ID_EMPRESA);
	}, []);

	const groupedData = useMemo(() => {
		const grupos = Object.values(
			articulos.reduce((acc, item) => {
				const lugar = item.parametro_lugar_encuentro || {};
				const key = `${lugar.nivel ? `NIVEL ${lugar.nivel} ` : ''}${lugar.label_param}`;
				if (!acc[key]) {
					acc[key] = { lugar: key, nivel: lugar.nivel ? `NIVEL ${lugar.nivel}` : '', zona: lugar.label_param, orden_param: lugar.orden_param, items: [] };
				}
				acc[key].items.push(item);
				return acc;
			}, {})
		);
		grupos.sort((a, b) => a.orden_param - b.orden_param);
		grupos.unshift({ lugar: 'todos', nivel: '', zona: 'TODOS', orden_param: -1, items: articulos });
		return grupos;
	}, [articulos]);

	const totalResumen = calcularTotales(articulos);
	const totalesCheck = Object.fromEntries(
		CHECKS.map((c) => [c.id, calcularTotales(articulos.filter((item) => item.id_color_subrayado === c.id))])
	);

	const onClickFiltroCheck = (id) => {
		setfiltroCheckId((prev) => (prev === id ? null : id));
		setFirstxTab({});
	};
	const onLimpiarFiltroCheck = () => {
		setfiltroCheckId(null);
		setFirstxTab({});
	};
	const styleCardCheck = (id) => ({
		cursor: 'pointer',
		outline: filtroCheckId === id ? '5px solid #000' : 'none',
		opacity: filtroCheckId && filtroCheckId !== id ? 0.5 : 1,
	});

	const header = (
		<div className="d-flex justify-content-between">
			<InputText
				placeholder="Buscar..."
				value={search}
				onChange={(e) => { setSearch(e.target.value); setFirstxTab({}) }}
				className="mb-3"
			/>
		</div>
	);

	const IdBodyTemplate = (rowData) => (
		<div className="flex align-items-center gap-2 fs-4">
			<span>{rowData.id}</span>
		</div>
	);
	const ordenBodyTemplate = (rowData) => <div className="font-24">{rowData.orden ?? '-'}</div>;
	const checkIdBodyTemplate = (rowData) => <div className="font-24 fw-bold">{rowData.id_color_subrayado ?? '-'}</div>;
	const imagenBodyTemplate = (rowData) => {
		const images = [...(rowData.tb_images || [])].sort((a, b) => b.id - a.id);
		const latestImage = images[0]?.name_image;
		const imageUrl = latestImage ? `${config.API_IMG.AVATAR_ARTICULO}${latestImage}` : sinImage;
		return (
			<div className="flex align-items-center gap-2">
				<Image src={imageUrl} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="270" />
			</div>
		);
	};
	const ItemBodyTemplate = (rowData) => (
		<>
			<div className=''>PRODUCTO</div>
			<div className="flex align-items-center gap-2 font-24 fw-bold">
				<span>{rowData.producto}</span>
			</div>
		</>
	);
	const marcaBodyTemplate = (rowData) => (
		<>
			<div className=''>MARCA</div>
			<div className="flex align-items-center gap-2 font-24 fw-bold">
				<span>{rowData.parametro_marca?.label_param}</span>
			</div>
		</>
	);
	const descripcionBodyTemplate = (rowData) => (
		<>
			<span>
				<div className=''>DESCRIPCION</div>
				<div className="fw-bold flex align-items-center gap-2 font-24">{rowData.descripcion}</div>
			</span>
			<span>
				<div className=''>ETIQUETAS</div>
				<div className="fw-bold flex align-items-center gap-2 font-24">{rowData.etiquetas_str}</div>
			</span>
		</>
	);
	const lugarBodyTemplate = (rowData) => (
		<>
			<div className=''>UBICACION</div>
			<div className="gap-2 font-24 fw-bold">
				<div>{rowData.parametro_lugar_encuentro?.label_param} - NIVEL {rowData.parametro_lugar_encuentro?.nivel}</div>
			</div>
		</>
	);
	const cantidadBodyTemplate = (rowData) => (
		<>
			<div className=''>CANT.</div>
			<div className="fw-bold d-flex align-items-end w-50 gap-2 justify-content-end font-24">
				<span>{rowData.cantidad}</span>
			</div>
		</>
	);
	const costounitariosolesBodyTemplate = (rowData) => (
		<>
			<div className=''>COSTO UNIT. S/.</div>
			<div className="d-flex font-24 w-100">
				<div className='text-left w-100 fw-bold text-right'>
					<NumberFormatMoney amount={rowData.costo_unitario_soles} />
				</div>
			</div>
		</>
	);
	const costounitariodolaresBodyTemplate = (rowData) => (
		<div style={{ width: '180px' }}>
			<div className='text-color-dolar'> COSTO UNITARIO $.</div>
			<div className="d-flex font-24 w-100">
				<div className='text-left w-100 text-color-dolar fw-bold text-right'>
					<NumberFormatMoney amount={rowData.costo_unitario_soles / rowData.tipoCambio.precio_venta} />
				</div>
			</div>
		</div>
	);
	const costoManoObraBodyTemplate = (rowData) => (
		<>
			<div className=''> COSTO MANO OBRA S/.</div>
			<div className="d-flex font-24 w-100">
				<div className='text-left w-100 fw-bold text-right'>
					<NumberFormatMoney amount={rowData.mano_obra_soles} />
				</div>
			</div>
		</>
	);
	const costototalsolesBodyTemplate = (rowData) => (
		<>
			<div className=''> COSTO TOTAL S/.</div>
			<div className="d-flex font-24 w-100">
				<div className='text-left w-100 fw-bold text-right'>
					<NumberFormatMoney amount={costoTotalSoles(rowData)} />
				</div>
			</div>
		</>
	);
	const costototaldolaresBodyTemplate = (rowData) => {
		const costo_total_dolares = ((rowData.costo_unitario_soles / rowData.tipoCambio.precio_venta) * rowData.cantidad) + (rowData.mano_obra_soles / rowData.tipoCambio.precio_venta);
		return (
			<div style={{ width: '180px' }}>
				<div className='text-color-dolar'>COSTO TOTAL $.</div>
				<div className="d-flex font-24 w-100">
					<div className='text-left w-100 text-color-dolar fw-bold text-right'>
						<NumberFormatMoney amount={costo_total_dolares} />
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='container-fluid py-3'>
			<Loading show={isLoading} />
			<h3 className='fw-bold mb-3'>GESTION DE INVENTARIO <span className='text-muted fs-5'>({ID_EMPRESA})</span></h3>
			{error && <div className='alert alert-danger'>Error al cargar el inventario: {error}</div>}

			<Card className='my-3'>
				<Card.Body className='d-flex flex-wrap gap-5 font-24'>
					<div>
						<div>TOTAL CANTIDAD</div>
						<div className='fw-bold'>{totalResumen.cantidad}</div>
					</div>
					<div>
						<div>TOTAL MONTO S/.</div>
						<div className='fw-bold'><NumberFormatMoney amount={totalResumen.soles} /></div>
					</div>
					<div className='text-color-dolar'>
						<div>TOTAL MONTO $</div>
						<div className='fw-bold'><NumberFormatMoney amount={totalResumen.dolares} /></div>
					</div>
				</Card.Body>
			</Card>

			{CHECKS.map((c) => (
				<Card
					key={c.id}
					className={`my-3 ${c.textWhite ? 'text-white' : ''}`}
					style={{ backgroundColor: c.color, ...styleCardCheck(c.id) }}
					onClick={() => onClickFiltroCheck(c.id)}
					title={`Click para filtrar la tabla por CHECK ${c.label}`}
				>
					<Card.Header className={`font-24 fw-bold ${c.textWhite ? 'text-white' : ''}`} style={{ backgroundColor: c.color }}>CHECK {c.label}</Card.Header>
					<Card.Body className='d-flex flex-wrap gap-5 font-24'>
						<div>
							<div>TOTAL CANTIDAD</div>
							<div className='fw-bold'>{totalesCheck[c.id].cantidad}</div>
						</div>
						<div>
							<div>TOTAL MONTO S/.</div>
							<div className='fw-bold'><NumberFormatMoney amount={totalesCheck[c.id].soles} /></div>
						</div>
						<div>
							<div>TOTAL MONTO $</div>
							<div className='fw-bold'><NumberFormatMoney amount={totalesCheck[c.id].dolares} /></div>
						</div>
					</Card.Body>
				</Card>
			))}
			{filtroCheckId && (
				<Button
					className='mb-3'
					icon='pi pi-filter-slash'
					label={`LIMPIAR FILTRO (CHECK ${CHECKS.find((c) => c.id === filtroCheckId).label})`}
					severity='secondary'
					onClick={onLimpiarFiltroCheck}
				/>
			)}

			<div className='d-flex flex-wrap align-items-center gap-4 my-3 font-24'>
				<span className='fw-bold'>LEYENDA CHECK ID:</span>
				{CHECKS.map((c) => (
					<div key={c.id} className='d-flex align-items-center gap-2'>
						<span style={{ display: 'inline-block', width: '28px', height: '28px', backgroundColor: c.color, border: '1px solid #555' }}></span>
						<span><span className='fw-bold'>{c.id}</span> = {c.label}</span>
					</div>
				))}
			</div>

			<TabView>
				{groupedData.map((g) => {
					const filterData = g.items
						.filter((item) => (filtroCheckId ? item.id_color_subrayado === filtroCheckId : true))
						.filter((item) =>
							Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
						);
					return (
						<TabPanel key={g.lugar} header={<>{g.nivel}<br />{g.zona}</>}>
							<DataTable
								className='dataTable-verticals-lines dataTable-inventario'
								value={filterData}
								paginator
								first={firstxTab[g.lugar] ?? 0}
								onPage={(e) => setFirstxTab((prev) => ({ ...prev, [g.lugar]: e.first }))}
								header={header}
								rows={10}
								paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
								rowsPerPageOptions={[10, 100, 250, 500]}
								dataKey="id"
								filters={filters}
								filterDisplay="menu"
								emptyMessage="ARTICULOS NO ENCONTRADOS."
								showGridlines={true}
								stripedRows
								rowClassName={(rowData) => (rowData.id_color_subrayado ? `row-color-subrayado-${rowData.id_color_subrayado}` : '')}
								scrollable
							>
								<Column header={<span className={'font-24'}>Id</span>} field='id' style={{ width: '15px' }} body={IdBodyTemplate} />
								<Column header={<span className={'font-24'}>ORDEN</span>} field='orden' sortable style={{ width: '80px' }} body={ordenBodyTemplate} />
								<Column header={<span className={'font-24'}>CHECK ID</span>} field='id_color_subrayado' sortable style={{ width: '80px' }} body={checkIdBodyTemplate} />
								<Column header={<span className={'font-24'}>FOTO</span>} style={{ width: '10rem' }} body={imagenBodyTemplate} />
								<Column header={<span className={'font-24'}>ITEM</span>} field='producto' filterField="producto" sortable style={{ width: '3rem' }} body={ItemBodyTemplate} filter />
								<Column header={<span className={'font-24'}>MARCA</span>} field='marca' filterField="marca" sortable style={{ width: '3rem' }} body={marcaBodyTemplate} filter />
								<Column header={<span className={'font-24'}>DESCRIPCION</span>} field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter />
								<Column header={<span className={'font-24'}>UBIC.</span>} field='parametro_lugar_encuentro.label_param' filterField="parametro_lugar_encuentro.label_param" style={{ minWidth: '2rem' }} sortable body={lugarBodyTemplate} filter />
								<Column header={<span className={'font-24'}>CANT. </span>} field='cantidad' sortable style={{ minWidth: '5rem' }} body={cantidadBodyTemplate} />
								<Column header={<div className={'font-24'} style={{ width: '100px' }}>COSTO UNIT. <SymbolSoles isbottom={false} /></div>} field='costo_unitario_soles' style={{ minWidth: '10rem' }} sortable body={costounitariosolesBodyTemplate} />
								<Column header={<div className={'font-24'} style={{ width: '100px' }}>COSTO UNIT. <SymbolDolar isbottom={false} /></div>} field='costo_unitario_soles' style={{ minWidth: '10rem' }} sortable body={costounitariodolaresBodyTemplate} />
								<Column header={<div className={'font-24'} style={{ width: '130px' }}>COSTO MANO OBRA</div>} field='mano_obra_soles' style={{ minWidth: '5rem' }} sortable body={costoManoObraBodyTemplate} />
								<Column header={<div className={'font-24'} style={{ width: '130px' }}>COSTO TOTAL <SymbolSoles isbottom={false} /></div>} style={{ minWidth: '10rem' }} body={costototalsolesBodyTemplate} />
								<Column header={<div className={'font-24 text-color-dolar fw-bold'} style={{ width: '100px' }}>COSTO TOTAL $</div>} style={{ minWidth: '10rem' }} body={costototaldolaresBodyTemplate} />
							</DataTable>
						</TabPanel>
					);
				})}
			</TabView>
		</div>
	);
};
