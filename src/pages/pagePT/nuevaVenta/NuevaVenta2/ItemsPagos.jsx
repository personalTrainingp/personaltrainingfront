import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ItemPago } from './ItemPago'
import { onDeleteOneDetallePago } from '@/store/uiNuevaVenta/uiNuevaVenta'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { buscarLabelPorValue } from '@/store/dataParametros/parametroSlice'
import { useSelector } from 'react-redux'

/*
id_banco: 61
id_formaPago: 0
id_forma_pago: 53
id_tarjeta: 66
id_tipo_tarjeta: 74
*/
const obtenerLabelPorValue = (array, valor) => {
  let objetoEncontrado = array.find(function(objeto) {
      return objeto.value === valor;
  });
  // Si se encuentra un objeto con el valor buscado, devuelve su label; de lo contrario, devuelve null
  return objetoEncontrado ? objetoEncontrado.label : null;
}


export const ItemsPagos = ({dataPagos}) => {
    const dispatch = useDispatch()
    const { dataparametro } = useSelector(u=>u.parametro)
    const deleteOnePay = (id) =>{
        dispatch(onDeleteOneDetallePago(id))
    }
  return (
    <>
    {
      dataPagos.map(e=>{
        return(
          <ItemPago 
          key={e.value}
          fechaPay={e.fecha_pago} 
          id_banco={obtenerLabelPorValue(dataparametro, e.id_banco)}
          id_tipo_tarjeta={obtenerLabelPorValue(dataparametro, e.id_tipo_tarjeta)}
          id_tarjeta={obtenerLabelPorValue(dataparametro, e.id_tarjeta)}
          id_forma_pago={obtenerLabelPorValue(dataparametro, e.id_forma_pago)}
          montoPay={e.monto_pago} 
          observacionPay={e.observacion_pago} 
          deletePay={()=>deleteOnePay(e.value)}
          id={e.value}/>
        )
      })
    }
    </>
  )
}
