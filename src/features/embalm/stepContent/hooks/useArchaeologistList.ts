import { useCallback } from 'react';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import { SortDirection, SortFilterType, setSortDirection } from 'store/archaeologistList/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { orderBy, keys } from 'lodash';
import { constants, ethers } from 'ethers';
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
    showOnlySelectedArchaeologists,
  } = useSelector(s => s.archaeologistListState);

  // const onlineArchaeologists = archaeologists.filter(a => a.isOnline);
  const onlineArchaeologists = archaeologists;

  const resurrectionTimeMs = useSelector(s => s.embalmState.resurrection);

  // The archaeologist is not hidden out if:
  //  - resurrection time has been set further than the arch's max resurrection time
  //  - Interval between current time and set resurrection time is more than the arch's max rewrap interval
  //  - The arch doesn't have enough free bond to match digging fee based on the set resurrection time
  const [visibleArchaeologists, hiddenArchaeologists] = filterSplit(onlineArchaeologists, a => {
    if (resurrectionTimeMs > a.profile.maximumResurrectionTime.toNumber() * 1000) return false;

    const maxRewrapIntervalMs = a.profile.maximumRewrapInterval.toNumber() * 1000;
    const resurrectionIntervalMs = resurrectionTimeMs - Date.now();

    const estimatedCurse = !resurrectionTimeMs
      ? ethers.constants.Zero
      : a.profile.minimumDiggingFeePerSecond.mul(Math.trunc(resurrectionIntervalMs / 1000));

    const archIsVisible =
      resurrectionIntervalMs < maxRewrapIntervalMs && estimatedCurse.lte(a.profile.freeBond);

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

  const sortedArchaeologists = (): Archaeologist[] => {
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

  const getArchaeologistListToShow = (args: {
    showOnlySelectedArchaeologists?: boolean;
    includeHidden?: boolean;
  }): Archaeologist[] => {
    function shouldFilterBySelected(arch: Archaeologist): boolean {
      if (args.showOnlySelectedArchaeologists) {
        return (
          selectedArchaeologists.findIndex(a => a.profile.peerId === arch.profile.peerId) !== -1
        );
      }
      return true;
    }

    const filteredSorted = sortedArchaeologists()?.filter(
      arch =>
        shouldFilterBySelected(arch) &&
        (arch.ensName?.toLowerCase().includes(archAddressSearch.toLowerCase()) ||
          arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase())) &&
        arch.profile.minimumDiggingFeePerSecond
          .mul(2628288)
          .lte(
            (diggingFeesFilter && ethers.utils.parseEther(diggingFeesFilter)) || constants.MaxInt256
          ) &&
        arch.profile.successes.gte(unwrapsFilter || constants.MinInt256) &&
        arch.profile.failures.lte(failsFilter || constants.MaxInt256)
    );

    return args.includeHidden ? [...filteredSorted, ...hiddenArchaeologists] : filteredSorted;
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
    showOnlySelectedArchaeologists,
    SortDirection,
    getArchaeologistListToShow,
    unwrapsFilter,
  };
}
