import React, { useCallback } from 'react';
import { useSelector } from '../../store';
import { useToast } from '@chakra-ui/react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';
import { PeerId } from '@libp2p/interface-peer-id';
import { Multiaddr, multiaddr } from '@multiformats/multiaddr';

export function useAttemptDialArchaeologists(
  setIsDialing: React.Dispatch<React.SetStateAction<boolean>>
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
        let ma: Multiaddr;
        setIsDialing(true);
        // TODO -- this ma code can be removed/updated once testing on this single arch is complete.
        if (!peerId) {
          ma = multiaddr(
            '/dns4/wss.encryptafile.com/tcp/443/wss/p2p/12D3KooWPLcrUEMREHW3eT6EWTTbgaKFeay8Ywqck7dyVSERfJZd'
          );
          console.log(ma.getPeerId());
          // @ts-ignore
          await libp2pNode.dial(ma);
        } else {
          console.log(peerId.multihash);
          await libp2pNode.dial(peerId);
        }
        toast(dialArchaeologistSuccess());
        setTimeout(async () => {
          // @ts-ignore
          await libp2pNode?.hangUp(ma || peerId);
        }, hangUpInterval);
      } catch (error) {
        console.log(error);
        toast(dialArchaeologistFailure());
      } finally {
        setIsDialing(false);
      }
    },
    [libp2pNode, setIsDialing, toast]
  );

  return {
    testDialArchaeologist,
  };
}
