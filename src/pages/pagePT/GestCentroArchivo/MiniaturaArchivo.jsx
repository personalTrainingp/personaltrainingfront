import React, { useEffect, useRef, useState } from 'react'
import { PTApi } from '@/common'
import config from '@/config'

const ANCHO = 140
const ALTO = 180
const ESPERA_MS = 30000
const EXT_IMAGEN = ['.png', '.jpg', '.jpeg', '.gif', '.webp']

const extension = (nombre = '') => (nombre.includes('.') ? nombre.slice(nombre.lastIndexOf('.')).toLowerCase() : '')

// El contenedor de Azure no permite leer el archivo desde el navegador (CORS): se pide por el backend
const obtenerPdf = async (nombre, signal) => {
  const { data } = await PTApi.get(`/storage/blob/view/${encodeURIComponent(nombre)}`, {
    params: { containerName: 'docs-general' },
    responseType: 'blob',
    timeout: ESPERA_MS,
    signal,
  })
  const cabecera = await data.slice(0, 1024).text()
  if (!cabecera.includes('%PDF')) throw new Error('El archivo no es un PDF')
  return new Blob([data], { type: 'application/pdf' })
}

const Icono = ({ icono, texto, className = 'text-muted' }) => (
  <div className={`h-100 d-flex flex-column align-items-center justify-content-center ${className}`}>
    <i className={`pi ${icono}`} style={{ fontSize: 48 }}></i>
    <small className='fw-bold mt-2'>{texto}</small>
  </div>
)

const SinPdf = () => (
  <div className='h-100 d-flex flex-column align-items-center justify-content-center text-muted'>
    <span className='position-relative'>
      <i className='pi pi-file-pdf' style={{ fontSize: 48, opacity: 0.4 }}></i>
      <i className='pi pi-times-circle text-danger position-absolute bg-white rounded-circle' style={{ fontSize: 20, right: -8, bottom: -4 }}></i>
    </span>
    <small className='fw-bold mt-2'>SIN PDF</small>
  </div>
)

// Vista previa del archivo; clic = descargar. Se carga recien cuando la fila se ve en pantalla.
export const MiniaturaArchivo = ({ nombre, titulo, onClick, onSinPdf }) => {
  const refCaja = useRef(null)
  const [url, seturl] = useState(null)
  const [error, seterror] = useState(null)
  const ext = extension(nombre)
  const esImagen = EXT_IMAGEN.includes(ext)
  const esPdf = ext === '.pdf'
  // moviles y navegadores sin visor de PDF integrado
  const tieneVisor = navigator.pdfViewerEnabled !== false

  useEffect(() => {
    seturl(null)
    seterror(null)
    if (!nombre || !esPdf || !tieneVisor) return
    const control = new AbortController()
    let urlBlob = null
    const observador = new IntersectionObserver(async ([entrada]) => {
      if (!entrada.isIntersecting) return
      observador.disconnect()
      try {
        const pdf = await obtenerPdf(nombre, control.signal)
        if (control.signal.aborted) return
        urlBlob = URL.createObjectURL(pdf)
        seturl(urlBlob)
      } catch (err) {
        if (control.signal.aborted) return
        console.log(err)
        // 404 o contenido que no es PDF = no hay documento; el resto es falla de carga
        const noExiste = err.response ? err.response.status === 404 : !err.isAxiosError
        seterror(noExiste ? 'sinPdf' : 'carga')
        if (noExiste) onSinPdf?.(nombre)
      }
    })
    observador.observe(refCaja.current)
    return () => {
      control.abort()
      observador.disconnect()
      if (urlBlob) URL.revokeObjectURL(urlBlob)
    }
  }, [nombre, esPdf, tieneVisor])

  const sinArchivo = !nombre || error === 'sinPdf'

  const contenido = () => {
    if (sinArchivo) return <SinPdf />
    if (esImagen) {
      return (
        <img
          src={`${config.API_IMG.DOC_GENERAL}${encodeURIComponent(nombre)}`}
          alt={titulo ?? nombre}
          loading='lazy'
          onError={() => { seterror('sinPdf'); onSinPdf?.(nombre) }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )
    }
    if (!esPdf) return <Icono icono={ext.startsWith('.doc') ? 'pi-file-word' : 'pi-file'} texto={ext.slice(1).toUpperCase() || 'ARCHIVO'} className='text-primary' />
    if (error || !tieneVisor) return <Icono icono='pi-file-pdf' texto='SIN VISTA PREVIA' />
    if (!url) return <Icono icono='pi-spin pi-spinner' texto='CARGANDO' />
    return (
      // pointerEvents none: es solo una vista, el clic lo recibe la caja
      <iframe
        src={`${url}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title={`Vista previa: ${titulo ?? nombre}`}
        tabIndex={-1}
        scrolling='no'
        style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
      />
    )
  }

  return (
    <div
      ref={refCaja}
      className={`border rounded bg-white overflow-hidden ${sinArchivo ? '' : 'cursor-pointer'}`}
      style={{ width: ANCHO, height: ALTO }}
      title={sinArchivo ? 'Sin PDF' : `Descargar: ${titulo ?? nombre}`}
      onClick={sinArchivo ? undefined : onClick}
    >
      {contenido()}
    </div>
  )
}
