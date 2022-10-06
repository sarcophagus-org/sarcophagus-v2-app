/* this implmentation of react-datepicker with chakra-ui is based on this gist
  https://gist.github.com/igoro00/99e9d244677ccafbf39667c24b5b35ed
*/

import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

export function DatePicker({ ...props }: ReactDatePickerProps) {
  return (
    <div>
      <ReactDatePicker {...props} />
    </div>
  );
}
