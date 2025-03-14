import { FormatTable } from '@/components/ComponentTable/FormatTable'
import { FormatTable2 } from '@/components/ComponentTable/FormatTable2'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

export const ItemTable = ({dataF}) => {
  return (
    <Row>
    {
      dataF.map(f=>{
        return (
        <Col lg={3}>
            <FormatTable2 data={ [f] }/>
        </Col>
        )
      })
    }
      {/* {
        dataF.map(f=>{
          return (
          )
        })
      } */}
    </Row>
  )
}
