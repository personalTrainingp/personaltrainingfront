
import React, { useEffect, useState } from 'react'
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

export const InputFile = ({label, onChange, value, nameInput, required=false, ...props}) => {
  return (
    <>
      <label className='form-label' htmlFor={nameInput} >{label} {required && (<span className='text-danger'>*</span>)} </label>
      <input
          className='form-control'
          name={nameInput}
          id={nameInput}
          onChange={onChange}
          required={required}
          type='file'
          {
              ...props
          }
      />
    </>
  )
}

export const InputDate = ({label, onChange, value, nameInput, required=false, type='date', ...props}) => {
  const formattedValue = value
    ? dayjs.utc(value).format("dddd DD [de] MMMM [del] YYYY")
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
        type={type}
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

export const InputNumber = ({label, onChange, value, nameInput, required=false, ...props}) => {
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
};



export const InputSelect = ({label, value='', placeholder='', onChange, nameInput, required, options=[], ...props})=>{
  const handleChange = (e)=>{
    const target = {
      name: nameInput,
      value: e?.value,
      optionSelect: options.find(m=>m.value===e?.value)
    }
    onChange?.({target})
  }
  return (
    <div className='w-100'>
      {
        label=== '' ? (
          <></>
        ): (
          <label className='form-label'>{label} {required && (<span className='text-danger'>*</span>)} </label>
        )
      }
      <Select
        className="react-select text-black"
        classNamePrefix="react-select"
        options={options}
        value={options.find((opt) => opt.value === value)}
        onChange={(e)=>handleChange(e)}
        name={nameInput}
        required={required}
        placeholder={placeholder}
        {...props}
      />
    </div>
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
      <Button className={`input-buton ${className}`} onClick={onClick} variant={variant} {...props}>{label}</Button>
    </>
  )
}

export const InputMoney = ({label, onChange, value, nameInput, required=false, ...props})=>{
  const [display, setDisplay] = useState("");

  // 👉 formateo con comas (sin forzar decimales)
  const format = (val) => {
    if (!val) return "";

    const [intPart, decPart] = val.split(".");

    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decPart !== undefined
      ? `${formattedInt}.${decPart}`
      : formattedInt;
  };

  // 👉 sincroniza cuando cambia desde afuera
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplay(format(value.toString()));
    } else {
      setDisplay("");
    }
  }, [value]);

  return (
    <>
      <label className="form-label" htmlFor={nameInput}>
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <input
        className="form-control"
        value={display}
        name={nameInput}
        id={nameInput}
        required={required}
        onChange={(e) => {
          let raw = e.target.value;

          // ✅ permitir solo números y un punto
          raw = raw
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");

          // ✅ actualizar visual SIN romper lo que escribe
          setDisplay(format(raw));

          // ✅ enviar valor limpio
          onChange({
            target: {
              name: nameInput,
              value: raw,
            },
          });
        }}
        onBlur={() => {
          if (!display) return;

          const num = Number(display.replace(/,/g, ""));
          if (isNaN(num)) return;

          const fixed = num.toFixed(2);

          setDisplay(format(fixed));

          onChange({
            target: {
              name: nameInput,
              value: fixed,
            },
          });
        }}
        {...props}
      />
    </>
  );
}