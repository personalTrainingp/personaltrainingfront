import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

// Pantalla negra completa para reproducir un video dentro del sistema.
// Se cierra con la X, con Escape o haciendo click fuera del video.
export const VisorVideo = ({ video, onClose }) => {
  useEffect(() => {
    if (!video) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflowPrevio
    }
  }, [video, onClose])

  if (!video) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className='d-flex align-items-center justify-content-between w-100 text-white'
        style={{ position: 'absolute', top: 0, left: 0, padding: '12px 16px', gap: 12 }}
      >
        <span className='text-truncate'>{video.titulo}</span>
        <button
          type='button'
          aria-label='Cerrar'
          onClick={onClose}
          className='btn btn-link text-white p-0'
          style={{ fontSize: '1.6rem', lineHeight: 1 }}
        >
          <i className='pi pi-times' style={{ fontSize: '1.4rem' }}></i>
        </button>
      </div>
      <video
        key={video.src}
        src={video.src}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 80px)', outline: 'none' }}
      />
    </div>,
    document.body
  )
}
