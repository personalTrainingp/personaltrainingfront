import { PTApi } from '@/common';
import React from 'react'

export const useKardexStore = () => {
    const obtenerKardexXArticuloXMovimiento = async({id_articulo, movimiento})=>{
        try {
            const { data } = await PTApi.get(`/inventario/movimiento-x-articulo/${id_articulo}/${movimiento}`)
        } catch (error) {
            console.log(error);
        }
    }
    const postKardexxMovimientoxArticulo = async({id_articulo, movimiento})=>{
        try {
            const { data } = await PTApi.get(`/inventario/movimiento-x-articulo/${id_articulo}/${movimiento}`)
        } catch (error) {
            console.log(error);
        }
    }
  return {
    obtenerKardexXArticuloXMovimiento,
    postKardexxMovimientoxArticulo
  }
}
