import React, { useState } from 'react';
import Select, { components } from 'react-select';

// Componente para mostrar mensaje personalizado si no hay opciones
const NoOptionsMessage = (props) => {
  const {
    selectProps: { inputValue, postOptions },
  } = props;

  return (
    <components.NoOptionsMessage {...props}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <span>No hay opciones</span>
        {inputValue && (
          <button
            type="button"
            onClick={() => postOptions(inputValue)}
            style={{
              marginTop: '5px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Agregar "{inputValue}"
          </button>
        )}
      </div>
    </components.NoOptionsMessage>
  );
};

export const MultiOpcionSelect = ({ options, postOptions, onChange, value }) => {
  return (
    <Select
      isMulti
      options={options}
      onChange={onChange}
      value={value}
      components={{ NoOptionsMessage }}
      placeholder="Selecciona o escribe para agregar..."
      isClearable={false}
      filterOption={(candidate, input) =>
        candidate.label.toLowerCase().includes(input.toLowerCase())
      }
      postOptions={postOptions} // Asegúrate de que esta función esté definida en el componente padre
    />
  );
};
