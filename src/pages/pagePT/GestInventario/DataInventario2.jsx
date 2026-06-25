import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import TableInventario from './TableInventario'
import { Toast } from 'primereact/toast'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useInventarioStore } from './hook/useInventarioStore'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { Image } from 'primereact/image'
import config from '@/config'

export const DataInventario2 = ({id_enterprice, id_zona, etiquetas=[]}) => {
    const toast = useRef(null);
    const { obtenerArticulos} = useInventarioStore()
    const {dataView} = useSelector(e=>e.DATA)
    useEffect(() => {
        obtenerArticulos(id_enterprice)
    }, [id_enterprice])
    const columns =[
          { id: 'id', header: <div className='text-center'>ID</div>, accessor: 'id', sortable: true, width: 20, render: (row)=>{
      return (
        <div className='fs-2' style={{width: '80px'}}>
        {row?.id}
        </div>
      )
    } },
    { id: 'foto', header: <div className='text-center'>FOTO</div>, sortable: true, width: 20, render:(row)=>{
      
        const images = [...(row.tb_images || [])];
        // Ordenamos por ID descendente
        const sortedImages = images.sort((a, b) => b.id - a.id);
        const latestImage = sortedImages[0]?.name_image;
        const imageUrl = latestImage
            ? `${config.API_IMG.AVATAR_ARTICULO}${latestImage}`
            : '';
      return (
        <>
          <Image src={row.tb_images?.length===0?'':`${imageUrl}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="250" />
        </>
      )
    } },  
    { id: 'nombre', header: <div className='text-center'>NOMBRE</div>, accessor: 'producto', render: (row)=>{
      return (
        <div className='fs-2' style={{width: '300px'}}>
        {row?.producto}
        </div>
      )
    } },
    { id: 'modelo', header: <div className='text-center'>MODELO</div>,accessor: 'modelo',  width: 100, render: (row)=>{
      return (
        <div className='fs-2' style={{width: '200px'}}>
        {row?.modelo}
        </div>
      )
    }  },
    { id: 'descripcion', header: <div className='text-center'>DESCRIPCION</div>, accessor: 'descripcion',render: (row)=>{
      return (
        <div className='fs-2' style={{width: '400px'}}>
        {row?.descripcion}
        </div>
      )
    } },
    { id: 'ubicacion', header: <div className='text-center'>UBICACION</div>, accessor: 'lugar_encuentro',  width: 70, render: (row)=>{
      return (
        <div className='fs-2' style={{width: '300px'}}>
        {row?.parametro_lugar_encuentro?.label_param}
        </div>
      )
    } },
    { id: 'cantidad', header: <div className='text-center'>CANT.</div>, accessor: 'cantidad', sortable: 'cantidad', render: (row)=>{
      return (
        <div className='fs-2' style={{width: '10px'}}>
        {row?.cantidad}
        </div>
      )
    } },
    { id: 'costo_unitario_soles', header: <div className='text-center'>costo <br/> unit. S/.</div>, sortable: 'costo_unitario_soles', accessor: 'costo_unitario_soles', render:(row)=>{
      return (
        <div className='fs-2' style={{width: '100px'}}>
          <NumberFormatMoney
            amount=
            {(row?.costo_unitario_soles)}
            />
        </div>
      )
    }},
    { id: 'costo_unitario_dolares', header: <div className='text-center'>costo <br/> unit. $</div>, accessor: 'costo_unitario_dolares', render:(row)=>{
      return (
        <div className='fs-2'>
          <NumberFormatMoney
            amount=
              {(row?.costo_unitario_dolares)}
            />
        </div>
      )
    } },
    { id: 'costo_mano_obra_soles', header: <div className='text-center'>costo <br/> MANO OBRA S/.</div>, accessor: 'mano_obra_soles', render:(row)=>{
      return (
        <div className='fs-2'>
          <NumberFormatMoney
            amount=
            {(row?.mano_obra_soles)}
            />
        </div>
      )
    } },
    { id: 'costo_mano_obra_dolares', header: <div className='text-center'>costo <br/> MANO OBRA $</div>, accessor: 'mano_obra_dolares', render:(row)=>{
      return (
        <div className='fs-2'>
          <NumberFormatMoney
            amount=
        {(row?.mano_obra_dolares)}
            />
        </div>
      )
    } },
    { id: 'costo_total_soles', header: <div className='text-center'>costo <br/> TOTAL S/.</div>, width: 70, render:(row)=>{
      return (
        <div className='fs-2'>
          <div className='text-center text-gray-400'>costo <br/> TOTAL S/.</div>
          <NumberFormatMoney
            amount=
              {(row?.costo_unitario_soles*row?.cantidad)+row?.mano_obra_soles}
            />
        </div>
      )
    } },
    { id: 'costo_total_dolares', header: <div className='text-center'>costo <br/> TOTAL $</div>, width: 70,  render: (row)=>{
      return (
        <div className='fs-2'>
          <div className='text-center text-gray-400'>costo <br/> TOTAL $</div>
          <NumberFormatMoney
            amount=
            {(row?.costo_unitario_dolares*row?.cantidad)+row?.mano_obra_dolares}
          />
        </div>
      )
    }},
    ]
    
        const columnsExports = [
            {
                id: 'ID',
                exportHeader: 'ID',
                exportValue: (row) => row.id,
            },
            {
                id: 1,
                exportHeader: 'PRODUCTO',
                exportValue: (row)=>row.producto
            },
            {
                id: 2,
                exportHeader: 'modelo',
                exportValue: (row)=>row.modelo
            },
            {
                id: 3,
                exportHeader: 'DESCRIPCION',
                exportValue: (row)=>row.descripcion
            },
            {
                id: 'ubicacion',
                exportHeader: 'UBICACION',
                exportValue: (row)=>row.parametro_lugar_encuentro?.label_param
            },
            {
                id: 'cantidad',
                exportHeader: 'CANTIDAD',
                exportValue: (row)=>row.cantidad
            },
            {
                id: 'costo_unitario_soles',
                exportHeader: 'COSTO UNITARIO SOLES',
                exportValue: (row)=>row.costo_unitario_soles
            },
            {
                id: 'costo_unitario_dolares',
                exportHeader: 'COSTO UNITARIO DOLARES',
                exportValue: (row)=>row.costo_unitario_dolares
            },
            {
                id: 'costo_mano_obra_soles',
                exportHeader: 'COSTO MANO OBRA SOLES',
                exportValue: (row)=>row.costo_mano_obra_soles
            },
            {
                id: 'costo_mano_obra_dolares',
                exportHeader: 'COSTO MANO OBRA DOLARES',
                exportValue: (row)=>row.costo_mano_obra_dolares
            },
            {
                id: 'costo_total_soles',
                exportHeader: 'COSTO TOTAL SOLES',
                exportValue: (row)=>(row?.costo_unitario_soles*row?.cantidad)+row?.mano_obra_soles
            },
            {
                id: 'costo_total_dolares',
                exportHeader: 'COSTO TOTAL DOLARES',
                exportValue: (row)=>(row?.costo_unitario_dolares*row?.cantidad)+row?.mano_obra_dolares
            },
        ]
  return (
    <>
        <Toast ref={toast}/>
        <DataTableCR
          columns={columns}
          data={dataView.filter(item =>
            item.etiquetas_busquedas?.some(etiqueta =>
              etiquetas.includes(etiqueta.value)
            )
          )}
          exportExtraColumns={columnsExports}
        />
    </>
  )
}
