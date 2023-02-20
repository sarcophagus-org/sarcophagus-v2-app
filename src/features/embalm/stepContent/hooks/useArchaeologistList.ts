import { useCallback } from 'react';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import { SortDirection, SortFilterType, setSortDirection } from 'store/archaeologistList/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { orderBy, keys } from 'lodash';
import { constants, ethers, BigNumber } from 'ethers';
import { filterSplit } from 'lib/utils/helpers';

export function useArchaeologistList() {
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
  const onlineArchaeologists = archaeologists;

  const resurrectionTimeMs = useSelector(s => s.embalmState.resurrection);

  // If the difference between the resurrection time and the current time is less than an
  // archaeologist's rewrap interval and if the archaeologist's free bond is greater than the
  // digging fee, that archaeologist goes in the visible list. Otherwise it goes in the hidden list.
  const [visibleArchaeologists, hiddenArchaeologists] = filterSplit(onlineArchaeologists, a => {
    const maxRewrapIntervalMs = a.profile.maximumRewrapInterval.toNumber() * 1000;
    // If resurrection time has not been set, it will default to 0.
    // An archaeologist is hidden if the maximum rewrap interval not within range
    // Or their free bond is less than their digging fee
    const archIsVisible =
      resurrectionTimeMs - Date.now() < maxRewrapIntervalMs &&
      a.profile.minimumDiggingFeePerSecond.lte(a.profile.freeBond);

    return archIsVisible;
  });

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
        visibleArchaeologists,
        function (arch) {
          let sortValue;
          if (archaeologistFilterSort.sortType === SortFilterType.DIGGING_FEES) {
            sortValue = arch.profile.minimumDiggingFeePerSecond;
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
      return visibleArchaeologists;
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
          Number(ethers.utils.formatEther(arch.profile.minimumDiggingFeePerSecond)).toFixed(0)
        ).lte(diggingFeesFilter || constants.MaxInt256) &&
        BigNumber.from(Number(arch.profile.successes)).gte(unwrapsFilter || constants.MinInt256) &&
        BigNumber.from(Number(arch.profile.cleanups)).lte(failsFilter || constants.MaxInt256) &&
        shouldFilterBySelected(arch)
    );
  };

  return {
    archAddressSearch,
    archaeologistFilterSort,
    diggingFeesFilter,
    failsFilter,
    handleCheckArchaeologist,
    hiddenArchaeologists,
    onClickSortArchs,
    onClickSortDiggingFees,
    onClickSortFails,
    onClickSortUnwraps,
    selectedArchaeologists,
    showSelectedArchaeologists,
    SortDirection,
    sortedArchaeologist,
    sortedFilteredArchaeologist,
    unwrapsFilter,
  };
}
