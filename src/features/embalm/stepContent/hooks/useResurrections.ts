import { useRadioGroup } from '@chakra-ui/react';
import { minimumResurrection } from 'lib/constants';
import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
import {
  setResurrection,
  setResurrectionRadioValue,
  setCustomResurrectionDate,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

/**
 * Hook for managing resurrection selection
 */
export function useResurrections() {
  const dispatch = useDispatch();
  const {
    resurrection,
    resurrectionRadioValue: radioValue,
    customResurrectionDate,
  } = useSelector(x => x.embalmState);

  // Although resurrection in ms is already stored in global state, we need another state to make it
  // easier to display the values in the input boxes. Resurrection and otherValue will often be
  // managed in parallel. Initialized with the resurrection value.

  //  const [otherValue, setOtherValue] = useState<Period>(initializeInputValues(resurrection));
  const [error, setError] = useState<string | null>(null);
  //const [isFocused, setIsFocused] = useState(false);

  const xyz = useRef<HTMLInputElement>(null);

  function handleRadioChange(nextValue: string) {
    dispatch(setResurrectionRadioValue(nextValue));
  }

  function handleCustomDateChange(date: Date | null) {
    dispatch(setCustomResurrectionDate(date));
  }

  // value and onChange are passed in to this hook instead of into a RadioGroup component.
  // This is part of creating a custom radio component
  const { getRootProps, getRadioProps } = useRadioGroup({
    value: radioValue,
    onChange: handleRadioChange,
  });

  // Update resurrection when the radio value changes
  useEffect(() => {
    console.log('useEffect1');
    if (radioValue !== 'Other') {
      setCustomResurrectionDate(null);

      const [number] = radioValue.split(' ');
      const newResurrection = new Date();
      newResurrection.setMonth(newResurrection.getMonth() + parseInt(number));
      dispatch(setResurrection(newResurrection.getTime()));
    }
  }, [dispatch, radioValue]);

  // Updates the error if the resurrection time is invalid
  useEffect(() => {
    if (resurrection - minimumResurrection < Date.now() && resurrection > 0) {
      setError(
        `Resurrection must be ${moment
          .duration(minimumResurrection)
          .humanize()} or more in the future.`
      );
    } else {
      setError(null);
    }
  }, [resurrection]);

  useEffect(() => {
    console.log('useEffect2');
    if (radioValue === 'Other') {
      console.log('date', customResurrectionDate);
      if (customResurrectionDate) {
        dispatch(setResurrection(customResurrectionDate.getTime()));
      }
    }
  }, [dispatch, radioValue, customResurrectionDate]);

  return {
    error,
    getRadioProps,
    getRootProps,
    customResurrectionDate,
    handleCustomDateChange,
    radioValue,
    xyz,
    resurrection,
  };
}
