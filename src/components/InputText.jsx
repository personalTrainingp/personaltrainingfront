
import React, { useState } from 'react'
import { Button, FormCheck } from 'react-bootstrap'
import Select from 'react-select'
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);
dayjs.locale("es");

export const InputText = ({label, onChange, value, nameInput, required=false, ...props}) => {
  return (
    <>
      <label className='form-label' htmlFor={nameInput} >{label} {required && (<span className='text-danger'>*</span>)} </label>
      <input
          className='form-control'
          value={value}
          name={nameInput}
          id={nameInput}
          onChange={onChange}
          required={required}
          {
              ...props
          }
      />
    </>
  )
}

export const InputDate = ({label, onChange, value, nameInput, required=false, ...props}) => {
  const formattedValue = value
    ? dayjs(value).format("dddd DD [de] MMMM [del] YYYY")
    : "";

  return (
    <>
      <label className="form-label" htmlFor={nameInput}>
        {label} {required && <span className="text-danger">*</span>} {formattedValue}
      </label>
      
      <input
        className="form-control"
        value={value}
        name={nameInput}
        id={nameInput}
        onChange={onChange}
        required={required}
        type='date'
        {...props}
      />
    </>
  );
}


export const InputTextArea = ({label, onChange, value, nameInput, required=false, ...props}) => {
  return (
    <>
      <label className='form-label' htmlFor={nameInput} >{label} {required && (<span className='text-danger'>*</span>)} </label>
      <textarea
          className='form-control'
          value={value}
          name={nameInput}
          id={nameInput}
          onChange={onChange}
          required={required}
          {
              ...props
          }
      />
    </>
  )
}

export const InputNumber = ({ label, value = "", onChange, nameInput, required, ...props }) => {
  const [displayValue, setDisplayValue] = useState(formatNumber(value))

  function formatNumber(val) {
    if (val === "" || val === null || val === undefined) return ""
    const parts = val.toString().replace(/,/g, "").split(".")
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt
  }

  const handleChange = (e) => {
    const raw = e.target.value.replace(/,/g, "")
    if (!/^\d*\.?\d*$/.test(raw)) return // solo números y punto
    setDisplayValue(formatNumber(raw))
    onChange?.(raw) // 🔹 ahora devuelve el valor limpio directamente
  }

  return (
    <>
      <label className="form-label">{label} {required && (<span className='text-danger'>*</span>)}</label>
      <input
        type="text"
        className="form-control"
        value={displayValue}
        name={nameInput}
        onChange={handleChange}
        required={required}
        {...props}
      />
    </>
  )
};

export const InputSelect = ({label, value='', onChange, nameInput, required, options=[], ...props})=>{
  const handleChange = (e)=>{
    const target = {
      name: nameInput,
      value: e?.value,
      optionSelect: options.find(m=>m.value===e?.value)
    }
    onChange?.({target})
  }
  return (
    <>
      <label className='form-label'>{label} {required && (<span className='text-danger'>*</span>)} </label>
      <Select
        className="react-select"
        classNamePrefix="react-select"
        options={options}
        value={options.find((opt) => opt.value === value)}
        onChange={(e)=>handleChange(e)}
        name={nameInput}
        required={required}
        {...props}
      />
    </>
  )
}
export const InputSwitch = ({label, value=false, onChange, nameInput, required, options=[], ...props})=>{
    const handleChange = (e) => {
    // FormCheck usa checked, no value
    const target = {
      name: nameInput,
      value: !value
    };
    onChange?.({target}); // te paso el boolean directo
  };
  return (
    <>
      <label className='form-label'>{label} {required && (<span className='text-danger'>*</span>)}</label>
      <FormCheck
        type='switch'
        style={{fontSize: '20px'}}
        checked={value}
        onChange={handleChange}
        required={required}
      />
    </>
  )
}

export const InputButton = ({label, variant, className, onClick, ...props})=>{
  return (
    <>
      <Button className={`${className}`} onClick={onClick} variant={variant} {...props}>{label}</Button>
    </>
  )
}