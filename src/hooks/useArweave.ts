import Arweave from 'arweave';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { ArweaveFileMetadata } from './useArweaveService';

export const metadataDelimiter = Buffer.from('|', 'binary');
export const sharesDelimiter = Buffer.from('~', 'binary');

export interface ArweaveResponse {
  data: Uint8Array;
  metadata: ArweaveFileMetadata;
  keyShares: Record<string, string>;
  fileBuffer: Buffer;
}

function splitPackedDataBuffer(data: Buffer) {
  const payloadBuffer = Buffer.from(data);
  const metadataSplitIndex = payloadBuffer.findIndex(char => char === metadataDelimiter[0]);
  const sharesSplitIndex = payloadBuffer.findIndex(char => char === sharesDelimiter[0]);

  if (metadataSplitIndex === -1) throw Error('Bad data');

  const metadataStr = payloadBuffer.slice(0, metadataSplitIndex).toString();
  const metadata = !!metadataStr.trim() ? JSON.parse(metadataStr) : undefined;

  const sharesBuffer = payloadBuffer.slice(metadataSplitIndex + 1, sharesSplitIndex);
  const keyShares = JSON.parse(sharesBuffer.toString());

  const fileBuffer = payloadBuffer.slice(sharesSplitIndex + 1);

  return { keyShares, fileBuffer, metadata };
}

function getArweaveFileMetadata(tx: any): ArweaveFileMetadata {
  // @ts-ignore
  const metadataTag = tx.get('tags').find(tag => {
    let key = tag.get('name', { decode: true, string: true });
    return key === 'metadata';
  });

  return JSON.parse(metadataTag.get('value', { decode: true, string: true }));
}

export function useArweave() {
  const { arweaveConfig } = useNetworkConfig();
  const [arweave, setArweave] = useState<Arweave>();

  useEffect(() => {
    if (arweaveConfig.host) {
      setArweave(Arweave.init(arweaveConfig));
    } else {
      setArweave(undefined);
    }
  }, [arweaveConfig]);

  const arweaveNotReadyMsg = 'Arweave instance not ready!';

  const fetchArweaveFileFallback = useCallback(
    async (arweaveTxId: string): Promise<ArweaveResponse | undefined> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        return;
      }

      try {
        console.log('api call');

        const res = await arweave.api.get(`/${arweaveTxId}`, {
          responseType: 'arraybuffer',
        });
        console.log('api call done');

        const { keyShares, metadata, fileBuffer } = splitPackedDataBuffer(res.data as Buffer);

        return {
          data: res.data,
          fileBuffer,
          keyShares,
          metadata,
        };
      } catch (error) {
        console.log('error', error);

        throw new Error(`Error fetching arweave file: ${error}`);
      }
    },
    [arweave]
  );

  const fetchArweaveFile = useCallback(
    async (arweaveTxId: string): Promise<ArweaveResponse | undefined> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        return;
      }

      try {
        const tx = await arweave.transactions.get(arweaveTxId);
        let metadata = getArweaveFileMetadata(tx);
        const { keyShares, fileBuffer } = splitPackedDataBuffer(tx.data as Buffer);

        return { data: tx.data, metadata, keyShares, fileBuffer };
      } catch (error) {
        throw new Error(`Error fetching arweave file: ${error}`);
      }
    },
    [arweave]
  );

  return {
    arweave,
    fetchArweaveFileFallback,
    fetchArweaveFile,
  };
}
