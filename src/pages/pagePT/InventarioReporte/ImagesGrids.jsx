import config from '@/config';
import React from 'react'

export const ImagesGrids = ({images}) => {
  
  const getGridStyles = () => {
    if (images?.length === 1) {
      return { gridTemplateColumns: "1fr", gridTemplateRows: "260px" };
    }
    if (images?.length === 2) {
      return { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "260px" };
    }
    if (images?.length === 3) {
      return { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto 260px" };
    }
    if (images?.length >= 4) {
      return { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 260px" };
    }
  };
  const gridStyles = {
    1: "grid-cols-1 grid-rows-1", // Una sola imagen ocupa todo el div
    2: "grid-cols-2 grid-rows-1", // Dos imágenes en dos columnas
    3: "grid-cols-2 grid-rows-2", // Dos arriba, una centrada abajo
    4: "grid-cols-2 grid-rows-2", // Cuatro en una cuadrícula 2x2
  };

  const layoutClass = gridStyles[images?.length] || "grid-cols-2 grid-rows-2"; // Manejo de casos extra
  // const srcImg = `${config.API_IMG.ARTICULO_LUGAR}${}`
  return (
    <div
      className="grid gap-2 w-full h-full"
      style={{
        display: "grid",
        width: "100%",
        height: "100%",
        gap: "8px",
        ...getGridStyles(),
      }}
    >
      {images?.map((img, index) => (
        <img
          key={index}
          src={`${config.API_IMG.ARTICULO_LUGAR}${img?.name_image}`}
          alt={`Imagen ${index}`}
          className="w-full h-full object-cover"
          style={{
            gridColumn: images.length === 3 && index === 2 ? "span 2" : "auto",
            // width: '30%',
            // height: '0%',
          }}
        />
      ))}
    </div>
  )
}
