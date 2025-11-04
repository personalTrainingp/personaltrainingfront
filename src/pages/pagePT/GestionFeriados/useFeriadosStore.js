import { PTApi } from '@/common';
import React from 'react'

export const useFeriadosStore = () => {
    const obtenerFeriados = async()=>{
        try {
            const {data} = await PTApi.get('')
        } catch (error) {
            console.log(error);
            
        }
    }
  return {

  }
}
