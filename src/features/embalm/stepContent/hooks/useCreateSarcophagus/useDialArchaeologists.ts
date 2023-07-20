import { useCallback } from 'react';
import { setArchaeologistConnection, setArchaeologistException } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../../../../../store';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { createSarcophagusErrors } from '../../utils/errors';
import { Connection } from '@libp2p/interface-connection';
import { CancelCreateToken } from './useCreateSarcophagus';
import { wait } from 'lib/utils/helpers';
import { sarco, ArchaeologistData } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

// TODO: Move this to sdk. Having trouble exporting enums from the sdk
export enum ArchaeologistExceptionCode {
  CONNECTION_EXCEPTION = 'connection_exception',
  STREAM_EXCEPTION = 'stream_exception',
  DECLINED_SIGNATURE = 'declined_signature',
}

export function useDialArchaeologists() {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const dialArchaeologist = useCallback(
    async (arch: ArchaeologistData) => {
      const peerIdString = arch.profile.peerId;
      try {
        const connection = await sarco.archaeologist.dialArchaeologist(arch);
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
    [dispatch]
  );

  const dialSelectedArchaeologists = useCallback(
    async (_: any, cancelToken: CancelCreateToken) => {
      const MAX_RETRIES = 5;
      const WAIT_BETWEEN_RETRIES = 300;

      const dialArchaeologistWithRetry = async (
        dialFn: Function,
        depth = 0
      ): Promise<Connection> => {
        if (cancelToken.cancelled) {
          throw new Error('Cancelled');
        }

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
          const connection = await dialArchaeologistWithRetry(() =>
            sarco.archaeologist.dialArchaeologist(arch)
          );
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
    },
    [selectedArchaeologists, dispatch]
  );

  return {
    dialSelectedArchaeologists,
    dialArchaeologist,
  };
}
