import Arweave from 'arweave';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';
import { ArweaveFileMetadata } from './useArweaveService';

export const arweaveDataDelimiter = Buffer.from('|', 'binary');

export interface ArweaveResponse {
  metadata: ArweaveFileMetadata;
  keyShares: Record<string, string>;
  fileBuffer: Buffer;
}

function splitPackedDataBuffer(concatenatedBuffer: Buffer): ArweaveResponse {
  // Concatenated buffer is formatted as:
  // <meta_buffer_length>
  //   <delimiter>
  // <keyshare_buffer_length>
  //   <delimiter>
  // <metatadata>
  // <keyshares>
  // <payload>

  concatenatedBuffer = Buffer.from(concatenatedBuffer);

  // Delimiter after metatdata length
  const firstDelimiterIndex = concatenatedBuffer.indexOf(arweaveDataDelimiter);
  const metadataLength = Number.parseInt(
    concatenatedBuffer.slice(0, firstDelimiterIndex).toString('binary')
  );

  // Delimiter after keyshare length
  const secondDelimiterIndex = concatenatedBuffer.indexOf(
    arweaveDataDelimiter,
    firstDelimiterIndex + 1
  );
  const keyshareLength = Number.parseInt(
    concatenatedBuffer.slice(firstDelimiterIndex + 1, secondDelimiterIndex).toString('binary')
  );

  // metadata
  const metadataStr = concatenatedBuffer
    .slice(secondDelimiterIndex + 1, secondDelimiterIndex + 1 + metadataLength)
    .toString('binary');

  const metadata = JSON.parse(metadataStr);

  // keyshares
  const sharesBuffer = concatenatedBuffer
    .slice(
      secondDelimiterIndex + metadataLength + 1,
      secondDelimiterIndex + 1 + metadataLength + keyshareLength
    )
    .toString('binary');

  const keyShares = JSON.parse(sharesBuffer.toString().trim());

  // payload
  const fileBuffer = concatenatedBuffer.slice(
    secondDelimiterIndex + 1 + metadataLength + keyshareLength
  );

  return { metadata, keyShares, fileBuffer };
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

  const [downloadProgress, setDownloadProgress] = useState(0);

  const onDownloadProgress = useCallback((e: any) => {
    const progress = Math.trunc((e.loaded / e.total) * 100);
    setDownloadProgress(progress);
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

        setDownloadProgress(0);

        const { metadata, keyShares, fileBuffer } = splitPackedDataBuffer(res.data as Buffer);

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
    async (id: string): Promise<any> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        throw Error(arweaveNotReadyMsg);
      }

      const response = await arweave.api.get(`${id}`, {
        responseType: 'arraybuffer',
        onDownloadProgress,
      });

      if (response.status == 200) {
        const dataSize = parseInt(response.data.data_size);

        if (response.data.format >= 2 && dataSize > 0 && dataSize <= 1024 * 1024 * 12) {
          const data = await arweave.transactions.getData(id);
          return {
            ...response.data,
            data,
          };
        }

        return {
          ...response.data,
          format: response.data.format || 1,
        };
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
        const tx = await customGetTx(arweaveTxId);
        console.log('tx', tx);

        setDownloadProgress(0);

        const { metadata, keyShares, fileBuffer } = splitPackedDataBuffer(tx.data as Buffer);

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
    downloadProgress,
  };
}
