import React, { useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';

export const ComponenteDataViewSelect = ({options, value, onChange, name}) => {
    const [layout, setLayout] = useState('grid');  // 'grid' o 'list'
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra las opciones según el término de búsqueda. Se buscan coincidencias en label, category o price.
  const filteredOptions = options.filter(option => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (option.label && option.label.toLowerCase().includes(lowerSearch)) ||
      (option.category && option.category.toLowerCase().includes(lowerSearch)) ||
      (option.price && option.price.toString().includes(lowerSearch))
    );
  });
  // Función para renderizar cada opción en la DataView
  const itemTemplate = (option) => {
    if (!option) return null;

    // Verifica si esta opción está seleccionada comparando su valor con el prop "value"
    const isSelected = option.value === value;
    const cardStyle = {
      border: isSelected ? '2px solid #2196f3' : '1px solid #ccc',
      borderRadius: '4px',
      margin: '0.5rem',
      padding: '10px',
      cursor: 'pointer',
      boxShadow: isSelected ? '0 0 6px rgba(33, 150, 243, 0.5)' : 'none'
    };

    return (
      <div style={cardStyle} className='d-flex align-items-start w-100' onClick={() => onChange(option.value)}>
        <img
          src={option.image || 'https://via.placeholder.com/200?text=Imagen'}
          alt={option.label}
          style={{ width: 'auto', padding: '5px', height: option.width, display: 'block' }}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <h2 className='text-break' style={{ margin: '0 0 0.25rem 0' }}>{option.label}</h2>
          <h4 className='text-break' style={{ margin: '0 0 0.25rem 0' }}>{option.label2}</h4>
          {option.cantidad && <p style={{ margin: 0 }}>{option.cantidad}</p>}
          {option.price && (
            <p style={{ margin: 0, fontWeight: 'bold' }}>{option.price}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="custom-dataview">
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}
      >
        <span className="p-input-icon-left" style={{ marginLeft: '1rem' }}>
          {/* <i className="pi pi-search" /> */}
          <InputText
            name={name}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscador"
          />
        </span>
      </div>

      <DataView
        value={filteredOptions}
        layout={layout}
        itemTemplate={itemTemplate}
        className='bg-danger'
        paginator
        rows={1}
      />
    </div>
  );
}
