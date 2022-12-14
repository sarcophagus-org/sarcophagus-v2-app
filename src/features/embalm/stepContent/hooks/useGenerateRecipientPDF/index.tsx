import { useState, useCallback } from 'react';
import {
  setRecipientState,
  RecipientState,
  GeneratePDFState,
  RecipientSetByOption,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Page, Text, Image, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import sanitize from 'sanitize-filename';
import { createEncryptionKeypairAsync } from '../useCreateEncryptionKeypair';
import { ethers } from 'ethers';

const document = async (name: string, recipient: RecipientState) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      margin: 25,
      fontSize: 11,
    },
    section: {
      margin: 5,
      padding: 0,
      flexGrow: 1,
    },
    imageView: { height: 120, textAlign: 'center', width: '20%' },
    image: { marginHorizontal: '10%', width: 'auto', height: 'auto' },
    title: { fontWeight: 'extrabold', fontSize: 16, marginBottom: 10 },
    note: { marginBottom: 20 },
  });

  const qrCodeOption = { margin: 0 };

  const addressQR = await QRCode.toDataURL(recipient.address, qrCodeOption);
  const publicKeyQR = await QRCode.toDataURL(recipient.publicKey, qrCodeOption);
  const privateKeyQR = await QRCode.toDataURL(recipient.privateKey || '', qrCodeOption);

  const pubKeyFirstHalf = recipient.publicKey.slice(0, recipient.publicKey.length - 50);
  const pubKeySecondHalf = recipient.publicKey.slice(
    recipient.publicKey.length - 50,
    recipient.publicKey.length
  );

  return (
    <Document>
      <Page
        size="LETTER"
        style={styles.page}
      >
        <Text style={styles.title}>Recipient information for sarcophagus: {name}</Text>
        <Text style={styles.note}>
          Note: Keep in a safe location! Anyone with this private key can decrypt the payload.
        </Text>

        <View style={styles.section}>
          <Text>Address: {recipient.address}</Text>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              src={addressQR}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text>Public Key:</Text>
          <Text>{pubKeyFirstHalf}</Text>
          <Text>{pubKeySecondHalf}</Text>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              src={publicKeyQR}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text>Private Key:</Text>
          <Text>{recipient.privateKey}</Text>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              src={privateKeyQR}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};

const generatePdfDocument = async (name: string, recipient: RecipientState) => {
  return pdf(await document(name, recipient)).toBlob();
};

export function useGenerateRecipientPDF() {
  const dispatch = useDispatch();
  const { name, recipientState } = useSelector(x => x.embalmState);
  const [isLoading, setIsLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const generatePublicKey = useCallback(async () => {
    try {
      setIsLoading(true);
      setGenerateError(null);

      const { privateKey, publicKey } = await createEncryptionKeypairAsync();

      const recipient: RecipientState = {
        address: ethers.utils.computeAddress(publicKey),
        publicKey: publicKey,
        privateKey: privateKey,
        setByOption: RecipientSetByOption.GENERATE,
        generatePDFState: GeneratePDFState.GENERATED,
      };
      dispatch(setRecipientState(recipient));
      setIsLoading(false);
    } catch (_error) {
      dispatch(
        setRecipientState({
          address: '',
          publicKey: '',
          setByOption: RecipientSetByOption.GENERATE,
        })
      );
      const error = _error as Error;
      setGenerateError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const downloadRecipientPDF = useCallback(async () => {
    try {
      setIsLoading(true);
      setGenerateError(null);

      const pdfBlob = await generatePdfDocument(name, recipientState);
      saveAs(pdfBlob, sanitize(name + '-' + recipientState.address.slice(0, 6) + '.pdf'));

      // TODO: need to refactor RecipientState so that we can just set GenerateState without setting the whole recipient
      const newRecipientState: RecipientState = {
        address: recipientState.address,
        publicKey: recipientState.publicKey,
        privateKey: recipientState.privateKey,
        setByOption: recipientState.setByOption,
        generatePDFState: GeneratePDFState.DOWNLOADED,
      };

      dispatch(setRecipientState(newRecipientState));
    } catch (_error) {
      dispatch(
        setRecipientState({
          address: '',
          publicKey: '',
          setByOption: RecipientSetByOption.GENERATE,
        })
      );
      const error = _error as Error;
      setGenerateError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, name, recipientState]);

  return { isLoading, downloadRecipientPDF, generatePublicKey, generateError };
}
