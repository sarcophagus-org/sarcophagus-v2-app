import React, { useCallback } from 'react';
import { useSelector } from '../../store';
import { PeerId } from '@libp2p/interface-peer-id';
import { useToast } from '@chakra-ui/react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';


export function useDialArchaeologists(
  setIsDialing: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const toast = useToast();
  
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
    }, [libp2pNode]
  );

  return {
    testDialArchaeologist
  };
}