import React from 'react'
import { Card } from 'react-bootstrap'
import { PageBreadcrumb } from '@/components'
import { AppStatusInfluencer } from '../StatusInfluencer/AppStatusInfluencer'

export const App = () => {
  return (
    <>
      <PageBreadcrumb title={'INFORME GERENCIAL'}/>
      <Card>
        <Card.Body>
          <AppStatusInfluencer embebido/>
        </Card.Body>
      </Card>
    </>
  )
}
