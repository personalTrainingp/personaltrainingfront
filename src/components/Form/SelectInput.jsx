import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

const SelectInput = ({
  name,
  type = 'select',
  id,
  className,
  containerClass,
  label,
  placeholder,
  helpText,
  children,
  multiple,
  errors,
  control,
  register,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Group className={containerClass ?? ''}>
          {label && <Form.Label>{label}</Form.Label>}
          <Form.Select
            multiple={multiple}
            id={id}
            {...props}
            {...field}
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            placeholder={placeholder}
            className={className}
            isInvalid={Boolean(fieldState.error?.message)}
          >
            {children}
          </Form.Select>
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
};

export default SelectInput;
