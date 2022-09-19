import { useCallback } from 'react';
import {
  deselectArchaeologist,
  selectArchaeologist,
  SortDirection,
  setDiggingFeesSortDirection,
  setDiggingFeesFilter,
  setArchAddressSearch,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { useLoadArchaeologists } from '../hooks/useLoadArchaeologists';
import { orderBy } from 'lodash';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';

export function useArchaeologistList() {
  useLoadArchaeologists();
  const dispatch = useDispatch();
  const {
    archaeologists,
    selectedArchaeologists,
    diggingFeesSortDirection,
    diggingFeesFilter,
    archAddressSearch,
  } = useSelector(s => s.embalmState);

  // TODO: It doesn't make sense to implement pagination any further until we are loading real archaeologists
  const onClickNextPage = useCallback(() => {
    // Temporary console log
    console.log('Will implement pagination when we are loading real archaeologists');
  }, []);

  const onClickPrevPage = useCallback(() => {
    // Temporary console log
    console.log('Will implement pagination when we are loading real archaeologists');
  }, []);

  const handleCheckArchaeologist = useCallback(
    (archaeologist: Archaeologist) => {
      if (selectedArchaeologists.includes(archaeologist)) {
        dispatch(deselectArchaeologist(archaeologist.profile.archAddress));
      } else {
        dispatch(selectArchaeologist(archaeologist));
      }
    },
    [dispatch, selectedArchaeologists]
  );

  function onClickSortDiggingFees() {
    dispatch(
      setDiggingFeesSortDirection(
        diggingFeesSortDirection === SortDirection.NONE
          ? SortDirection.ASC
          : diggingFeesSortDirection === SortDirection.ASC
          ? SortDirection.DESC
          : diggingFeesSortDirection === SortDirection.DESC
          ? SortDirection.NONE
          : SortDirection.NONE
      )
    );
  }

  const sortedArchaeoligist =
    diggingFeesSortDirection === SortDirection.NONE
      ? archaeologists
      : orderBy(archaeologists, 'profile.minimumDiggingFee', diggingFeesSortDirection);

  const sortedFilteredArchaeoligist = sortedArchaeoligist.filter(
    arch =>
      arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
      arch.profile.minimumDiggingFee.lte(diggingFeesFilter || 100000000)
  );

  function handleChangeDiggingFeesFilter(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }

    dispatch(setDiggingFeesFilter(valueAsString));
  }

  function handleChangeAddressSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    dispatch(setArchAddressSearch(value));
  }

  return {
    onClickNextPage,
    onClickPrevPage,
    handleCheckArchaeologist,
    selectedArchaeologists,
    onClickSortDiggingFees,
    diggingFeesSortDirection,
    sortedFilteredArchaeoligist,
    handleChangeDiggingFeesFilter,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
  };
}
