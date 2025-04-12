import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
export const ComponentSelect = ({options, postOptions, onChange, value}) => {
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // useEffect(() => {
  //   // Cargar opciones existentes de la BD
  //   axios.get('/api/opciones') // Cambia esto según tu endpoint
  //     .then(res => {
  //       const datos = res.data.map(op => ({
  //         label: op.nombre,
  //         value: op.id,
  //       }));
  //       setOpciones(datos);
  //     });
  // }, []);

  // const handleCreate = (input) => {
  //   // Guardar nueva opción en la BD
  //   const nueva = { nombre: input };

  //   axios.post('/api/opciones', nueva) // Cambia a tu endpoint
  //     .then(res => {
  //       const nuevaOpcion = {
  //         label: res.data.nombre,
  //         value: res.data.id,
  //       };
  //       const nuevasOpciones = [...opciones, nuevaOpcion];
  //       setOpciones(nuevasOpciones);
  //       setSeleccionadas([...seleccionadas, nuevaOpcion]);
  //     });
  // };
  const onInputValue = (val)=>{
    setInputValue(val)
  }
  console.log({inputValue}, "inpu vall");
  
  return (
    <CreatableSelect
      isMulti
      value={value}
      onChange={onChange}
      onInputChange={(value) => onInputValue(value)}
      options={options}
      onCreateOption={postOptions}
      placeholder="Buscar o agregar..."
  // filterOption={() => false} // <-- fuerza que nunca haya coincidencias
      // noOptionsMessage={() =>
      //   inputValue ? (
      //     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      //       <span>No encontrado</span>
      //       <button
      //         style={{
      //           marginLeft: '1rem',
      //           cursor: 'pointer',
      //           background: '#007bff',
      //           color: 'white',
      //           border: 'none',
      //           padding: '2px 8px',
      //           borderRadius: '4px',
      //         }}
      //         onMouseDown={(e) => {
      //           e.preventDefault(); // Evita que react-select cierre el menú
      //           postOptions(inputValue);
      //         }}
      //       >
      //         Agregar opción: "{inputValue}"
      //       </button>
      //     </div>
      //   ) : 'Escribe para buscar o crear'
      // }
    />
  );
}
