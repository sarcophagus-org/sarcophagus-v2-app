import React, { useCallback } from 'react';
import { useSelector } from '../../store';
import { useToast } from '@chakra-ui/react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';
import { Multiaddr, multiaddr } from '@multiformats/multiaddr';
import { Archaeologist } from '../../types';

export function useAttemptDialArchaeologists(
  setIsDialing?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const toast = useToast();

  // Dials the archaeologist and hangs up after an interval
  // sets dial status for use in the UX
  const testDialArchaeologist = useCallback(
    async (
      arch: Archaeologist,
      showToast: boolean = false,
      hangUpInterval: number = 200
    ): Promise<boolean> => {
      if (!libp2pNode) {
        return false;
      }

      try {
        let ma: Multiaddr;

        if (!!setIsDialing) {
          setIsDialing(true);
        }

        const peerIdParsed = arch.profile.peerId.split(':');
        if (peerIdParsed.length === 2) {
          ma = multiaddr(`/dns4/${peerIdParsed[0]}/tcp/443/wss/p2p/${peerIdParsed[1]}`);
          // @ts-ignore
          await libp2pNode.dial(ma);
        } else {
          await libp2pNode.dial(arch.fullPeerId!);
        }

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
    [libp2pNode, setIsDialing, toast]
  );

  return {
    testDialArchaeologist,
  };
}
