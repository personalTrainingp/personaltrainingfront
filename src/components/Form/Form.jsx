import { yupResolver } from '@hookform/resolvers/yup';
import { Form as BSForm } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';

const Form = ({
  schema,
  onSubmit,
  children,
  defaultValues,
  ...props
}) => {
  const methods = useForm({
    ...(schema != null ? { resolver: yupResolver(schema) } : {}),
    defaultValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <BSForm onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children}
      </BSForm>
    </FormProvider >
  );
};

export default Form;
