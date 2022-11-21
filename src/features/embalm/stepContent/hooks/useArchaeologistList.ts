import { useCallback, useMemo } from 'react';
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
  const sortDirectionToggle = (value: SortDirection) => {
    return (value + 1) % length;
  };

  function onClickSortDiggingFees() {
    dispatch(
      setSortDirection(
        SortFilterType.DIGGING_FEES,
        sortDirectionToggle(archaeologistFilterSort.sortDirection)
      )
    );
  }

  function onClickSortUnwraps() {
    dispatch(
      setSortDirection(
        SortFilterType.UNWRAPS,
        sortDirectionToggle(archaeologistFilterSort.sortDirection)
      )
    );
  }

  function onClickSortFails() {
    dispatch(
      setSortDirection(
        SortFilterType.FAILS,
        sortDirectionToggle(archaeologistFilterSort.sortDirection)
      )
    );
  }

  function onClickSortArchs() {
    dispatch(
      setSortDirection(
        SortFilterType.ADDRESS_SEARCH,
        sortDirectionToggle(archaeologistFilterSort.sortDirection)
      )
    );
  }

  const sortedArchaeologist = () => {
    if (
      archaeologistFilterSort.sortType === SortFilterType.DIGGING_FEES &&
      archaeologistFilterSort.sortDirection !== SortDirection.NONE
    ) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.minimumDiggingFee);
        },
        [sortOrderByMap[archaeologistFilterSort.sortDirection]!]
      );
    }
    if (
      archaeologistFilterSort.sortType === SortFilterType.UNWRAPS &&
      archaeologistFilterSort.sortDirection !== SortDirection.NONE
    ) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.successes);
        },
        [sortOrderByMap[archaeologistFilterSort.sortDirection]!]
      );
    }
    if (
      archaeologistFilterSort.sortType === SortFilterType.FAILS &&
      archaeologistFilterSort.sortDirection !== SortDirection.NONE
    ) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.cleanups);
        },
        [sortOrderByMap[archaeologistFilterSort.sortDirection]!]
      );
    }
    if (
      archaeologistFilterSort.sortType === SortFilterType.ADDRESS_SEARCH &&
      archaeologistFilterSort.sortDirection !== SortDirection.NONE
    ) {
      return orderBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.archAddress);
        },
        [sortOrderByMap[archaeologistFilterSort.sortDirection]!]
      );
    }
    return onlineArchaeologists;
  };

  const sortedFilteredArchaeologist = (onlyShowSelected: boolean): Archaeologist[] => {
    function shouldFilterBySelected(arch: Archaeologist): boolean {
      if (!onlyShowSelected) {
        return true;
      }
      return selectedArchaeologists.findIndex(a => a.profile.peerId === arch.profile.peerId) !== -1;
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
