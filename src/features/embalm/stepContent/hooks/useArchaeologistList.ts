import { useCallback, useMemo } from 'react';
import {
  deselectArchaeologist,
  selectArchaeologist,
  SortDirection,
  setDiggingFeesSortDirection,
  setUnwrapsSortDirection,
  setFailsSortDirection,
  setArchsSortDirection,
  setArchAddressSearch,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { useLoadArchaeologists } from './useLoadArchaeologists';
import { orderBy, keys } from 'lodash';
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
    failsSortDirection,
    archsSortDirection,
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

  // create a function that takes an argument?
  function onClickSortDiggingFees() {
    const length = keys(SortDirection).length / 2;
    dispatch(setDiggingFeesSortDirection((diggingFeesSortDirection + 1) % length));
    dispatch(setUnwrapsSortDirection(SortDirection.NONE));
    setFailsSortDirection(SortDirection.NONE);
    dispatch(setArchsSortDirection(SortDirection.NONE));
  }

  function onClickSortUnwraps() {
    const length = keys(SortDirection).length / 2;
    dispatch(setUnwrapsSortDirection((unwrapsSortDirection + 1) % length));
    dispatch(setDiggingFeesSortDirection(SortDirection.NONE));
    setFailsSortDirection(SortDirection.NONE);
    dispatch(setArchsSortDirection(SortDirection.NONE));
  }

  function onClickSortFails() {
    const length = keys(SortDirection).length / 2;
    dispatch(setFailsSortDirection((failsSortDirection + 1) % length));
    dispatch(setDiggingFeesSortDirection(SortDirection.NONE));
    dispatch(setUnwrapsSortDirection(SortDirection.NONE));
    dispatch(setArchsSortDirection(SortDirection.NONE));
  }

  function onClickSortArchs() {
    const length = keys(SortDirection).length / 2;
    dispatch(setArchsSortDirection((archsSortDirection + 1) % length));
    dispatch(setFailsSortDirection(SortDirection.NONE));
    dispatch(setDiggingFeesSortDirection(SortDirection.NONE));
    dispatch(setUnwrapsSortDirection(SortDirection.NONE));
  }

  const sortedArchaeologist = () => {
    if (diggingFeesSortDirection !== SortDirection.NONE) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.minimumDiggingFee);
        },
        [sortOrderByMap[diggingFeesSortDirection]!]
      );
    }
    if (unwrapsSortDirection !== SortDirection.NONE) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.successes);
        },
        [sortOrderByMap[unwrapsSortDirection]!]
      );
    }
    if (failsSortDirection !== SortDirection.NONE) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.cleanups);
        },
        [sortOrderByMap[failsSortDirection]!]
      );
    }

    if (archsSortDirection !== SortDirection.NONE) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.archAddress);
        },
        [sortOrderByMap[archsSortDirection]!]
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
    onClickSortFails,
    onClickSortArchs,
    diggingFeesSortDirection,
    unwrapsSortDirection,
    failsSortDirection,
    archsSortDirection,
    sortedFilteredArchaeologist,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
    sortedArchaeologist,
  };
}
