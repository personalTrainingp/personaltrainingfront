import React from 'react'
import { urlArchivo, esImagen } from './useActas'

const iconoArchivo = (ext = '') => {
  const e = String(ext).toLowerCase()
  if (e === '.pdf') return 'pi pi-file-pdf text-danger'
  if (['.xls', '.xlsx'].includes(e)) return 'pi pi-file-excel text-success'
  if (['.doc', '.docx'].includes(e)) return 'pi pi-file-word text-primary'
  return 'pi pi-file'
}

// miniaturas / iconos de los archivos del acta; con onEliminar muestra una x en cada uno
export const ArchivosActa = ({ archivos = [], onEliminar = null, size = 44 }) => {
  if (!archivos.length) return <span className='text-muted'>—</span>
  return (
    <div className='d-flex flex-wrap gap-2'>
      {archivos.map((img) => (
        <div key={img.id} className='position-relative'>
          <a href={urlArchivo(img)} target='_blank' rel='noreferrer' title={img.name_image}>
            {esImagen(img.extension_image)
              ? <img src={urlArchivo(img)} alt={img.name_image} className='border rounded' style={{ width: size, height: size, objectFit: 'cover' }} />
              : (
                <span className='border rounded d-inline-flex align-items-center justify-content-center bg-light' style={{ width: size, height: size }}>
                  <i className={iconoArchivo(img.extension_image)} style={{ fontSize: size * 0.5 }}></i>
                </span>
              )}
          </a>
          {onEliminar && (
            <button
              type='button'
              className='btn btn-danger btn-sm rounded-circle p-0 position-absolute d-flex align-items-center justify-content-center'
              style={{ width: 20, height: 20, top: -8, right: -8 }}
              title='Eliminar archivo'
              onClick={() => onEliminar(img)}
            >
              <i className='pi pi-times' style={{ fontSize: 10 }}></i>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
