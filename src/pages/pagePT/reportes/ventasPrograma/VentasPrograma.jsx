import { PageBreadcrumb } from '@/components'
import React from 'react'
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap'
import ProgramaContainer from './ProgramaContainer'
import logoRPM from '@/assets/images/PT-images/logos-programas/rpm50-blanco.png'
import Statistics from './Statistics'
import { members, statisticsClientes } from './data'
import ProjectStatistics from './ProjectStatistics'
import TeamMembers from './TeamMembers'
export const VentasPrograma = () => {
  return (
    <>
    <PageBreadcrumb title="Ventas por programas" subName="Ventas" />
    <Row className='mb-4 align-items-center'>
      <Col xxl={2} md={4} xs={6}>
      <FloatingLabel controlId="floatingSelect" label="Tipo">
							<Form.Select aria-label="Floating label select example">
								<option value="1">RPM 50 XTREME</option>
								<option value="2">FUSION SAVAGE</option>
								<option value="3">MUSCLE SOLID</option>
								<option value="4">CHANGE YOUR LIFE</option>
							</Form.Select>
			</FloatingLabel>
      </Col>
      <Col xxl={2} md={4} xs={6}>
      <FloatingLabel controlId="floatingSelect" label="Año">
							<Form.Select aria-label="Floating label select example">
								<option value="0">TODOS</option>
								<option value="1">2024</option>
								<option value="2">2023</option>
								<option value="3">2022</option>
								<option value="4">2021</option>
							</Form.Select>
			</FloatingLabel>
      </Col>
    </Row>
    <Row className='align-items-center'>
      <Col xxl={3}>
      <ProgramaContainer imgUrl={logoRPM}/>
      </Col>
      <Statistics statisticsData={statisticsClientes}/>
    </Row>
    <Row>
      <Col xxl={9}>
      <ProjectStatistics/>
      </Col>
      <Col xxl={3}>
        <TeamMembers members={members} title={'Clientes frecuentes'}/>
      </Col>
    </Row>
    </>
    
  )
}
