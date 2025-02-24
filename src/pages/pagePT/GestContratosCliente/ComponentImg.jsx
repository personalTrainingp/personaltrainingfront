import { onSetCadenaBLOB, onSetFileBLOB } from "@/store";
import { Image } from "primereact/image";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

export const ComponentImg = ({width, height, imgDefault}) => {
    const [image, setImage] = useState(imgDefault);
    const [objFile, setobjFile] = useState({})
    const fileInputRef = useRef(null);
  
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      
      for (let item of items) {
        if (item.type.startsWith("image")) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => setImage(e.target.result);
          reader.readAsDataURL(file);
          setobjFile(file);
        }
      }
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
        setobjFile(file);
      }
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
      }
      setobjFile(event.target.files[0])
    };
  
    useEffect(() => {
      window.addEventListener("paste", handlePaste);
      return () => window.removeEventListener("paste", handlePaste);
    }, []);
    const dispatch = useDispatch()
    useEffect(()=>{
      dispatch(onSetFileBLOB(objFile))
    }, [image])
    return (
      <div
        className="border-2 border-dashed border-primary text-center align-items-center p-2 text-primary fw-bold fs-3 flex items-center justify-center cursor-pointer"
        // style={{ width: width, height: height }}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {image ? (
          <Image src={image} 
          style={{objectFit: 'cover'}}
          width="auto"
          height="700"
          // width={width} height={heigth} 
          alt="CARGAR FOTO" 
          // className="w-full h-full object-cover" 
          />
        ) : (
          <p>Pega, arrastra o haz clic para subir imagen</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    );
}

