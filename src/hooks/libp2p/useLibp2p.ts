import { Connection } from '@libp2p/interface-connection';
import { PeerInfo } from '@libp2p/interface-peer-info';
import { useCallback } from 'react';
import {
  setArchaeologistConnection,
  setArchaeologistFullPeerId,
  setArchaeologistOnlineStatus,
} from 'store/embalm/actions';
import { useDispatch } from 'store/index';

// TODO -- temporarily removed while we have the 20 second discovery limit
// values used to determine if an archaeologist is online
// const pingThreshold = 60000;
// const heartbeatTimeouts: Record<string, NodeJS.Timeout | undefined> = {};

export function useLibp2p() {
  const dispatch = useDispatch();

  const onPeerDiscovery = useCallback(
    (evt: CustomEvent<PeerInfo>) => {
      const peerId = evt.detail.id;

      dispatch(setArchaeologistOnlineStatus(peerId.toString(), true));
      dispatch(setArchaeologistFullPeerId(peerId));

      // TODO -- temporarily removed while we have the 20 second discovery limit
      // if this continues to run, the archs will disappear

      // if (heartbeatTimeouts[peerId.toString()]) {
      //   clearTimeout(heartbeatTimeouts[peerId.toString()]);
      //   heartbeatTimeouts[peerId.toString()] = undefined;
      // }
      //
      // heartbeatTimeouts[peerId.toString()] = setTimeout(() => {
      //   console.log(`No longer online: ${peerId.toString()}`);
      //   dispatch(setArchaeologistOnlineStatus(peerId.toString(), false));
      // }, pingThreshold);
    },
    [dispatch]
  );

  const onPeerConnect = useCallback(
    (evt: CustomEvent<Connection>) => {
      const peerId = evt.detail.remotePeer.toString();
      setTimeout(() => dispatch(setArchaeologistConnection(peerId, evt.detail)), 500);
    },
    [dispatch]
  );

  const onPeerDisconnect = useCallback(
    (evt: CustomEvent<Connection>) => {
      const peerId = evt.detail.remotePeer.toString();
      dispatch(setArchaeologistConnection(peerId, undefined));
    },
    [dispatch]
  );

  return {
    onPeerDiscovery,
    onPeerConnect,
    onPeerDisconnect,
  };
}
