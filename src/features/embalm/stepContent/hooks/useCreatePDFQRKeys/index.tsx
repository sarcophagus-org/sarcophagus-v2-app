import { useToast } from '@chakra-ui/react';
import { useState, useCallback, useEffect } from 'react';
import { setRecipient } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Page, Text, Image, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';
import { useQRCode } from './useQRCode';
import { update } from 'lodash';

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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

function MyDocument(publicKey: string) {
  //console.log('my document run');
  const publicKeyQR = useQRCode(publicKey || '');
  //const privateKeyQR = useQRCode(recipient.privateKey || '');

  console.log('genPDF', publicKey);

  const doc = (
    <Document>
      <Page
        size="LETTER"
        style={styles.page}
      >
        <View style={styles.section}>
          <Text>Public Key:</Text>
          <Text>2:{publicKey}</Text>
          <Image src={publicKeyQR} />
        </View>
        <View style={styles.section}>
          <Text>Private Key:</Text>
          {/* <Text>{recipient.privateKey}</Text> */}
          {/* <Image src={privateKeyQR} /> */}
        </View>
      </Page>
    </Document>
  );

  return doc;
}

export function useCreatePDFQRKeys() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { recipient } = useSelector(x => x.embalmState);
  const [isLoading, setIsLoading] = useState(false);

  const [pdf, updatePDF] = usePDF({ document: MyDocument(recipient.publicKey) });

  const createEncryptionKeypair = useCallback(async () => {
    try {
      setIsLoading(true);
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      console.log('gen', publicKey);
      dispatch(setRecipient({ address: '', privateKey: privateKey, publicKey: publicKey })); //TODO lookup address
    } catch (_error) {
      console.error(_error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    console.log('useEffect', recipient.publicKey);
    updatePDF();
  }, [recipient]);

  useEffect(() => {
    if (!pdf.loading) window.open(pdf.url || '', '_blank');
  }, [pdf.loading]);

  return { isLoading, createEncryptionKeypair };
}
