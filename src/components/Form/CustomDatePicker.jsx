import React, { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import 'dayjs/locale/es'; // Importa la localización en español
import 'react-datepicker/dist/react-datepicker.min.css';
// import dayjs, { locale } from 'dayjs';
import { Calendar } from 'primereact/calendar';
import { locale } from 'primereact/api';

locale('es'); // Establece el idioma español en dayjs
/* Datepicker with Input */
const DatepickerInput = forwardRef((props, ref) => {
  const onDateValueChange = () => {
    console.log('date value changed');
  };
  return (
    <input
      type="text"
      className="form-control date"
      onClick={props.onClick}
      value={props.value}
      onChange={onDateValueChange}
      ref={ref}
    />
  );
});

/* Datepicker with Addon Input */
const DatepickerInputWithAddon = forwardRef(
  (props, ref) => (
    <div className="input-group" ref={ref}>
      <input
        type="text"
        className="form-control form-control-light"
        onClick={props.onClick}
        value={props.value}
        readOnly
      />
      <div className="input-group-append">
        <span className="input-group-text bg-primary border-primary text-white">
          <i className="mdi mdi-calendar-range font-13"></i>
        </span>
      </div>
    </div>
  )
);

const CustomDatePicker = (props) => {
  // handle custom input
  const input =
    (props.hideAddon || false) === true ? (
      <DatepickerInput
        inputClass={props.inputClass ?? ''}
        value={props.value?.toDateString()}
      />
    ) : (
      <DatepickerInputWithAddon
        inputClass={props.inputClass ?? ''}
        value={props.value.toDateString()}
      />
    );
    
    const [date, setDate] = useState(null);

  return (
    <>
      {/* date picker control */}
      <Calendar locale='es' style={{width: '100%', fontSize: '50px'}} value={date} onChange={(e) => setDate(e.value)} inline />
      {/* <DatePicker
        locale="es-ES"
        customInput={input}
        timeIntervals={props.tI}
        className={classNames('form-control', props.inputClass)}
        selected={props.value}
        onChange={(date) => props.onChange(date)}
        showTimeSelect={props.showTimeSelect}
        timeFormat={props.timeFormat || 'hh:mm a'}
        timeCaption={props.timeCaption}
        dateFormat={props.dateFormat || 'MM/dd/yyyy'}
        minDate={props.minDate}
        maxDate={props.maxDate}
        monthsShown={props.monthsShown}
        showTimeSelectOnly={props.showTimeSelectOnly}
        inline={props.inline}
        autoComplete="off"
      /> */}
    </>
  );
};

export default CustomDatePicker;
