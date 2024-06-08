import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';


export default function FileInput({
  type = 'file',
  name,
  id,
  control,
  className,
  containerClass,
  label,
  helpText,
  errors,
  register,
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
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
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
