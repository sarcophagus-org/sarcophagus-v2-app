import { constants, ethers } from 'ethers';
import { monthSeconds } from 'lib/constants';
import { filterSplit, humanizeUnixTimestamp } from 'lib/utils/helpers';
import { keys, orderBy } from 'lodash';
import { useCallback } from 'react';
import { calculateDiggingFees } from 'sarcophagus-v2-sdk';
import { ArchaeologistData } from 'sarcophagus-v2-sdk/src/types/archaeologist';
import { SortDirection, SortFilterType, setSortDirection } from 'store/archaeologistList/actions';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function useArchaeologistList() {
  const dispatch = useDispatch();

  const {
    archaeologists,
    selectedArchaeologists,
    resurrection: resurrectionTime,
  } = useSelector(s => s.embalmState);

  const {
    archaeologistFilterSort,
    diggingFeesFilter,
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
    showOnlySelectedArchaeologists,
    showHiddenArchaeologists,
  } = useSelector(s => s.archaeologistListState);

  const onlineArchaeologists = archaeologists.filter(a => a.isOnline);

  const resurrectionTimeMs = useSelector(s => s.embalmState.resurrection);
  const { timestampMs } = useSelector(s => s.appState);

  // The archaeologist is not hidden out if:
  //  - resurrection time has been set further than the arch's max resurrection time
  //  - Interval between current time and set resurrection time is more than the arch's max rewrap interval
  //  - The arch doesn't have enough free bond to match digging fee based on the set resurrection time
  const [visibleArchaeologists, hiddenArchaeologists] = filterSplit(onlineArchaeologists, a => {
    const maxResurrectionTimeMs = a.profile.maximumResurrectionTime.toNumber() * 1000;
    if (resurrectionTimeMs > maxResurrectionTimeMs) {
      a.hiddenReason = `This archaeologist will not be available at the resurrection time you have set. Available until: ${humanizeUnixTimestamp(
        maxResurrectionTimeMs
      )}`;
      return false;
    }

    const maxRewrapIntervalMs = a.profile.maximumRewrapInterval.toNumber() * 1000;
    const resurrectionIntervalMs = resurrectionTimeMs - timestampMs;

    const estimatedCurse = !resurrectionTimeMs
      ? ethers.constants.Zero
      : a.profile.minimumDiggingFeePerSecond
          .mul(Math.trunc(resurrectionIntervalMs / 1000))
          .add(a.profile.curseFee);

    if (resurrectionIntervalMs > maxRewrapIntervalMs) {
      a.hiddenReason = `The time interval to your resurrection time exceeds the maximum period this archaeologist is willing to be responsible for a Sarcophagus. Maximum interval: ~${Math.round(
        maxRewrapIntervalMs / (monthSeconds * 1000)
      )} months`;
      return false;
    }

    if (estimatedCurse.gt(a.profile.freeBond)) {
      a.hiddenReason =
        'This archaeologist does not have enough in free bond to be responsible for your Sarcophagus for the length of time you have set.';
      return false;
    }

    a.hiddenReason = undefined;
    return true;
  });

  const handleCheckArchaeologist = useCallback(
    (archaeologist: ArchaeologistData) => {
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

  const sortedArchaeologists = useCallback((): ArchaeologistData[] => {
    const sortOrderByMap: { [key: number]: 'asc' | 'desc' | undefined } = {
      [SortDirection.NONE]: undefined,
      [SortDirection.ASC]: 'asc',
      [SortDirection.DESC]: 'desc',
    };

    if (archaeologistFilterSort.sortDirection !== SortDirection.NONE) {
      return orderBy(
        visibleArchaeologists,
        function (arch) {
          let sortValue;
          if (archaeologistFilterSort.sortType === SortFilterType.DIGGING_FEES) {
            const diggingFees = calculateDiggingFees(arch, resurrectionTime, timestampMs);
            const totalFees = diggingFees?.add(arch.profile.curseFee);
            sortValue = totalFees ?? arch.profile.minimumDiggingFeePerSecond;
          } else if (archaeologistFilterSort.sortType === SortFilterType.UNWRAPS) {
            sortValue = arch.profile.successes;
          } else if (archaeologistFilterSort.sortType === SortFilterType.FAILS) {
            sortValue = arch.profile.failures;
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
  }, [
    archaeologistFilterSort.sortDirection,
    archaeologistFilterSort.sortType,
    resurrectionTime,
    timestampMs,
    visibleArchaeologists,
  ]);

  function shouldFilterBySelected(arch: ArchaeologistData): boolean {
    if (showOnlySelectedArchaeologists) {
      return selectedArchaeologists.findIndex(a => a.profile.peerId === arch.profile.peerId) !== -1;
    }
    return true;
  }

  const archaeologistListVisible = (arg: { forceShowHidden: boolean }): ArchaeologistData[] => {
    const filteredSorted = sortedArchaeologists()?.filter(
      arch =>
        shouldFilterBySelected(arch) &&
        (arch.ensName?.toLowerCase().includes(archAddressSearch.toLowerCase()) ||
          arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase())) &&
        arch.profile.minimumDiggingFeePerSecond
          .mul(monthSeconds)
          .lte(
            (diggingFeesFilter && ethers.utils.parseEther(diggingFeesFilter)) || constants.MaxInt256
          ) &&
        arch.profile.successes.gte(unwrapsFilter || constants.MinInt256) &&
        arch.profile.failures.lte(failsFilter || constants.MaxInt256)
    );

    return (arg.forceShowHidden || showHiddenArchaeologists) && !showOnlySelectedArchaeologists
      ? [...filteredSorted, ...hiddenArchaeologists]
      : filteredSorted;
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
    showHiddenArchaeologists,
    SortDirection,
    archaeologistListVisible,
    unwrapsFilter,
  };
}
