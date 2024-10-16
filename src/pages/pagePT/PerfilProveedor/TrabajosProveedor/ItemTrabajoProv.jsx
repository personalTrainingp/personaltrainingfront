import { DateMask, MoneyFormatter } from '@/components/CurrencyMask'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
import { Badge } from 'primereact/badge'
import React from 'react'
import { Link } from 'react-router-dom'

export const ItemTrabajoProv = ({onOpenModalFirma, onOpenModalVerPagos, tipo_moneda, observacion, codigo, fec_inicia, fec_termina, hora_fin, monto}) => {
  return (
      <li className="mb-4 cursor-pointer border-bottom-3 hover-li p-2">
          <h3 className='text-muted align-items-center d-flex'>
            {observacion}

          <Badge className='mx-2' value={'Pendiente'} size='normal' severity='warning'/>
          </h3>
          <p className="text-muted mb-1 font-16 font-bold">
          <i className="mdi mdi-calendar me-1"></i> CODIGO: #{codigo} 
          <br/>
          <i className="mdi mdi-calendar me-1"></i> INICIA: <DateMask date={fec_inicia} format={'dddd D [de] MMMM [del] YYYY'}/> 
          <br/>
          <i className="mdi mdi-calendar me-1"></i> TERMINA: <DateMask date={fec_termina} format={'dddd D [de] MMMM [del] YYYY'}/> <DateMask date={hora_fin} format={'[a las] hh:mm A'}/>
          <br/>
          <i className="mdi mdi-calendar me-1"></i> MONTO: <MoneyFormatter amount={monto} symbol={tipo_moneda=='PEN'?'S/. ':'$ '}/>
          <br/>
          <div>
          {/* <a className="action-icon mx-2" onClick={onOpenModalVerPagos} style={{fontSize: '16px', color: 'blue', textDecoration: 'underline'}}>
                    Ver Detalles
            </a> */}
            <a className="action-icon mx-2" onClick={onOpenModalVerPagos} style={{fontSize: '16px', color: 'blue', textDecoration: 'underline'}}>
                    Ver Detalle
            </a>
          </div>
          </p>
      </li>
  )
}
