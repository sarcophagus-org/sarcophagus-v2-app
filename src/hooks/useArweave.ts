import Arweave from 'arweave';
import { decrypt } from 'ecies-geth';
import { utils } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';

export function useArweave() {
  const { arweaveConfig } = useNetworkConfig();
  const [arweave, setArweave] = useState<Arweave>();

  useEffect(
    () => {
      if (arweaveConfig.host) {
        setArweave(Arweave.init(arweaveConfig));
      } else {
        setArweave(undefined);
      }
    },
    [arweaveConfig]
  );

  const arweaveNotReadyMsg = 'Arweave instance not ready!';

  const fetchArweaveFileFallback = useCallback(
    async (arweaveTxId: string): Promise<any> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        return;
      }

      try {
        const res = await arweave.api.get(`/${arweaveTxId}`, {
          responseType: 'arraybuffer',
        });
        return res.data;
      } catch (error) {
        throw new Error(`Error fetching arweave file: ${error}`);
      }
    },
    [arweave]
  );

  const fetchArweaveFile = useCallback(
    async (arweaveTxId: string): Promise<Uint8Array | undefined> => {
      if (!arweave) {
        console.error(arweaveNotReadyMsg);
        return;
      }

      try {
        const data = await arweave.transactions.getData(arweaveTxId);

        return data as Uint8Array;
      } catch (error) {
        throw new Error(`Error fetching arweave file: ${error}`);
      }
    },
    [arweave]
  );

  const decryptArweaveFile = async (data: Uint8Array, privateKey: string): Promise<Buffer> => {
    const privateKeyAsBytes = Buffer.from(utils.arrayify(privateKey));

    const outerDecrypt = await decrypt(privateKeyAsBytes, Buffer.from(data));

    const innerDecrypt = await decrypt(
      Buffer.from(
        utils.arrayify('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') // TODO: innerDecrypt using default address and private key for testing instead of real recipient
      ),
      outerDecrypt
    );
    return innerDecrypt;
  };

  return {
    arweave,
    fetchArweaveFileFallback,
    fetchArweaveFile,
    decryptArweaveFile,
  };
}
