import { useCallback } from 'react';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import { SortDirection, SortFilterType, setSortDirection } from 'store/archaeologistList/actions';
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
    archaeologistFilterSort,
    diggingFeesFilter,
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    showSelectedArchaeologists,
  } = useSelector(s => s.archaeologistListState);

  // const onlineArchaeologists = archaeologists.filter(a => a.isOnline);
  const onlineArchaeologists = mochArchaeologists();

  // const ensOnlineArchaeologists = await ReverseRecords.getNames(onlineArchaeologists);

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
  const directionValue = (archaeologistFilterSort.sortDirection + 1) % length;

  function onClickSortDiggingFees() {
    dispatch(setSortDirection(SortFilterType.DIGGING_FEES, directionValue));
  }

  function onClickSortUnwraps() {
    dispatch(setSortDirection(SortFilterType.UNWRAPS, directionValue));
  }

  function onClickSortFails() {
    dispatch(setSortDirection(SortFilterType.FAILS, directionValue));
  }

  function onClickSortArchs() {
    dispatch(setSortDirection(SortFilterType.ADDRESS_SEARCH, directionValue));
  }

  const sortedArchaeologist = (): Archaeologist[] => {
    if (archaeologistFilterSort.sortDirection !== SortDirection.NONE) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          let sortValue;
          if (archaeologistFilterSort.sortType === SortFilterType.DIGGING_FEES) {
            sortValue = arch.profile.minimumDiggingFee;
          } else if (archaeologistFilterSort.sortType === SortFilterType.UNWRAPS) {
            sortValue = arch.profile.successes;
          } else if (archaeologistFilterSort.sortType === SortFilterType.FAILS) {
            sortValue = arch.profile.cleanups;
          } else if (archaeologistFilterSort.sortType === SortFilterType.ADDRESS_SEARCH) {
            sortValue = arch.profile.archAddress;
          }
          return Number(sortValue);
        },
        [sortOrderByMap[archaeologistFilterSort.sortDirection]!]
      );
    } else {
      return onlineArchaeologists;
    }
  };

  const sortedFilteredArchaeologist = (onlyShowSelected: boolean): Archaeologist[] => {
    function shouldFilterBySelected(arch: Archaeologist): boolean {
      if (onlyShowSelected) {
        return (
          selectedArchaeologists.findIndex(a => a.profile.peerId === arch.profile.peerId) !== -1
        );
      }
      return true;
    }

    return sortedArchaeologist()?.filter(
      arch =>
        arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
        BigNumber.from(
          Number(ethers.utils.formatEther(arch.profile.minimumDiggingFee)).toFixed(0)
        ).lte(diggingFeesFilter || constants.MaxInt256) &&
        BigNumber.from(Number(arch.profile.successes)).gte(unwrapsFilter || constants.MinInt256) &&
        BigNumber.from(Number(arch.profile.cleanups)).lte(failsFilter || constants.MaxInt256) &&
        shouldFilterBySelected(arch)
    );
  };

  return {
    handleCheckArchaeologist,
    selectedArchaeologists,
    onClickSortDiggingFees,
    onClickSortUnwraps,
    onClickSortFails,
    onClickSortArchs,
    SortDirection,
    archaeologistFilterSort,
    sortedFilteredArchaeologist,
    diggingFeesFilter,
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    sortedArchaeologist,
    showSelectedArchaeologists,
  };
}
