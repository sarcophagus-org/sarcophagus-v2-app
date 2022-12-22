import { useCallback } from 'react';
import { setArchaeologistConnection, setArchaeologistException } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../../../../../store';
import { Archaeologist, ArchaeologistExceptionCode } from 'types';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { createSarcophagusErrors } from '../../utils/errors';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';
import { Multiaddr, multiaddr } from '@multiformats/multiaddr';

export function useDialArchaeologists() {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const libp2pNode = useSelector(s => s.appState.libp2pNode);

  const getDialAddress = useCallback((arch: Archaeologist): PeerId | Multiaddr => {
    // If peerIdParsed has 2 elements, it has a domain and peerId <domain>:<peerId>
    // Otherwise it is just <peerId>
    const peerIdParsed = arch.profile.peerId.split(':');

    if (peerIdParsed.length === 2) {
      return multiaddr(`/dns4/${peerIdParsed[0]}/tcp/443/wss/p2p/${peerIdParsed[1]}`);
    } else {
      return arch.fullPeerId!;
    }
  }, []);

  const dialPeerIdOrMultiAddr = useCallback(
    (arch: Archaeologist, isPing?: boolean): Promise<Connection> | Promise<number> | undefined => {
      const dialAddr = getDialAddress(arch);

      // @ts-ignore
      return isPing ? libp2pNode?.ping(dialAddr) : libp2pNode?.dial(dialAddr);
    },
    [libp2pNode, getDialAddress]
  );

  const hangUpPeerIdOrMultiAddr = useCallback(
    (arch: Archaeologist) => {
      const dialAddr = getDialAddress(arch);

      // @ts-ignore
      return libp2pNode?.hangUp(dialAddr);
    },
    [libp2pNode, getDialAddress]
  );

  const dialArchaeologist = useCallback(
    async (arch: Archaeologist) => {
      const peerIdString = arch.profile.peerId;
      try {
        const connection = (await dialPeerIdOrMultiAddr(arch)) as Connection;
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(peerIdString, connection));
        return connection;
      } catch (e) {
        dispatch(
          setArchaeologistException(peerIdString, {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Could not establish a connection',
          })
        );
      }
    },
    [dispatch, dialPeerIdOrMultiAddr]
  );

  const dialSelectedArchaeologists = useCallback(async () => {
    const MAX_RETRIES = 5;
    const WAIT_BETWEEN_RETRIES = 300;
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    const dialArchaeologistWithRetry = async (dialFn: Function, depth = 0): Promise<Connection> => {
      try {
        const connection = await dialFn();
        return connection;
      } catch (e) {
        console.log(`Dial attempt ${depth + 1} failed, retrying....`);
        if (depth > MAX_RETRIES) {
          throw e;
        }

        await wait(WAIT_BETWEEN_RETRIES);

        return dialArchaeologistWithRetry(dialFn, depth + 1);
      }
    };

    const dialFailedArchaeologists = [];

    for await (const arch of selectedArchaeologists) {
      const peerIdString = arch.profile.peerId;
      try {
        const connection = await dialArchaeologistWithRetry(() => dialPeerIdOrMultiAddr(arch));
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(peerIdString, connection));
      } catch (e) {
        dispatch(
          setArchaeologistException(peerIdString, {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Could not establish a connection',
          })
        );
        dialFailedArchaeologists.push(peerIdString);
      }
    }

    if (dialFailedArchaeologists.length) {
      throw Error(createSarcophagusErrors[CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]);
    }
  }, [selectedArchaeologists, dispatch, dialPeerIdOrMultiAddr]);

  const pingArchaeologist = useCallback(
    async (arch: Archaeologist, onComplete: Function) => {
      const pingTimeout = 5000;
      const peerIdString = arch.profile.peerId;
      const couldNotConnect = setTimeout(() => {
        console.log('ping timeout!');

        dispatch(
          setArchaeologistException(peerIdString, {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Ping timeout',
          })
        );
        onComplete();
      }, pingTimeout);

      console.log(`pinging ${peerIdString}`);

      const latency = await dialPeerIdOrMultiAddr(arch, true);
      await hangUpPeerIdOrMultiAddr(arch);

      if (!!latency) {
        clearTimeout(couldNotConnect);
        onComplete();
      }
    },
    [dispatch, dialPeerIdOrMultiAddr, hangUpPeerIdOrMultiAddr]
  );

  return {
    dialSelectedArchaeologists,
    pingArchaeologist,
    dialArchaeologist,
    hangUpPeerIdOrMultiAddr,
  };
}
