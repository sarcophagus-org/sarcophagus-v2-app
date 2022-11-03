import Arweave from 'arweave';
import { decrypt } from 'ecies-geth';
import { utils } from 'ethers';

export const initArweave = () => {
  return Arweave.init({
    host: 'arweave.net', // Hostname or IP address for a Arweave host
    port: 443, // Port
    protocol: 'https', // 'https', // Network protocol http or https
    timeout: 20000, // Network request timeouts in milliseconds
    logging: false, // Enable network request logging
  });
};

export const fetchArweaveFileFallback = async (arweaveTxId: string): Promise<any> => {
  try {
    const arweave = initArweave();
    const res = await arweave.api.get(`/${arweaveTxId}`, {
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (error) {
    throw new Error(`Error fetching arweave file: ${error}`);
  }
};

export const fetchArweaveFile = async (arweaveTxId: string): Promise<Uint8Array> => {
  try {
    const arweave = initArweave();
    const data = await arweave.transactions.getData(arweaveTxId);

    return data as Uint8Array;
  } catch (error) {
    throw new Error(`Error fetching arweave file: ${error}`);
  }
};

export const decryptArweaveFile = async (data: Uint8Array, privateKey: string): Promise<Buffer> => {
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
