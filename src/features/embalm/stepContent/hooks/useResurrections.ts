import { useRadioGroup } from '@chakra-ui/react';
import { minimumResurrection } from 'lib/constants';
import { convertDaysToMs, convertHoursToMs, convertMinutesToMs } from 'lib/utils/helpers';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { setResurrection, setResurrectionRadioValue } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
//import { Period } from '../components/PeriodPicker';

/**
 * Converts the static radio value to ms
 */
function convertValueToMs(value: string): number {
  const [number, period] = value.split(' ');
  return moment.duration(number, <moment.unitOfTime.DurationConstructor>period).asMilliseconds();
}

/**
 * Converts the "Other" value to ms
 */
// function convertOtherValueToMs(otherValue: Period): number {
//   const days = parseInt(otherValue.days);
//   const hours = parseInt(otherValue.hours);
//   const minutes = parseInt(otherValue.minutes);

//   return (
//     convertDaysToMs(isNaN(days) ? 0 : days) +
//     convertHoursToMs(isNaN(hours) ? 0 : hours) +
//     convertMinutesToMs(isNaN(minutes) ? 0 : minutes)
//   );
// }

/**
 * Uses the stored resurrection value (which is in ms) to initialize values for the inputs
 */
// function initializeInputValues(resurrection: number): Period {
//   const msInOneDay = 86_400_000;
//   const msInOneHour = 3_600_000;
//   const msInOneMinute = 60_000;

//   const days = Math.floor(resurrection / msInOneDay);
//   resurrection = resurrection % msInOneDay;
//   const hours = Math.floor(resurrection / msInOneHour);
//   resurrection = resurrection % msInOneHour;
//   const minutes = Math.floor(resurrection / msInOneMinute);

//   return { days: `${days} d`, hours: `${hours} h`, minutes: `${minutes} m` };
// }

/**
 * Hook for managing resurrection selection
 */
export function useResurrections() {
  const dispatch = useDispatch();
  const { resurrection, resurrectionRadioValue: radioValue } = useSelector(x => x.embalmState);

  // Although resurrection in ms is already stored in global state, we need another state to make it
  // easier to display the values in the input boxes. Resurrection and otherValue will often be
  // managed in parallel. Initialized with the resurrection value.

  //  const [otherValue, setOtherValue] = useState<Period>(initializeInputValues(resurrection));
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  function handleRadioChange(nextValue: string) {
    dispatch(setResurrectionRadioValue(nextValue));
  }

  // value and onChange are passed in to this hook instead of into a RadioGroup component.
  // This is part of creating a custom radio component
  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: '1 week',
    value: radioValue,
    onChange: handleRadioChange,
  });

  // // Handles when the value changes under the "Other" selection
  // function handleOtherDateChange(value: Period) {
  //   if (parseInt(value.days) < 0 || parseInt(value.days) > 999) return;
  //   if (parseInt(value.hours) < 0 || parseInt(value.hours) > 23) return;
  //   if (parseInt(value.minutes) < 0 || parseInt(value.minutes) > 59) return;
  //   const newResurrection = convertOtherValueToMs(value);

  //   // Sets the resurrection in ms
  //   dispatch(setResurrection(newResurrection));

  //   // Sets the values to be displayed in the input boxes
  //   setOtherValue(value);
  // }

  // // Remove the suffix on focus
  // function handleFocusDate(
  //   e: React.FocusEvent<HTMLInputElement>,
  //   period: 'days' | 'hours' | 'minutes'
  // ) {
  //   setOtherValue(prevState => ({
  //     ...prevState,
  //     [period]: /0.\w/.test(prevState[period]) ? '' : prevState[period].replace(/\D/g, ''),
  //   }));
  //   setIsFocused(true);
  // }

  // // Add the suffix back on blur
  // function handleBlurDate(
  //   e: React.FocusEvent<HTMLInputElement>,
  //   period: 'days' | 'hours' | 'minutes'
  // ) {
  //   setOtherValue(prevState => ({
  //     ...prevState,
  //     [period]: `${prevState[period].trim() !== '' ? prevState[period] : '0'} ${period.charAt(0)}`,
  //   }));
  //   setIsFocused(false);
  // }

  // Update resurrection when the "Other" value changes
  // useEffect(() => {
  //   if (radioValue === 'Other' && otherValue) {
  //     const newResurrection = convertOtherValueToMs(otherValue);
  //     dispatch(setResurrection(newResurrection));
  //   }
  // }, [dispatch, otherValue, radioValue]);

  // Update resurrection when the radio value changes
  useEffect(() => {
    if (radioValue !== 'Other') {
      const newResurrection = convertValueToMs(radioValue);
      dispatch(setResurrection(newResurrection));
    }
  }, [dispatch, radioValue]);

  // Updates the error if the resurrection time is invalid
  useEffect(() => {
    if (resurrection < minimumResurrection && resurrection > 0 && !isFocused) {
      setError(
        `Resurrection must be ${moment
          .duration(minimumResurrection)
          .humanize()} or more in the future.`
      );
    } else if (resurrection < 0) {
      // Not possible through the UI (unless someone modifies the dom) but just in case
      setError('Resurrection must not be in the past.');
    } else {
      setError(null);
    }
  }, [isFocused, resurrection]);

  return {
    error,
    getRadioProps,
    getRootProps,
    // handleBlurDate,
    // handleFocusDate,
    // handleOtherDateChange,
    // otherValue,
    radioValue,
    resurrection,
  };
}
