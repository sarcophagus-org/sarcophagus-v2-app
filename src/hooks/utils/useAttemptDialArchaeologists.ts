import React, { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';
import { multiaddr } from '@multiformats/multiaddr';
import { ArchaeologistData } from 'sarcophagus-v2-sdk/src/types/archaeologist';
import { sarco } from 'sarcophagus-v2-sdk';

export function useAttemptDialArchaeologists(
  setIsDialing?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const toast = useToast();

  // Dials the archaeologist and hangs up after an interval
  // sets dial status for use in the UX
  const testDialArchaeologist = useCallback(
    async (
      arch: ArchaeologistData,
      showToast: boolean = false,
      hangUpInterval: number = 200
    ): Promise<boolean> => {
      try {
        if (!!setIsDialing) {
          setIsDialing(true);
        }

        const peerIdParsed = arch.profile.peerId.split(':');
        if (peerIdParsed.length !== 2) {
          throw new Error('PeerId is not valid');
        }

        const ma = multiaddr(`/dns4/${peerIdParsed[0]}/tcp/443/wss/p2p/${peerIdParsed[1]}`);
        await sarco.archaeologist.dialArchaeologist(ma);

        if (showToast) {
          toast(dialArchaeologistSuccess());
        }

        setTimeout(async () => {
          // @ts-ignore
          await libp2pNode?.hangUp(ma || peerId);
        }, hangUpInterval);

        return true;
      } catch (error) {
        console.log(error);

        if (showToast) {
          toast(dialArchaeologistFailure());
        }

        return false;
      } finally {
        if (!!setIsDialing) {
          setIsDialing(false);
        }
      }
    },
    [setIsDialing, toast]
  );
  return {
    testDialArchaeologist,
  };
}
