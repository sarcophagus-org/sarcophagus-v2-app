import { useRadioGroup } from '@chakra-ui/react';
import { minimumResurrection } from 'lib/constants';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  setCustomResurrectionDate,
  setResurrection,
  setResurrectionRadioValue,
  setSelectedArchaeologists,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

/**
 * Hook for managing resurrection selection
 */
export function useSetResurrection() {
  const dispatch = useDispatch();
  const {
    resurrection,
    resurrectionRadioValue: radioValue,
    customResurrectionDate,
  } = useSelector(x => x.embalmState);
  const { timestampMs } = useSelector(x => x.appState);

  // Although resurrection in ms is already stored in global state, we need another state to make it
  // easier to display the value in the DatePicker. Resurrection and CustomResurrectionDate will often be
  // managed in parallel.

  const [error, setError] = useState<string | null>(null);

  function handleRadioChange(nextValue: string) {
    dispatch(setResurrectionRadioValue(nextValue));
    dispatch(setSelectedArchaeologists([]));
  }

  function handleCustomDateChange(date: Date | null) {
    dispatch(setCustomResurrectionDate(date));
    dispatch(setSelectedArchaeologists([]));
  }

  function handleCustomDateClick() {
    dispatch(setResurrectionRadioValue('Other'));
    dispatch(setSelectedArchaeologists([]));
  }

  // value and onChange are passed in to this hook instead of into a RadioGroup component.
  // This is part of creating a custom radio component
  const { getRadioProps } = useRadioGroup({
    value: radioValue,
    onChange: handleRadioChange,
  });

  // Update resurrection when the radio value changes
  useEffect(() => {
    if (radioValue !== 'Other') {
      setCustomResurrectionDate(null);
      if (radioValue === '') {
        dispatch(setResurrection(0));
      } else {
        const [days] = radioValue === '' ? '0' : radioValue.split(' ');
        const intervalMs = parseInt(days) * 24 * 60 * 60 * 1000;
        dispatch(setResurrection(timestampMs + intervalMs));
      }
    } else {
      if (customResurrectionDate) {
        dispatch(setResurrection(customResurrectionDate.getTime()));
      }
    }
  }, [customResurrectionDate, dispatch, radioValue, timestampMs]);

  // Updates the error if the resurrection time is invalid
  useEffect(() => {
    if (resurrection - minimumResurrection < timestampMs && resurrection !== 0) {
      setError(
        `Resurrection must be ${moment
          .duration(minimumResurrection)
          .humanize()} or more in the future.`
      );
    } else {
      setError(null);
    }
  }, [resurrection, timestampMs]);

  return {
    error,
    getRadioProps,
    radioValue,
    customResurrectionDate,
    handleCustomDateChange,
    handleCustomDateClick,
  };
}
