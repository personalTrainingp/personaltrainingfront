import { NumberFormatMoney } from '@/components/CurrencyMask'
import React from 'react'
import { Modal, Table } from 'react-bootstrap'

export const ModalConceptos = ({dataConceptos, headerGrupo, show, onHide}) => {
      const dataAlter = dataConceptos.map(d=>{
    const montoData = d.data?.reduce((total, item)=>total+item?.monto,0)
    return {
      ...d,
      montoData
    }
  })
  return (
    <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header>
            <Modal.Title>
                CONCEPTOS DE {headerGrupo || ''}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table>
                <thead>
                    <tr>
                        <th>CONCEPTO</th>
                        <th>MONTO</th>
                        <th>ITEMS</th>
                    </tr>
                </thead>
                <tbody>
                    
                                {
                                  dataAlter?.map(g=>{
                                    return (
                                      <tr onClick={()=>onClickData(g.conceptos, g.grupo)}>
                                        <td>{g?.concepto}</td>
                                        <td><NumberFormatMoney amount={g?.montoData}/></td>
                                        <td>{g?.data?.length}</td>
                                      </tr>
                                    )
                                  })
                                }
                </tbody>
            </Table>
        </Modal.Body>
    </Modal>
  )
}
