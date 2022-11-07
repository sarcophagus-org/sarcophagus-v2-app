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

  // const sortedArchaeologist =
  //   diggingFeesSortDirection && unwrapsSortDirection === SortDirection.NONE
  //     ? onlineArchaeologists
  //     : orderBy(
  //         onlineArchaeologists,
  //         [
  //           function (o) {
  //             return new Number(o.profile.minimumDiggingFee);
  //           },
  //           function (o) {
  //             return new Number(o.profile.successes);
  //           },
  //         ],
  //         sortOrderByMap[diggingFeesSortDirection] // here
  //       );

  // reset arrow when you move to different filter

  // function resetDirections() {
  //   setDiggingFeesSortDirection(SortDirection.NONE);
  //   setUnwrapsSortDirection(SortDirection.NONE);
  // }

  console.log('dig fees direction', sortOrderByMap[diggingFeesSortDirection]);

  console.log('unwraps  direction', sortOrderByMap[unwrapsSortDirection]);

  const sortedArchaeologist = () => {
    if (diggingFeesSortDirection + unwrapsSortDirection === 4) {
      return onlineArchaeologists;
    } else if (diggingFeesSortDirection !== 2) {
      return sortBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.minimumDiggingFee);
        },
        [sortOrderByMap[diggingFeesSortDirection]!]
      );
    } else if (unwrapsSortDirection !== 2) {
      return sortBy(
        onlineArchaeologists,
        function (arch) {
          return Number(arch.profile.successes);
        },
        [sortOrderByMap[unwrapsSortDirection]!]
      );
    }
  };

  console.log('sortedArchaeologist', sortedArchaeologist());
  // unwrapsSortDirection === SortDirection.NONE
  // ? onlineArchaeologists
  // : orderBy(
  //     onlineArchaeologists,
  //     function (o) {
  //       return new Number(o.profile.success);
  //     },
  //     sortOrderByMap[unwrapsSortDirection]
  //   );

  // useEffect(
  //   () => {
  //     const subscription = props.source.subscribe();
  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   },
  //   [onClickSortDiggingFees],
  // );

  // function sortedArchaeologist(): Archaeologist[] {
  //   const unwrapsDirection = sortOrderByMap[unwrapsSortDirection];
  //   const diggingFeesDirection = sortOrderByMap[diggingFeesSortDirection];

  //   if (diggingFeesSortDirection && unwrapsSortDirection === SortDirection.NONE) {
  //     return onlineArchaeologists;
  //   } else {
  //     return orderBy(
  //       onlineArchaeologists,
  //       ['profile.successes', 'profile.minimumDiggingFee'],
  //       [unwrapsDirection!, diggingFeesDirection!]
  //     );
  //   }
  // }

  // function sortedArchaeologist(): Archaeologist[] {
  //   resetDirections();
  //   if (diggingFeesSortDirection && unwrapsSortDirection === SortDirection.NONE) {
  //     return onlineArchaeologists;
  //   } else if (
  //     unwrapsSortDirection === SortDirection.NONE &&
  //     diggingFeesSortDirection !== SortDirection.NONE
  //   ) {
  //     return orderBy(
  //       onlineArchaeologists,
  //       [
  //         function (o) {
  //           return new Number(o.profile.successes);
  //         },
  //         function (o) {
  //           return new Number(o.profile.minimumDiggingFee);
  //         },
  //       ],
  //       sortOrderByMap[diggingFeesSortDirection]
  //     );
  //   } else {
  //     return orderBy(
  //       onlineArchaeologists,
  //       [
  //         function (o) {
  //           return new Number(o.profile.successes);
  //         },
  //         function (o) {
  //           return new Number(o.profile.minimumDiggingFee);
  //         },
  //       ],
  //       sortOrderByMap[unwrapsSortDirection]
  //     );
  //   }
  // }

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
