import { PeerId } from '@libp2p/interface-peer-id';
import { useSarcoToast } from 'components/SarcoToast';
import React, { useCallback } from 'react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';
import { useSelector } from '../../store';

export function useAttemptDialArchaeologists(
  setIsDialing: React.Dispatch<React.SetStateAction<boolean>>
) {
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const sarcoToast = useSarcoToast();

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
        sarcoToast.open(dialArchaeologistSuccess());
        setTimeout(async () => {
          await libp2pNode?.hangUp(peerId);
        }, hangUpInterval);
      } catch (error) {
        sarcoToast.open(dialArchaeologistFailure());
      } finally {
        setIsDialing(false);
      }
    },
    [libp2pNode, setIsDialing, sarcoToast]
  );

  return {
    testDialArchaeologist,
  };
}
