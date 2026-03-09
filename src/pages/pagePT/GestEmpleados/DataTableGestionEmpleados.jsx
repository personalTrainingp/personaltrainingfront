import React, { useEffect } from 'react'
import { useEmpleadosStore } from './useEmpleadosStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useSelector } from 'react-redux'
import { arrayCargoEmpl } from '@/types/type';
import { Image } from 'primereact/image';
import config from '@/config';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { Link } from 'react-router-dom';

    const toMailto = (value, subject = "", body = "") => {
  // extrae el correo aunque venga como "Nombre <correo@dom.com>"
  const match = String(value).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
  if (!match) return null;
  const email = match[0];
  const qs = `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${email}${qs}`;
};
export const DataTableGestionEmpleados = ({id_empresa, id_estado}) => {
    const { obtenerEmpleadosxidempresaxEstado, obtenerDocumentosDeEmpleados, dataDocumentosInternosEmpl, dataParientes, obtenerParientesEmpleados, } = useEmpleadosStore()
    const { dataView } = useSelector(e=>e.COLABORADORES)
    useEffect(() => {
        obtenerEmpleadosxidempresaxEstado(id_empresa, id_estado)
        obtenerDocumentosDeEmpleados()
        obtenerParientesEmpleados()
    }, [id_empresa, id_estado])
    const columns = [
        {id: 0, header: '', render:(rowData, i)=>{
        return(
            <div className=''>
                {i+1}
            </div>
        )
        }},
        {id: 1, header: '', render:(rowData)=>{
            const imgsSort = [...(rowData.tb_images || [])]?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
        return(
            <div className=''>
                <Image className='rounded-circle' 
                indicatorIcon={<i className="pi pi-search"></i>} 
                alt="Image" preview width="100" 
                src={imgsSort?.length==0?sinAvatar:`${config.API_IMG.AVATAR_EMPL}${imgsSort[0]?.name_image}`}></Image>
            </div>
        )
        }},
        {id: 2, header: 'nombres y apellidos', render:(rowData)=>{
            const cargoLabel = arrayCargoEmpl.find(f=>f?.value===Number(rowData?.cargo_empl))?.label
            return (
                <>
                <div className="fw-bold text-primary" style={{fontSize: '20px'}}>
                    {cargoLabel && (
                        cargoLabel==='ASESOR FINANCIERO Y COMERCIAL'?(
                            <>
                            ASESOR FINANCIERO
                            <br/>
                            COMERCIAL
                            </>
                        ):(
                            <>
                            {cargoLabel.split('/')[0]}
                            <br/>
                            {cargoLabel.split('/')[1]}
                            </>
                        )
                    )
                    }
                </div>
                <span className='text-primary fs-2 fw-bold'>{(`${rowData.nombre_empl.split(' ')[0]} `)} </span>
                {
                    rowData.nombre_empl.split(' ')[1] && (<br/>)
                }
                <span className=''>{(`${rowData.nombre_empl.split(' ')[1] || ''} `)} {(`${rowData.nombre_empl.split(' ')[2] || ''} `)} </span>
                <br/>
                <span>{(`${rowData.apPaterno_empl} `)} </span>
                <span>{(`${rowData.apMaterno_empl} `)}</span>
                </>
            )
        }},
        {id: 3, header: 'celular', render:(rowData)=>{
        const waTel = `https://wa.me/${rowData.telefono_empl}`
            return (
                <div className="flex align-items-center fw-bold" style={{fontSize: '22px'}}>
                    <a className='' href={waTel} target='_blank'>
                        <span>{(rowData.telefono_empl?`${rowData.telefono_empl}`.replace(/ /g, "").match(/.{1,3}/g).join(' '):'')}</span>
                    </a>
                </div>
            );
        }},
        {id: 4, header: 'email', render:(rowData)=>{
            const urlMail =`mailto:${rowData.email_empl}`
            const urlMailCorp =`mailto:${rowData?.email_corporativo}`
            // window.location.href = urlMail;
            return (
                <div>
                    <a href={toMailto(urlMail)} style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-2  fw-bold ${rowData.email_empl?.length===0?'text-change':'text-ISESAC'}`}>
                        {rowData.email_empl?.length===0?'NO':'SI'}
                    </a>
                </div>
            );
        }},
        {id: 5, header: 'CORP', render:(rowData)=>{
            const urlMail =`mailto:${rowData.email_empl}`
            const urlMailCorp =`mailto:${rowData?.email_corporativo}`
            // window.location.href = urlMail;
            return (
                <div>
                    <a href={toMailto(urlMailCorp)} style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-2  fw-bold ${rowData.email_corporativo?.length===0?'text-change':'text-ISESAC'}`}>
                        {rowData.email_corporativo?.length===0?'NO':'SI'}
                    </a>
                </div>
            );
        }},
        {id: 6, header: (<>CONTACTO <br/> EMERGENCIA</>), render:(rowData)=>{
            
        const dataPariente = dataParientes.filter(d=>d.uid_location===rowData.uid_contactsEmergencia)
        return (
            <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${dataPariente.length>0?'text-ISESAC':'text-change'}`}>
                {dataPariente.length>0?'SI':'NO'}
            </div>
        );
        }},
        {id: 7, header: (<>DNI</>), render:(rowData)=>{
        const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData.tb_images[0]?.uid_location)
        const dnis =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1518)
        return (
            <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-6  fw-bold ${dnis.length>0?'text-ISESAC':'text-change'}`}>
                {dnis.length>0?'SI':'NO'}

            </div>
        );
        }},
        {id: 8, header: (<>CV</>), render:(rowData)=>{
            const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData?.tb_images[0]?.uid_location)
            const cvs =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1519)
            return (
                <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${cvs.length>0?'text-ISESAC':'text-change'}`}>
                    {cvs.length>0?'SI':'NO'}

                </div>
            );
        }},
        {id: 9, header: (<>CONTRATO</>), render:(rowData)=>{
            const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData?.tb_images[0]?.uid_location)
            const cvs =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1540)
            return (
                <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${cvs.length>0?'text-ISESAC':'text-change'}`}>
                    {cvs.length>0?'SI':'NO'}

                </div>
            );
        }},
        {id: 10, header: (<>M.O.F</>), render:(rowData)=>{
            const dataDocsInternos = dataDocumentosInternosEmpl.filter(e=>e.uid_location===rowData?.tb_images[0]?.uid_location)
            const cvs =dataDocsInternos.filter(doc=>doc.id_tipo_doc===1562)
            return (
                <div style={{fontSize: '20px'}} className={`flex align-items-center gap-2 ml-7  fw-bold ${cvs.length>0?'text-ISESAC':'text-change'}`}>
                    {cvs.length>0?'SI':'NO'}

                </div>
            );
        }},
        {id: 11, header: (<></>), render:(rowData)=>{
            return (
                        <Link to={`/perfil-colaborador/${rowData.uid}`} className="action-icon text-primary fw-bold" style={{fontSize: '20px', textDecoration: 'underline'}}>
                            Ver Perfil
                        </Link>
            );
        }},
    ]
  return (
    <div>
        <DataTableCR
            data={dataView}
            columns={columns}
        />
    </div>
  )
}
