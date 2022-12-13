import { useCallback } from 'react';
import { setArchaeologistConnection, setArchaeologistException } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../../../../../store';
import { ArchaeologistExceptionCode } from 'types';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { createSarcophagusErrors } from '../../utils/errors';
import { PeerId } from '@libp2p/interface-peer-id';
import { Connection } from '@libp2p/interface-connection';
import { multiaddr } from '@multiformats/multiaddr';

export function useDialArchaeologists() {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const libp2pNode = useSelector(s => s.appState.libp2pNode);

  const dialArchaeologist = useCallback(
    async (peerId: PeerId) => {
      try {
        const connection = await libp2pNode?.dial(peerId);
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(peerId.toString(), connection));
        return connection;
      } catch (e) {
        dispatch(
          setArchaeologistException(peerId.toString(), {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Could not establish a connection',
          })
        );
      }
    },
    [libp2pNode, dispatch]
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
      try {
        const connection = await dialArchaeologistWithRetry(() =>
          !arch.profile.peerId.includes('.')
            ? libp2pNode?.dial(arch.fullPeerId!)
            : libp2pNode?.dial(
                // @ts-ignore
                multiaddr(
                  '/dns4/wss.encryptafile.com/tcp/443/wss/p2p/12D3KooWPLcrUEMREHW3eT6EWTTbgaKFeay8Ywqck7dyVSERfJZd'
                )
              )
        );
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(arch.profile.peerId, connection));
      } catch (e) {
        dispatch(
          setArchaeologistException(arch.profile.peerId, {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Could not establish a connection',
          })
        );
        dialFailedArchaeologists.push(arch.profile.peerId);
      }
    }

    if (dialFailedArchaeologists.length) {
      throw Error(createSarcophagusErrors[CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]);
    }
  }, [selectedArchaeologists, libp2pNode, dispatch]);

  const pingArchaeologist = useCallback(
    async (peerId: PeerId, onComplete: Function) => {
      const pingTimeout = 5000;

      const couldNotConnect = setTimeout(() => {
        console.log('ping timeout!');

        dispatch(
          setArchaeologistException(peerId.toString(), {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Ping timeout',
          })
        );
        onComplete();
      }, pingTimeout);

      console.log(`pinging ${peerId.toString()}`);

      const latency = await libp2pNode?.ping(peerId);
      console.log('latency: ', latency);
      libp2pNode?.hangUp(peerId);

      if (!!latency) {
        clearTimeout(couldNotConnect);
        onComplete();
      }
    },
    [libp2pNode, dispatch]
  );

  return {
    dialSelectedArchaeologists,
    pingArchaeologist,
    dialArchaeologist,
  };
}
