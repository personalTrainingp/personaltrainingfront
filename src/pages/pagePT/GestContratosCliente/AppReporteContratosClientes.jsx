import React, { useEffect } from 'react'
import { useContratosDeClientes } from './useContratosDeClientes'
import { useSelector } from 'react-redux'

export const AppReporteContratosClientes = () => {
    const { obtenerContratosDeClientes } = useContratosDeClientes()
    const { dataView } =useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerContratosDeClientes
    }, [])
    
  return (
    <div>
        <pre>
            {JSON.stringify(dataView, null, 2)}
        </pre>
    </div>
  )
}
