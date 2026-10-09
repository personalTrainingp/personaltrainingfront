import React, { useState } from 'react'

// Campo para cambiar un monto SOLO en la vista (slice IMAGINARIA_FLUJO_CAJA.montosEditados).
// Se guarda en el localStorage de esta PC; nunca se envía a la base de datos.
// Se abre con doble click en la celda cuando el modo "Editar montos" está activo.
export const MontoVistaEditable = ({ monto = 0, onGuardar, onRestablecer, onCerrar }) => {
  const [valor, setvalor] = useState(String(Number(monto) || 0))
  const [cerrado, setcerrado] = useState(false)

  const guardar = () => {
    if (cerrado) return
    setcerrado(true)
    const texto = String(valor).trim()
    if (texto === '') onRestablecer()
    else {
      const numero = Number(texto.replace(',', '.'))
      if (Number.isFinite(numero)) onGuardar(numero)
    }
    onCerrar()
  }

  return (
    <input
      type="number"
      step="0.01"
      autoFocus
      value={valor}
      onChange={(e) => setvalor(e.target.value)}
      onBlur={guardar}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') { setcerrado(true); onCerrar() }
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className="form-control form-control-sm text-center p-0"
      style={{ fontSize: '14px', width: '120px', margin: '0 auto' }}
      title="Enter para aplicar, Esc para cancelar, vacío para volver al monto original"
    />
  )
}
