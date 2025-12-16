import { DataTableCR } from '@/components/DataView/DataTableCR';
import React, { useEffect } from 'react'
import { useArticuloStore } from './hook/useArticuloStore';
import config from '@/config';
import { Image } from 'primereact/image';
import { confirmDialog } from 'primereact/confirmdialog';

export const DataTableArticulos = ({onOpenModalCustomArticulo, onOpenModalMovimientos, idEmpresa}) => {

  const { obtenerArticulosxEmpresa, dataView, onDeleteArticuloxID } = useArticuloStore()

  const columns = [
    { id: 'id', header: <div className='text-center'>ID</div>, accessor: 'id', sortable: true, width: 20, render: (row)=>{
      return (
        <div className='fs-4' style={{width: '80px'}}>
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
                                <Image src={row.tb_images?.length===0?'':`${imageUrl}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="150" />
        </>
      )
    } },
    { id: 'nombre', header: <div className='text-center'>NOMBRE</div>, render: (row)=>{
      return (
        <div className='fs-4' style={{width: '200px'}}>
        {row?.producto}
        </div>
      )
    } },
    { id: 'modelo', header: <div className='text-center'>MODELO</div>,  width: 100, render: (row)=>{
      return (
        <div className='fs-4' style={{width: '200px'}}>
        {row?.modelo}
        </div>
      )
    }  },
    { id: 'descripcion', header: <div className='text-center'>DESCRIPCION</div>, width: 70,render: (row)=>{
      return (
        <div className='fs-4' style={{width: '200px'}}>
        {row?.descripcion}
        </div>
      )
    } },
    { id: 'ubicacion', header: <div className='text-center'>UBICACION</div>,  width: 70, render: (row)=>{
      return (
        <div className='fs-4' style={{width: '200px'}}>
        {row?.parametro_lugar_encuentro?.label_param}
        </div>
      )
    } },
    { id: 'cantidad', header: <div className='text-center'>CANT.</div>, render: (row)=>{
      return (
        <div className='fs-4' style={{width: '10px'}}>
        {row?.cantidad}
        </div>
      )
    } },
    { id: 'costo_unitario_soles', header: <div className='text-center'>costo <br/> unit. S/.</div>, render:(row)=>{
      return (
        <div className='fs-4' style={{width: '100px'}}>
        {(row?.costo_unitario_soles)}
        </div>
      )
    }},
    { id: 'costo_unitario_dolares', header: <div className='text-center'>costo <br/> unit. $</div>, render:(row)=>{
      return (
        <div className='fs-4'>
        {(row?.costo_unitario_dolares)}
        </div>
      )
    } },
    { id: 'costo_mano_obra_soles', header: <div className='text-center'>costo <br/> MANO OBRA S/.</div>, render:(row)=>{
      return (
        <div className='fs-4'>
        {(row?.mano_obra_soles)}
        </div>
      )
    } },
    { id: 'costo_mano_obra_dolares', header: <div className='text-center'>costo <br/> MANO OBRA $</div>, render:(row)=>{
      return (
        <div className='fs-4'>
        {(row?.mano_obra_dolares)}
        </div>
      )
    } },
    { id: 'costo_total_soles', header: <div className='text-center'>costo <br/> TOTAL S/.</div>, width: 70, render:(row)=>{
      return (
        <div className='fs-4'>
        {(row?.costo_unitario_soles*row?.cantidad)+row?.mano_obra_soles}
        </div>
      )
    } },
    { id: 'costo_total_dolares', header: <div className='text-center'>costo <br/> TOTAL $</div>, width: 70,  render: (row)=>{
      return (
        <div className='fs-4'>
        {(row?.costo_unitario_dolares*row?.cantidad)+row?.mano_obra_dolares}
        </div>
      )
    }},
    { id: 'action', header: '', width: 70, render: (row)=>{
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
