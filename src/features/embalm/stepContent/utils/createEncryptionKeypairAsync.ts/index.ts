/**
 * Calls ethers.Wallet.createRandom() on a separate worker thread.
 * Prevents the render from pausing for the wallet to be created.
 * Although it only takes about 250ms to create a wallet on average, the blip is noticeable
 * and leads to a bad user experience, especially if useEffect triggers multiple times.
 *
 * Go to `./worker.js` to see the code run by the worker.
 *
 * @returns A private and public key pair
 */
export async function createEncryptionKeypairAsync(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url));

    // Calls ethers.Wallet.createRandom() in the worker thread
    worker.postMessage({});

    // Listens to response from the worker thread
    worker.addEventListener('message', message => {
      const wallet = message.data;
      const privateKey = wallet.privateKey;
      const publicKey = wallet.publicKey;
      resolve({ privateKey, publicKey });
    });

    worker.addEventListener('error', error => {
      reject(error);
    });
  });
}
