import React from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const 	ItemSemana = ({dataItem, onClick}) => {
  return (
				<div
					// onClick={(sem) => ClickonModalSemana(sem, e)}
					className="border border-2 hover-card rounded rounded-4 p-2 mb-2"
					onClick={onClick}
				>
					<ul className="list-inline mb-2">
						<li className="font-16 fw-semibold">
							<Link to="" className="text-secondary">
								{(
									<>
										{dataItem.semanas_st} SEMANAS
									</>
								)}
							</Link>
							<span
								className={`float-end  p-1 text-white rounded-1 fw-bold ${
									dataItem.estado_st === true ? 'bg-success' : 
                  					'bg-danger'
								}`}
							>
								{
								dataItem.estado_st === true ? 'Activo' : 
								'Inactivo'
                }
							</span>
						</li>
					</ul>
					{/* <p className="text-muted mb-1">
						<i className="mdi mdi-calendar-week me-1"></i>
						<b>Tarifa regular:</b> S/ 
            {e.tarifaRegular_st}
					</p> */}
					<p className="text-muted mb-1">
						<i className="mdi mdi-calendar-week me-1"></i>
						<b>Semanas:</b> {dataItem.semanas_st}
					</p>
					<p className="text-muted mb-1">
						<i className="mdi mdi-apple me-1"></i>
						<b>Nutricion:</b> {dataItem.nutricion_st}
					</p>
					<p className="text-muted mb-1">
						<i className="mdi mdi-snowflake me-1"></i>
						<b>Congelamiento:</b> {dataItem.congelamiento_st}
					</p>
					{/* <p className="text-muted mb-1">
						<i className="mdi mdi-tag-multiple me-1"></i>
						<b>Tarifas Habilitadas:</b> 10
					</p> */}
				</div>
  )
}
