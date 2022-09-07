import { useToast } from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import { setRecipient, Recipient } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { Page, Text, Image, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import santiize from 'sanitize-filename';
import { generateRecipientKeysAndPDF, generateRecipientPDFFailure } from 'lib/utils/toast';

import { createEncryptionKeypairAsync } from '../useCreateEncryptionKeypair';
import { ethers } from 'ethers';

const document = async (name: string, recipient: Recipient) => {
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
      border: '2px solid black',
      width: '100px',
    },
    imageView: { height: 120, textAlign: 'center', width: '20%' },
    image: { marginHorizontal: '10%', width: 'auto', height: 'auto' },
  });

  const qrCodeOption = { margin: 0 };

  const addressQR = await QRCode.toDataURL(recipient.address, qrCodeOption);
  const publicKeyQR = await QRCode.toDataURL(recipient.publicKey, qrCodeOption);
  const privateKeyQR = await QRCode.toDataURL(recipient.privateKey || '', qrCodeOption);

  return (
    <Document>
      <Page
        size="LETTER"
        style={styles.page}
      >
        <Text>Recipient information for sarcophagus: {name}</Text>
        <Text>
          Note: Keep in a safe location. Anyone with the private key can decrypt the payload.
        </Text>
        <View style={styles.section}>
          <Text>Address:{recipient.address}</Text>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              src={addressQR}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text>Public Key: {recipient.publicKey}</Text>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              src={publicKeyQR}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text>Private Key: {recipient.privateKey}</Text>
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

const generatePdfDocument = async (name: string, recipient: Recipient) => {
  return pdf(await document(name, recipient)).toBlob();
};

export function useCreateRecipientPDF() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { name } = useSelector(x => x.embalmState);
  const [isLoading, setIsLoading] = useState(false);

  const generateAndDownloadRecipientPDF = useCallback(async () => {
    try {
      setIsLoading(true);

      const { privateKey, publicKey } = await createEncryptionKeypairAsync();

      const recipient: Recipient = {
        address: ethers.utils.computeAddress(publicKey),
        publicKey: publicKey,
        privateKey: privateKey,
      };
      dispatch(setRecipient(recipient));

      const pdfBlob = await generatePdfDocument(name, recipient);
      saveAs(pdfBlob, santiize(name + '-' + recipient.address.slice(0, 6) + '.pdf'));

      const id = 'generateRecipientPDF';
      if (!toast.isActive(id)) {
        toast({ ...generateRecipientKeysAndPDF(), id });
      }
    } catch (_error) {
      const error = _error as Error;
      toast(generateRecipientPDFFailure(error.message));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, name, toast]);

  return { isLoading, generateAndDownloadRecipientPDF };
}
