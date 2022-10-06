import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

export function DatePicker({ ...props }: ReactDatePickerProps) {
  return (
    <div className="dark-theme">
      <ReactDatePicker {...props} />
    </div>
  );
}
