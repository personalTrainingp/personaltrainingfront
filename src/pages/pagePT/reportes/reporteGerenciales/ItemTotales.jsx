import { MoneyFormatter } from '@/components/CurrencyMask'
import React from 'react'
import { Card } from 'react-bootstrap'

export const ItemTotales = ({itemLabel, itemTotal}) => {
  return (
    <Card className="card-shadow border border-1 rounded rounded-4 shadow shadow-8">
        <Card.Body className="text-center">
            <p className="font-bold font-24 mb-0 text-primary">{itemLabel}</p>
            <h3>
                <span className='font-24'>{itemTotal}</span>
            </h3>
        </Card.Body>
    </Card>
  )
}
