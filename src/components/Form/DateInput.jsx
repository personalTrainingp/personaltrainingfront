import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

export default function DateInput({
  name,
  id,
  control,
  className,
  containerClass,
  label,
  placeholder,
  helpText,
  readOnly,
  errors,
  register,
  type,
  onChange,
  value,
  ...props
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Group className={containerClass ?? ''}>
          {label && <Form.Label>{label}</Form.Label>}
          <Form.Control
            type={type}
            id={id}
            {...props}
            {...field}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
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
