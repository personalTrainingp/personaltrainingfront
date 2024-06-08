import { useState } from 'react';
import * as yup from 'yup';

export default function useAddEditEvent(
  eventData,
  isEditable,
  onUpdateEvent,
  onAddEvent
) {
  // event state
  const [event] = useState({
    title: eventData?.title || '',
    className: eventData?.className || '',
  });

  // /*
  //  * form validation schema
  //  */
  const schema = yup.object().shape({
    title: yup.string().required('Please enter event name'),
    className: yup.string().required('Please select category'),
  });

  /*
   * handle form submission
   */
  const onSubmitEvent = (data) => {
    isEditable ? onUpdateEvent(data) : onAddEvent(data);
  };

  return {
    event,
    schema,
    onSubmitEvent,
  };
}
