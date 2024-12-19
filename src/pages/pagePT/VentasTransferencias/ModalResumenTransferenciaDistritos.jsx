import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Table } from 'react-bootstrap';

export const ModalResumenTransferenciaDistritos = ({data, show, onHide}) => {
    // console.log(data);
    
    data = data.map(d=>{
        return{
            distritoBENE: d.tb_benefeciario?.tb_cliente.distrito_cli,
            distritoTRANS: d.tb_transferencia?.tb_cliente.distrito_cli,
        }
    })
    console.log(data);
    
    let grouped = data.reduce((acc, obj) => {
        // Crear el agrupamiento basado en "distritoBENE a distritoTRANS"
  const key = `${obj.distritoTRANS} a ${obj.distritoBENE}`;

  // Buscar si ya existe un agrupamiento con esta clave
  const existingGroup = acc.find(group => group.agrupamientoDistrito === key);

  if (existingGroup) {
    // Si existe, añadir el objeto al array de items
    existingGroup.items.push(obj);
  } else {
    // Si no existe, crear un nuevo agrupamiento
    acc.push({
      agrupamientoDistrito: key,
      items: [obj],
    });
  }

  return acc;
    }, []).sort((a, b) => {
        // Extraer el distritoBENE del agrupamiento
        const distritoA = a.items[0].distritoBENE;
        const distritoB = b.items[0].distritoBENE;
      
        // Priorizar "Miraflores" sobre los demás
        if (distritoA === "Miraflores" && distritoB !== "Miraflores") return -1;
        if (distritoA !== "Miraflores" && distritoB === "Miraflores") return 1;
        return 0;
      });
    const cantidadBodyTransferencia = (rowData)=>{
        return(
            <div className='text-center fw-bold fs-3'>{rowData?.items.length}</div>
        )
    }
    const distritoBodyTemplate = (rowData)=>{
        return(
            <div className='fs-3'>{rowData.agrupamientoDistrito}</div>
        )
    }
    console.log(grouped);
    
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        header={'RESUMEN DE TRANSFERENCIAS DE DISTRITOS'}
        style={{width: '70rem', height: '80rem'}}
        >
            <Table
            className="table-centered mb-0"
            striped
            responsive
            >
                <thead className="bg-primary">
                    <tr>
                        <th className='text-white fs-4'>
                            <div style={{ maxWidth: '30rem' }}>DISTRITOS</div>
                        </th>
                        <th className='text-white'>
                            <div className='text-center font-24' style={{ width: '20rem' }}>TRANSFERENCIAS</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        grouped.map(g=>(
                            <tr>
                                <td>
                                    <div className='fs-4' style={{ width: '30rem' }}>{g.agrupamientoDistrito}</div>
                                </td>
                                <td>
                                    <div className='text-center font-24 fw-bold' style={{ width: '20rem' }}>{g.items.length}</div>
                                </td>
                            </tr>
                        ))
                    }
                    
                    <tr>
                        <td>
                            <div className='fs-2 text-primary fw-bolder' style={{ width: '30rem' }}>TOTAL</div>
                        </td>
                        <td>
                            <div className='text-center font-24 fw-bold' style={{ width: '20rem' }}>{grouped.reduce((sum, item) => sum + item.items.length, 0)-1}</div>
                        </td>
                    </tr>
                </tbody>

            </Table>

    </Dialog>
  )
}
