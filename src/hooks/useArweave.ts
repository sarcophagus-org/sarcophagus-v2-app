import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { METADATA_SIZE_CHAR_COUNT } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useUploadFileAndKeyShares';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { ArweaveFileMetadata } from './useArweaveService';

export const sharesDelimiter = Buffer.from('~|~', 'binary');

export interface ArweaveResponse {
  metadata: ArweaveFileMetadata;
  keyShares: Record<string, string>;
  fileBuffer: Buffer;
}

function splitPackedDataBuffer(data: Buffer) {
  const payloadBuffer = Buffer.from(data);

  const metadataSizeBuffer = payloadBuffer.slice(0, METADATA_SIZE_CHAR_COUNT);
  const metadataSize = Number.parseInt(metadataSizeBuffer.toString());
  const metadataEnd = metadataSize + METADATA_SIZE_CHAR_COUNT;

  const sharesSplitIndex = payloadBuffer.lastIndexOf(sharesDelimiter);
  if (sharesSplitIndex === -1) throw Error('Bad data');

  const metadataStr = payloadBuffer.slice(METADATA_SIZE_CHAR_COUNT, metadataEnd).toString();
  const metadata = !!metadataStr.trim() ? JSON.parse(metadataStr) : undefined;

  const sharesBuffer = payloadBuffer.slice(metadataEnd, sharesSplitIndex);
  const keyShares = JSON.parse(sharesBuffer.toString());

  const fileBuffer = payloadBuffer.slice(sharesSplitIndex + sharesDelimiter.length);

  return { metadata, keyShares, fileBuffer };
}

function getArweaveFileMetadata(tx: Transaction): ArweaveFileMetadata {
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

  const onDownloadProgress = useCallback((e: any) => {
    const progress = `${((e.loaded / e.total) * 100).toFixed(0)}`;
    console.log(progress);
  }, []);

  const fetchArweaveFileFallback = useCallback(
    async (arweaveTxId: string): Promise<ArweaveResponse | undefined> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        return;
      }

      try {
        const res = await arweave.api.get(`/${arweaveTxId}`, {
          responseType: 'arraybuffer',
          onDownloadProgress,
        });

        const { keyShares, metadata, fileBuffer } = splitPackedDataBuffer(res.data as Buffer);

        return {
          fileBuffer,
          keyShares,
          metadata,
        };
      } catch (error) {
        console.log('error', error);
        throw new Error(`Error fetching arweave file: ${error}`);
      }
    },
    [arweave, onDownloadProgress]
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

        return { metadata, keyShares, fileBuffer };
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
