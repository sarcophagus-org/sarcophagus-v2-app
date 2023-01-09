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

  const customGetTx = useCallback(
    async (id: string): Promise<Transaction> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        throw Error(arweaveNotReadyMsg);
      }

      const response = await arweave.api.get(`tx/${id}`, {
        onDownloadProgress,
      });
      console.log('response', response);

      if (response.status == 200) {
        const dataSize = parseInt(response.data.data_size);

        if (response.data.format >= 2 && dataSize > 0 && dataSize <= 1024 * 1024 * 12) {
          const data = await arweave.transactions.getData(id);
          return new Transaction({
            ...response.data,
            data,
          });
        }

        return new Transaction({
          ...response.data,
          format: response.data.format || 1,
        });
      }
      if (response.status == 404) {
        throw Error('TX_NOT_FOUND' /* ArweaveErrorType.TX_NOT_FOUND */);
      }
      if (response.status == 410) {
        throw Error('TX_FAILED' /* ArweaveErrorType.TX_FAILED */);
      }
      throw Error('TX_INVALID' /* ArweaveErrorType.TX_INVALID */);
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
        // const tx = await arweave.transactions.get(arweaveTxId);
        const tx = await customGetTx(arweaveTxId);
        console.log('tx', tx);

        let metadata = getArweaveFileMetadata(tx);
        const { keyShares, fileBuffer } = splitPackedDataBuffer(tx.data as Buffer);

        return { metadata, keyShares, fileBuffer };
      } catch (error) {
        throw new Error(`Error fetching arweave file: ${error}`);
      }
    },
    [arweave, customGetTx]
  );

  return {
    arweave,
    fetchArweaveFileFallback,
    fetchArweaveFile,
  };
}
