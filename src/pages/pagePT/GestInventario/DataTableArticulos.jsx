import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useEffect } from 'react'
import { useArticuloStore } from './hook/useArticuloStore';
import config from '@/config';
import { Image } from 'primereact/image';
import { confirmDialog } from 'primereact/confirmdialog';

export const DataTableArticulos = ({onOpenModalCustomArticulo, onOpenModalMovimientos, idEmpresa}) => {

  const { obtenerArticulosxEmpresa, dataView, onDeleteArticuloxID } = useArticuloStore()

  const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'foto', header: 'FOTO', sortable: true, width: 20, render:(row)=>{
      
        const images = [...(row.tb_images || [])];
        // Ordenamos por ID descendente
        const sortedImages = images.sort((a, b) => b.id - a.id);
        const latestImage = sortedImages[0]?.name_image;
        const imageUrl = latestImage
            ? `${config.API_IMG.AVATAR_ARTICULO}${latestImage}`
            : '';
      return (
        <>
                                <Image src={row.tb_images?.length===0?'':`${imageUrl}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="270" />
        </>
      )
    } },
    { id: 'nombre', header: 'Nombre', render: (row)=>{
      return (
        <div className='' style={{width: '90px'}}>
        {row?.producto}
        </div>
      )
    } },
    { id: 'modelo', header: 'Modelo', accessor: 'modelo', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'descripcion', header: 'Descripcion', accessor: 'descripcion', width: 70 },
    { id: 'ubicacion', header: 'ubicacion',  width: 70, render: (row)=>{
      return (
        <>
        {row?.parametro_lugar_encuentro?.label_param}
        </>
      )
    } },
    { id: 'cantidad', header: 'cantidad', accessor: 'cantidad'},
    { id: 'costo_unitario_soles', header: <div className='text-center'>costo <br/> unit. S/.</div>, accessor: 'costo_unitario_soles' },
    { id: 'costo_unitario_dolares', header: <div className='text-center'>costo <br/> unit. $</div>, accessor: 'costo_unitario_dolares' },
    { id: 'costo_mano_obra_soles', header: <div className='text-center'>costo <br/> MANO OBRA S/.</div>, accessor: 'mano_obra_soles' },
    { id: 'costo_mano_obra_dolares', header: <div className='text-center'>costo <br/> MANO OBRA $</div>, accessor: 'mano_obra_dolares' },
    { id: 'costo_total_soles', header: <div className='text-center'>costo <br/> TOTAL S/.</div>, width: 70, render:(row)=>{
      return (
        <>
        {(row?.costo_unitario_soles*row?.cantidad)+row?.mano_obra_soles}
        </>
      )
    } },
    { id: 'costo_total_dolares', header: <div className='text-center'>costo <br/> TOTAL $</div>, width: 70,  render: (row)=>{
      return (
        <>
        {(row?.costo_unitario_dolares*row?.cantidad)+row?.mano_obra_dolares}
        </>
      )
    }},
    { id: 'action', header: '', width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
        return (
            <>
            <i className='pi pi-pencil p-2 border border-2 border-black my-2' onClick={()=>onClickEditar(row.id)}></i>
            <i className='pi pi-box p-2 border border-2 border-black my-2' onClick={()=>onClickBox(row.id)}></i>
            <i className='pi pi-trash p-2 border border-2 border-black my-2' onClick={()=>onClickEliminar(row.id)}></i>
            </>
        )
    } },
  ];
  useEffect(() => {
    obtenerArticulosxEmpresa(idEmpresa)
  }, [idEmpresa])
  
  const onClickEditar = (id)=>{
    onOpenModalCustomArticulo(id)
  }
  const onClickEliminar = (id)=>{
    confirmDialog({
      message: '¿DESEAS ELIMINAR ESTE ARTICULO?',
      accept: ()=>{
        onDeleteArticuloxID(id, idEmpresa)
      }
    })
  }
  const onClickBox = (id)=>{
    onOpenModalMovimientos(id)
  }
  console.log({dataView});
  
  return (
    <>
        <DataTableCR
            columns={columns}
            data={dataView}
        />
    </>
  )
}
