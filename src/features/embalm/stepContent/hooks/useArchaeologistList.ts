import { useCallback } from 'react';
import {
  deselectArchaeologist,
  selectArchaeologist,
  SortDirection,
  setDiggingFeesSortDirection,
  setArchAddressSearch,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Archaeologist } from 'types/index';
import { useLoadArchaeologists } from '../hooks/useLoadArchaeologists';
import { orderBy, keys } from 'lodash';
import { constants } from 'ethers';
import { useSarcophagusNegotiation } from 'hooks/libp2p/useSarcophagusNegotiation';

export function useArchaeologistList() {
  useLoadArchaeologists();
  const { dialSelectedArchaeologists } = useSarcophagusNegotiation();

  const dispatch = useDispatch();

  const {
    archaeologists,
    selectedArchaeologists,
    diggingFeesSortDirection,
    diggingFeesFilter,
    archAddressSearch,
  } = useSelector(s => s.embalmState);

  const onlineArchaeologists = archaeologists.filter(a => a.isOnline);

  const sortOrderByMap: { [key: number]: 'asc' | 'desc' | undefined } = {
    [SortDirection.NONE]: undefined,
    [SortDirection.ASC]: 'asc',
    [SortDirection.DESC]: 'desc',
  };

  // TODO: It doesn't make sense to implement pagination any further until we are loading real archaeologists
  const onClickNextPage = useCallback(() => {
    // Temporary console log
    console.log('Will implement pagination when we are loading real archaeologists');

    // TODO: temporary home for "event" that will fire up arch connection attempts. Move as appropriate.
    dialSelectedArchaeologists();
  }, [dialSelectedArchaeologists]);

  const onClickPrevPage = useCallback(() => {
    // Temporary console log
    console.log('Will implement pagination when we are loading real archaeologists');
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
  }

  const sortedArchaeoligist =
    diggingFeesSortDirection === SortDirection.NONE
      ? onlineArchaeologists
      : orderBy(
        onlineArchaeologists,
        'profile.minimumDiggingFee',
        sortOrderByMap[diggingFeesSortDirection]
      );

  const sortedFilteredArchaeoligist = sortedArchaeoligist.filter(
    arch =>
      arch.profile.archAddress.toLowerCase().includes(archAddressSearch.toLowerCase()) &&
      arch.profile.minimumDiggingFee.lte(diggingFeesFilter || constants.MaxInt256)
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
    diggingFeesSortDirection,
    sortedFilteredArchaeoligist,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
  };
}
