import { ScrollPanel } from 'primereact/scrollpanel'
import React, { useState } from 'react'

export const SidePanelClientes = ({dataCliente,handleDragStart}) => {
    const [busqueda, setBusqueda] = useState('');

    // Filtra los clientes según el texto ingresado en el input
    const clientesFiltrados = dataCliente.filter(eventTitle =>
      eventTitle.label.toLowerCase().includes(busqueda.toLowerCase())
    );
  return (
    <>
    <p>
        <strong>SOCIOS</strong>
      </p>
      <input
        className="form-control"
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ScrollPanel style={{ width: '100%', height: '80vh' }}>
        <div style={{ marginBottom: '20px' }}>
          {clientesFiltrados.map((eventTitle, index) => (
            <div
              key={index}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, eventTitle)}
              style={{
                backgroundColor: '#3174ad',
                color: 'white',
                margin: '10px 0',
                padding: '10px',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              {eventTitle.label}
            </div>
          ))}
        </div>
      </ScrollPanel>
    </>
  )
}
