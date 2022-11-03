import React, { useCallback } from 'react';
import { useDispatch, useSelector } from '../../store';
import { PeerId } from '@libp2p/interface-peer-id';
import { useToast } from '@chakra-ui/react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';
import { setArchaeologistException } from 'store/embalm/actions';
import { ArchaeologistExceptionCode } from 'types';

export function useDialArchaeologists(setIsDialing: React.Dispatch<React.SetStateAction<boolean>>) {
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const toast = useToast();
  const dispatch = useDispatch();

  // Dials the archaeologist and hangs up after an interval
  // sets dial status for use in the UX
  const testDialArchaeologist = useCallback(
    async (peerId: PeerId, hangUpInterval: number = 2000) => {
      if (!libp2pNode) {
        return;
      }

      try {
        setIsDialing(true);

        await libp2pNode?.dial(peerId);
        toast(dialArchaeologistSuccess());
        setTimeout(async () => {
          await libp2pNode?.hangUp(peerId);
        }, hangUpInterval);
      } catch (error) {
        toast(dialArchaeologistFailure());
      } finally {
        setIsDialing(false);
      }
    },
    [libp2pNode, setIsDialing, toast]
  );

  const pingArchaeologist = useCallback(async (peerId: PeerId) => {
    const pingTimeout = 5000;

    const couldNotConnect = setTimeout(() => {
      console.log('ping timeout!');

      dispatch(setArchaeologistException(
        peerId.toString(),
        { code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION, message: 'Ping timeout' }
      ));
    }, pingTimeout);

    console.log('pinging...');

    const latency = await libp2pNode?.ping(peerId);
    console.log('latency: ', latency);


    if (!!latency) clearTimeout(couldNotConnect);
  }, [libp2pNode, dispatch]);

  return {
    testDialArchaeologist,
    pingArchaeologist
  };
}
