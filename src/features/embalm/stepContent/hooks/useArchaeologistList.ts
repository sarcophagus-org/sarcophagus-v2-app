import { useCallback, useMemo } from 'react';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import {
  SortDirection,
  SortFilterType,
  setSortDirection,
  setDiggingFeesSortDirection,
  setUnwrapsSortDirection,
  setFailsSortDirection,
  setArchsSortDirection,
  ArchaeologistListActions,
} from 'store/archaeologistList/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { useLoadArchaeologists } from './useLoadArchaeologists';
import { orderBy, keys } from 'lodash';
import { constants, ethers, BigNumber } from 'ethers';
import { mochArchaeologists } from '../mocks/mockArchaeologists';

export function useArchaeologistList() {
  useLoadArchaeologists();

  const dispatch = useDispatch();

  const { archaeologists, selectedArchaeologists } = useSelector(s => s.embalmState);

  const {
    diggingFeesSortDirection,
    unwrapsSortDirection,
    failsSortDirection,
    archsSortDirection,
    diggingFeesFilter,
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    showSelectedArchaeologists,
  } = useSelector(s => s.archaeologistListState);

  // USED FOR GENERATING TEST ARCHS:
  const NUMBER_MOCK_ARCH = 30;
  const onlineArchaeologists = useMemo(
    () =>
      NUMBER_MOCK_ARCH > 0
        ? mochArchaeologists(NUMBER_MOCK_ARCH)
        : archaeologists.filter(a => a.isOnline),
    [NUMBER_MOCK_ARCH]
  );

  // const onlineArchaeologists = archaeologists.filter(a => a.isOnline);

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

  const length = keys(SortDirection).length / 2;
  const sortDirection = (value: SortDirection) => {
    return (value + 1) % length;
  };

  function setDirection(sortType: ArchaeologistListActions) {
    dispatch(setSortDirection(SortFilterType.ADDRESS_SEARCH, SortDirection.NONE));
    dispatch(setSortDirection(SortFilterType.DIGGING_FEES, SortDirection.NONE));
    dispatch(setSortDirection(SortFilterType.UNWRAPS, SortDirection.NONE));
    dispatch(setSortDirection(SortFilterType.FAILS, SortDirection.NONE));
    // dispatch(setDiggingFeesSortDirection(SortDirection.NONE));
    // dispatch(setUnwrapsSortDirection(SortDirection.NONE));
    // dispatch(setFailsSortDirection(SortDirection.NONE));
    // dispatch(setArchsSortDirection(SortDirection.NONE));
    dispatch(sortType);
  }

  function onClickSortDiggingFees() {
    setDirection(setDiggingFeesSortDirection(sortDirection(diggingFeesSortDirection)));
  }

  function onClickSortUnwraps() {
    setDirection(setUnwrapsSortDirection(sortDirection(unwrapsSortDirection)));
  }

  function onClickSortFails() {
    setDirection(setFailsSortDirection(sortDirection(failsSortDirection)));
  }

  function onClickSortArchs() {
    setDirection(setArchsSortDirection(sortDirection(archsSortDirection)));
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

  const sortedFilteredArchaeologist: (arg: boolean) => Archaeologist[] = checkbox => {
    function showSelected(arch: Archaeologist) {
      const component = checkbox
        ? selectedArchaeologists.findIndex(a => a.profile.peerId === arch.profile.peerId) !== -1
        : 'none';
      return component;
    }

    return sortedArchaeologist()?.filter(
      arch =>
        arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
        BigNumber.from(
          Number(ethers.utils.formatEther(arch.profile.minimumDiggingFee)).toFixed(0)
        ).lte(diggingFeesFilter || constants.MaxInt256) &&
        BigNumber.from(Number(arch.profile.successes)).gte(unwrapsFilter || constants.MinInt256) &&
        BigNumber.from(Number(arch.profile.cleanups)).lte(failsFilter || constants.MaxInt256) &&
        showSelected(arch)
    );
  };

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
    diggingFeesFilter,
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    sortedArchaeologist,
    showSelectedArchaeologists,
  };
}
