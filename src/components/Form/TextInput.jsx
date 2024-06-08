import { Form } from 'react-bootstrap';
import { Controller, useFormContext } from "react-hook-form";

export default function TextInput({
  name,
  id,
  className,
  containerClass,
  label,
  placeholder,
  helpText,
  errors,
  register,
  type,
  onChange,
  value,
  ...props
}) {

  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Group className={containerClass ?? ''}>
          {label && <Form.Label>{label}</Form.Label>}
          <Form.Control
            id={id}
            type={type}
            
            {...props}
            {...field}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            isInvalid={Boolean(fieldState.error?.message)}
          />
          {helpText && (
            <Form.Text id={`${name}-help`} muted>
              {helpText}
            </Form.Text>
          )}
          {errors && errors[name] && (
            <Form.Control.Feedback type="invalid">
              {errors[name]['message']}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}
    />
  );
}
