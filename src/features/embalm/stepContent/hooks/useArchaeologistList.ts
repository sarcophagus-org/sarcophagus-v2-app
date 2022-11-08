import { useCallback, useMemo } from 'react';
import {
  deselectArchaeologist,
  selectArchaeologist,
  SortDirection,
  setDiggingFeesSortDirection,
  setUnwrapsSortDirection,
  setArchAddressSearch,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { useLoadArchaeologists } from './useLoadArchaeologists';
import { orderBy, keys, sortBy } from 'lodash';
import { constants } from 'ethers';
import { mochArchaeologists } from '../mocks/mockArchaeologists';

export function useArchaeologistList() {
  useLoadArchaeologists();

  const dispatch = useDispatch();

  const {
    archaeologists,
    selectedArchaeologists,
    diggingFeesSortDirection,
    unwrapsSortDirection,
    diggingFeesFilter,
    archAddressSearch,
  } = useSelector(s => s.embalmState);

  const NUMBER_MOCK_ARCH = 5;

  const onlineArchaeologists = useMemo(
    () =>
      NUMBER_MOCK_ARCH > 0
        ? mochArchaeologists(NUMBER_MOCK_ARCH)
        : archaeologists.filter(a => a.isOnline),
    [NUMBER_MOCK_ARCH, archaeologists]
  );

  const sortOrderByMap: { [key: number]: 'asc' | 'desc' | undefined } = {
    [SortDirection.NONE]: undefined,
    [SortDirection.ASC]: 'asc',
    [SortDirection.DESC]: 'desc',
  };

  // TODO: Implement Pagination
  const onClickNextPage = useCallback(() => {
    // TODO: implement pagination
  }, []);

  const onClickPrevPage = useCallback(() => {
    // TODO: implement pagination
  }, []);

  const handleCheckArchaeologist = useCallback(
    (archaeologist: Archaeologist) => {
      if (
        selectedArchaeologists.findIndex(
          arch => arch.profile.peerId === archaeologist.profile.peerId
        ) !== -1
      ) {
        dispatch(deselectArchaeologist(archaeologist.profile.archAddress));
      } else {
        dispatch(selectArchaeologist(archaeologist));
      }
    },
    [dispatch, selectedArchaeologists]
  );

  function onClickSortDiggingFees() {
    const length = keys(SortDirection).length / 2;
    dispatch(setDiggingFeesSortDirection((diggingFeesSortDirection + 1) % length));
    dispatch(setUnwrapsSortDirection(SortDirection.NONE));
  }

  function onClickSortUnwraps() {
    const length = keys(SortDirection).length / 2;
    dispatch(setUnwrapsSortDirection((unwrapsSortDirection + 1) % length));
    dispatch(setDiggingFeesSortDirection(SortDirection.NONE));
  }

  const sortedArchaeologist = () => {
    if (diggingFeesSortDirection !== SortDirection.NONE) {
      console.log('diggingFeesSortDirection true');
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.minimumDiggingFee);
        },
        [sortOrderByMap[diggingFeesSortDirection]!]
      );
    }

    if (unwrapsSortDirection !== SortDirection.NONE) {
      console.log('unwrapsSortDirection true');
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.successes);
        },
        [sortOrderByMap[unwrapsSortDirection]!]
      );
    }

    return onlineArchaeologists;
  };

  const sortedFilteredArchaeologist = sortedArchaeologist()?.filter(
    arch =>
      arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
      arch.profile.minimumDiggingFee.lte(diggingFeesFilter || constants.MaxInt256)
    // &&
    // arch.profile.successes //verify to keep?
  );

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
    onClickSortUnwraps,
    diggingFeesSortDirection,
    unwrapsSortDirection,
    sortedFilteredArchaeologist,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
    sortedArchaeologist,
  };
}
