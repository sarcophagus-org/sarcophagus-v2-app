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
import { constants, ethers, BigNumber } from 'ethers';
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
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    showSelectedArchaeologists,
  } = useSelector(s => s.embalmState);

  const NUMBER_MOCK_ARCH = 30;

  // Used for generating testing archaeologists
  const onlineArchaeologists = useMemo(
    () =>
      NUMBER_MOCK_ARCH > 0
        ? mochArchaeologists(NUMBER_MOCK_ARCH)
        : archaeologists.filter(a => a.isOnline),
    [NUMBER_MOCK_ARCH]
  );

  console.log('onlineArchaeologists', onlineArchaeologists);
  const sortOrderByMap: { [key: number]: 'asc' | 'desc' | undefined } = {
    [SortDirection.NONE]: undefined,
    [SortDirection.ASC]: 'asc',
    [SortDirection.DESC]: 'desc',
  };

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
    dispatch(setFailsSortDirection(SortDirection.NONE));
    dispatch(setArchsSortDirection(SortDirection.NONE));
  }

  function onClickSortUnwraps() {
    const length = keys(SortDirection).length / 2;
    dispatch(setUnwrapsSortDirection((unwrapsSortDirection + 1) % length));
    dispatch(setDiggingFeesSortDirection(SortDirection.NONE));
    dispatch(setFailsSortDirection(SortDirection.NONE));
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

  let sortedFilteredArchaeologist: Archaeologist[] = [];
  if (!showSelectedArchaeologists) {
    sortedFilteredArchaeologist = sortedArchaeologist()?.filter(
      arch =>
        arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
        BigNumber.from(
          Number(ethers.utils.formatEther(arch.profile.minimumDiggingFee)).toFixed(0)
        ).lte(diggingFeesFilter || constants.MaxInt256) &&
        BigNumber.from(Number(arch.profile.successes)).gte(unwrapsFilter || constants.MinInt256) &&
        BigNumber.from(Number(arch.profile.cleanups)).lte(failsFilter || constants.MaxInt256)
    );
  } else {
    sortedFilteredArchaeologist = sortedArchaeologist()?.filter(
      arch =>
        arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
        BigNumber.from(
          Number(ethers.utils.formatEther(arch.profile.minimumDiggingFee)).toFixed(0)
        ).lte(diggingFeesFilter || constants.MaxInt256) &&
        BigNumber.from(Number(arch.profile.successes)).lte(unwrapsFilter || constants.MaxInt256) &&
        BigNumber.from(Number(arch.profile.cleanups)).lte(failsFilter || constants.MaxInt256) &&
        selectedArchaeologists.findIndex(a => a.profile.peerId === arch.profile.peerId) !== -1
    );
  }

  function handleChangeAddressSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    dispatch(setArchAddressSearch(value));
  }

  return {
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
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    sortedArchaeologist,
  };
}
