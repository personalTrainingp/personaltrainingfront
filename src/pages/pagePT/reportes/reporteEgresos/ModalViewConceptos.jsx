import { FormatoDateMask, MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask'
import { useForm } from '@/hooks/useForm'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Button, Col } from 'react-bootstrap'

export const ModalViewConceptos = ({onHide, show, data}) => {
    const onCancelButton = ()=>{
        onHide()
    }
    
const formatCurrency = (value, currency) => {
    return value.toLocaleString('en-ES', { style: 'currency', currency });
  };
    const montoSOLESMonedaBodyTemplate = (rowData)=>{
      return (
            <div className=''>
                {rowData.moneda=='PEN'?'':''}
                <div className='float-end'>
                    {rowData.moneda=='PEN'?
                    <NumberFormatMoney amount={rowData.monto}/>
                    :('')

                    }
                </div>
            </div>
      )
    }
    const montoDOLARESMonedaBodyTemplate = (rowData)=>{
        return (
              <div className=''>
                  {rowData.moneda=='PEN'?'':''}
                  <div className='float-end'>
                  {rowData.moneda=='PEN'?('')
                    :
                    <NumberFormatMoney amount={rowData.monto}/>

                    }
                  </div>
              </div>
        )
      }
    
const IdBodyTemplate = (rowData)=>{
    return(
      <a href='#' style={{color: 'blue'}} onClick={()=>onViewModalEgreso(rowData.id)}>
        {rowData.id}
      </a>
    )
  }
  
const FechaPagoTemplate = (rowData)=>{
  
    const [year, month, day] = rowData.fec_pago.split('-').map(Number);
    return (
      <div>
        {FormatoDateMask(new Date(year, month - 1, day), 'D [de] MMMM [del] YYYY')}
      </div>
    )
  }
  console.log(data);
  
  return (
    <Dialog header={<div className='text-primary'>Gastos - {data?.proveedor}</div>} visible={show} style={{ width: '100%' }} position='bottom' onHide={onHide}>
        <div className="p-3">
          <DataTable value={data?.egresos}>
              <Column header="Id" body={IdBodyTemplate} style={{width: '4rem'}} sortable></Column>
              <Column header="Fecha de pago" body={FechaPagoTemplate} style={{width: '10rem'}} sortable></Column>
              <Column header="Descripcion" field='descripcion' style={{width: '40rem'}} sortable></Column>
              <Column header="N° Operacion" field='n_operacion' style={{width: '8rem'}} sortable></Column>
              <Column header="Monto Soles"  sortable style={{width: '8rem'}} body={montoSOLESMonedaBodyTemplate}></Column>
              <Column header="Monto Dolares"  sortable style={{width: '8rem'}} body={montoDOLARESMonedaBodyTemplate}></Column>
          </DataTable>
      </div>
    </Dialog>
  )
}
