import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image'
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import config from '@/config';
import { useContratosDeClientes } from './useContratosDeClientes';
import { Loading } from '@/components/Loading';

export const ModalPhotoCli = ({show, onHide, id_cli, uidAvtr}) => {
    const [isActiveChangeFoto, setisActiveChangeFoto] = useState({})
    const fileInputRef = useRef(null);
    const { postAvatarImagesCliente, isLoading, obtenerAvataresxUidCli, dataAvataresxUID } = useContratosDeClientes()
    const [blobString, setBlobString] = useState("");
    useEffect(() => {
        obtenerAvataresxUidCli(uidAvtr)
    }, [show, dataAvataresxUID])
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    
    const onOpenModalPhotoCli = ()=>{
        postAvatarImagesCliente(isActiveChangeFoto, uidAvtr)
        onHide()
        onCloseModalPhotoCli()
    }
    const onCloseModalPhotoCli = ()=>{
        setisActiveChangeFoto({});
        setBlobString('')
    }
    const onHideModalPhotoCli = ()=>{
        onCloseModalPhotoCli()
        onHide()
    }
    
    const onUpload = (d) => {
        const file = d.target.files[0]; // Obtener el archivo seleccionado
        setisActiveChangeFoto(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setBlobString(e.target.result); // Guarda el string del archivo
            };
            reader.readAsDataURL(file); // Convierte el archivo a una string en formato base64
          }
    };
    // console.log({images_cli: images_cli[images_cli.length - 1].name_image});
    const strImage = `${config.API_IMG.AVATAR_CLI}${dataAvataresxUID}`
    const imagePrime2 = blobString?blobString: (dataAvataresxUID?strImage:sinAvatar)
  return (
    <>
    {/* {
        !isLoading?
        (
            <Loading show={isLoading}/>
        )
        :(
        )
    } */}
    
    <Dialog visible={show} onHide={onHideModalPhotoCli} header={'AGREGAR FOTO'}>
                <div className='d-flex justify-content-center flex-column'>
                    <div className='m-auto'>
                        <Image src={imagePrime2} width='320' height='350'/>
                    </div>
                    <br/>
                    {
                        isActiveChangeFoto.name?(
                            <div className='m-auto'>
                                <Button label='ACEPTAR'  onClick={onOpenModalPhotoCli} icon="pi pi-check" size='large' className='mx-2 border-success text-success' rounded outlined aria-label="Filter" />
                                <Button label='CANCELAR' onClick={onCloseModalPhotoCli} icon="pi pi-times" size='large' className='mx-2' severity="success" rounded aria-label="Cancel" />
                            </div>
                        ):(
                            <>
                            {/* <FileUpload mode="basic" onChnage name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
                                {/* <Button label='AGREGAR' type='file' onChange={onUpload}/> */}
                                    <Button label={'AGREGAR'} onClick={handleButtonClick}/>
                                        <input type='file' ref={fileInputRef} className='btn btn-primary d-none' onChange={onUpload}/>
                            </>
                        )
                    }
                </div>
            </Dialog>
    </>
  )
}
