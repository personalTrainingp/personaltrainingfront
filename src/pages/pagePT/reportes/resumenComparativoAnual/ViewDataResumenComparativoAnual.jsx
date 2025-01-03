import React, { useEffect, useState } from 'react'
import DataTreeMultiSelect from './DataTreeMultiSelect'
import { PageBreadcrumb } from '@/components'
import { Table } from 'react-bootstrap'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Button } from 'primereact/button'
import { useForm } from '@/hooks/useForm'
import dayjs from 'dayjs'
import { onSetMultiDate } from '@/store/data/dataSlice'
import { TableResumenAnual } from './TableResumenAnual'
import { useComparativoAnualStore } from './useComparativoAnualStore'

function obtenerMesesRango(rangoFechas) {
  const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const resultado = [];

  rangoFechas.forEach(({ fec_incio, fec_fin }) => {
      let inicio = new Date(fec_incio);
      const fin = new Date(fec_fin);

      // Iterar sobre cada mes dentro del rango
      while (inicio <= fin) {
          const anio = inicio.getUTCFullYear();
          const nMes = inicio.getUTCMonth() + 1; // Mes en formato 1-12
          const mes = meses[inicio.getUTCMonth()]; // Nombre del mes

          // Agregar el mes al resultado
          resultado.push({ anio, mes, nMes: nMes.toString().padStart(2, "0"), label: `${anio} - ${mes}`, value: `${anio}-${nMes.toString().padStart(2, "0")}` });
          // Mover al siguiente mes
          inicio = new Date(anio, nMes, 1);
      }
  });

  return resultado;
}
const selectMeses = {
  rangeMes: obtenerMesesRango([{ fec_incio: "2024-09-15T00:00:00.000Z", fec_fin: `${dayjs.utc(new Date()).format('YYYY-MM-DD')}T23:59:59.000Z` }])
}
export const ViewDataResumenComparativoAnual = () => {
  const { onInputChangeReactSelect, formState, rangeMes } = useForm(selectMeses)
  // const [isLoading, setisLoading] = useState(true)
  const { dataVentas, isLoading, obtenerProgramasxVentasxMesxAnio, obtenerProgramasxVentasxMULTIDATE } = useComparativoAnualStore()
      const selectsMulti = obtenerMesesRango([{ fec_incio: "2024-09-15T00:00:00.000Z", fec_fin: `${dayjs.utc(new Date()).format('YYYY-MM-DD')}T23:59:59.000Z` }])
  const dispatch = useDispatch()
  const onClickActualizar = ()=>{
      // dispatch(onSetMultiDate(rangeMes))
      const ProcedData = async()=>{
        await obtenerProgramasxVentasxMULTIDATE(rangeMes)
      }
      // setisLoading(false)
      ProcedData()
      // setisLoading(true)
  }
  useEffect(() => {
    obtenerProgramasxVentasxMULTIDATE(rangeMes)
  }, [])
  
  
  return (
    <>
    <PageBreadcrumb title={'Resumen comparativo por mes'}/>
    <br/>
    {
      isLoading?(
        <div className=''>
          <DataTreeMultiSelect selectsMulti={selectsMulti} defaultOptions={rangeMes} onInputChangeReactSelect={onInputChangeReactSelect}/>
          
          <TableResumenAnual dataMes={dataVentas}/>
        </div>
      ):(
        <div className='text-center'>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )
    }
    </>
  )
}
