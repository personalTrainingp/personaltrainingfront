import React from 'react'
import CreatableSelect from 'react-select/creatable'

export const SelectOficio = ({ comboOficio, id_oficio, onInputChangeReact, onAgregarOficio }) => {
  const [inputValue, setInputValue] = React.useState('')

  const handleChange = (selectedOption) => {
    // Si el usuario selecciona la opción "crear"
    if (selectedOption.__isNew__) {
      onAgregarOficio(selectedOption.label)
    } else {
      onInputChangeReact(selectedOption, 'id_oficio')
    }
  }

  return (
    <CreatableSelect
      placeholder="Seleccione el oficio del proveedor"
      className="react-select"
      classNamePrefix="react-select"
      options={comboOficio}
      value={comboOficio.find((opt) => opt.value === id_oficio) || null}
      onChange={handleChange}
      onInputChange={(val) => setInputValue(val)}
      formatCreateLabel={(input) => `➕ Quiere agregar oficio: "${input}"`}
      noOptionsMessage={() =>
        inputValue ? `No hay resultados para "${inputValue}"` : 'Escriba para buscar o agregar'
      }
    />
  )
}
