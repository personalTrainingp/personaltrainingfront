import { Button, Card, Col, Row } from 'react-bootstrap'
import { PageBreadcrumb, Table } from '@/components'
import { columns, sizePerPageList } from './ColumnsSet';
import { asesores } from './data';
import Select from 'react-select'
import { useForm } from '@/hooks/useForm';
import { Calendar } from 'primereact/calendar';
import { ProfileCard } from './ProfileCard';
import { useEffect } from 'react';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { VentasVendieron } from './VentasVendieron';
import { ComparativaporVentas } from './ComparativaporVentas';
import { FidelizacionClientes } from './FidelizacionClientes';
import { MetasDeVendedores } from './MetasDeVendedores';
import { members } from './dataM'

const rangoFechas = {
	rangoDate:[new Date(new Date().getFullYear(), 0, 1), new Date()],
	id_empl: 0
  }
const VentasAsesor = () => {
	const { formState, rangoDate, id_empl, onInputChange, onInputChangeReact, onResetForm } = useForm(rangoFechas)
	const {  } = useReporteStore()
	const { obtenerVendedores_vendieron, dataVendedoresVendieron } = useTerminoStore()
	useEffect(() => {
		obtenerVendedores_vendieron()
	}, [])
	
	useEffect(() => {

	}, [id_empl, rangoDate])
	
  return (
    <>
    <PageBreadcrumb title={'Ventas por asesor'} subName={'*'} />
	<Row>
		<Col xxl={3} md={4} xs={6}>
		<div className="mb-3">
			<label htmlFor="id_empl" className="form-label">
			Asesor*
			</label>
			<Select
				onChange={(e)=>onInputChangeReact(e, "id_empl")}
				name={"id_empl"}
				placeholder={'Seleccione el empleado'}
				className="react-select"
				classNamePrefix="react-select"
				options={dataVendedoresVendieron}
				value={dataVendedoresVendieron.find(
				(option) => option.value === id_empl
				)}
				required
			></Select>
		</div>
		</Col>
		<Col xxl={3} md={4} xs={6}>
        <div className="flex-auto">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
              Rango de fecha
          </label>
          <Calendar id="buttondisplay" value={rangoDate} name='rangoDate' onChange={onInputChange} showIcon selectionMode="range" readOnlyInput hideOnRangeSelection />
        </div>
      </Col>
	</Row>
			<Row>
				<Col xs={4}>
					<ProfileCard/>
				</Col>
				<Col xs={8}>
					<VentasVendieron/>
				</Col>
				<Col xs={6}>
					<ComparativaporVentas/>
				</Col>
				<Col xs={3}>
					<FidelizacionClientes members={members}/>
				</Col>
				<Col xs={3}>
					<MetasDeVendedores/>
				</Col>
			</Row>
    </>
  )
}

export {VentasAsesor}

{/* <Table
								columns={columns}
								data={asesores}
								pageSize={10}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={true}
								isSearchable={true}
								tableClass="table-striped"
								theadClass="table-light"
								searchBoxClass="mt-2 mb-3"
							/> */}