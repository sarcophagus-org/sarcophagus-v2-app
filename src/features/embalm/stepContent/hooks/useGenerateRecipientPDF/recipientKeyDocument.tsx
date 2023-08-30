import { RecipientState } from 'store/embalm/actions';
import { Page, Text, Image, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

import QRCode from 'qrcode';
import BgStripes from 'assets/images/bg-stripes.png';

export const createRecipientKeyDocument = async (name: string, recipient: RecipientState) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      fontFamily: 'Helvetica',
    },
    inset: {
      paddingHorizontal: 25,
      paddingVertical: 19,
    },
    header: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    headerLeft: {
      borderRight: 2,
      padding: 10,
      width: '60%',
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      letterSpacing: 1.2,
    },
    headerRight: {
      paddingTop: 10,
      width: '90%',
      marginLeft: 10,
      fontSize: 6,
      lineHeight: 1.4,
      letterSpacing: 1.2,
    },
    bodyMain: {
      fontSize: 8,
      lineHeight: 1.4,
      letterSpacing: 0.8,
      fontFamily: 'Helvetica-Bold',
      textAlign: 'center',
      width: '65%',
      alignSelf: 'center',
      marginBottom: 20,
    },

    infoSection: {
      flexDirection: 'row',
      marginBottom: 23,
    },
    infoBox: {
      borderWidth: 3,
      flex: 1,
    },
    infoBoxTitle: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 8,
      borderRight: 3,
      borderBottom: 3,
      width: 122,
      padding: 8,
      letterSpacing: 2,
    },
    infoBoxContent: {
      fontSize: 9,
      letterSpacing: 4,
      padding: 12,
    },
    privateKeyBorder: {
      backgroundColor: 'black',
      height: 55,
      color: 'white',
      fontSize: 13,
      textAlign: 'center',
      fontFamily: 'Helvetica-Bold',
      letterSpacing: 1.5,
      paddingTop: 10,
      paddingHorizontal: 80,
    },
    stripeBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
    },
    privateKeyBorderBorder: {
      height: 30,
      position: 'relative',
    },

    imageView: { height: 110, textAlign: 'center', width: '23%' },
    image: {
      backgroundColor: 'grey',
      marginLeft: '10',
      width: 'auto',
      height: 'auto',
    },
  });

  const qrCodeOption = { margin: 0 };

  const addressQR = await QRCode.toDataURL(recipient.address, qrCodeOption);
  const publicKeyQR = await QRCode.toDataURL(recipient.publicKey, qrCodeOption);
  const privateKeyQR = await QRCode.toDataURL(recipient.privateKey || '', qrCodeOption);

  const addressFirstHalf = recipient.address.slice(0, recipient.address.length - 9);
  const addressSecondHalf = recipient.address.slice(
    recipient.address.length - 9,
    recipient.address.length
  );

  const privateKeyFirstHalf = recipient.privateKey?.slice(0, recipient.privateKey.length - 30);
  const privateKeySecondHalf = recipient.privateKey?.slice(
    recipient.privateKey.length - 30,
    recipient.privateKey.length
  );

  const pubKeyFirstHalf = recipient.publicKey.slice(0, recipient.publicKey.length - 87);
  const pubKeySecondHalf = recipient.publicKey.slice(
    recipient.publicKey.length - 87,
    recipient.publicKey.length - 42
  );
  const pubKeyThirdHalf = recipient.publicKey.slice(
    recipient.publicKey.length - 42,
    recipient.publicKey.length
  );

  Font.registerHyphenationCallback(word => [word, '']);

  const bgStripes = (
    <View style={styles.privateKeyBorderBorder}>
      <Image
        style={styles.stripeBackground}
        src={BgStripes}
      />
    </View>
  );

  return (
    <Document>
      <Page
        size="LETTER"
        style={styles.page}
      >
        <View style={styles.inset}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text>RECIPIENT INFORMATION FOR SARCOPHAGUS:</Text>
              <Text style={{ marginTop: 10 }}>{name}</Text>
            </View>

            <View style={styles.headerRight}>
              <Text style={{ marginBottom: 10 }}>
                This wallet was created with the purpose of decrypting the corresponding
                sarcophagus. The following address and keys are the only way to access its contents
                after it has been resurrected.
              </Text>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7 }}>
                PROTECT IT & KEEP STORED IN A SAFE LOCATION.
              </Text>
            </View>
          </View>

          <View style={styles.bodyMain}>
            <Text style={{ marginBottom: 10 }}>Scan the QR code to set up a web3 wallet.</Text>
            <Text>
              Navigate to the sarcophagus.io app and enter the private key to access the Sarcophagus
              after its resurrection date.
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoBox}>
              <View style={styles.infoBoxTitle}>
                <Text>WALLET ADDRESS</Text>
              </View>

              <View style={styles.infoBoxContent}>
                <Text>{addressFirstHalf}</Text>
                <Text>{addressSecondHalf}</Text>
              </View>
            </View>
            <View style={styles.imageView}>
              <Image
                style={styles.image}
                src={addressQR}
              />
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoBox}>
              <View style={styles.infoBoxTitle}>
                <Text>PUBLIC KEY</Text>
              </View>

              <View style={styles.infoBoxContent}>
                <Text>{pubKeyFirstHalf}</Text>
                <Text>{pubKeySecondHalf}</Text>
                <Text>{pubKeyThirdHalf}</Text>
              </View>
            </View>
            <View style={styles.imageView}>
              <Image
                style={styles.image}
                src={publicKeyQR}
              />
            </View>
          </View>
        </View>

        {bgStripes}
        <View style={styles.privateKeyBorder}>
          <Text>
            ANYONE WITH ACCESS TO PRIVATE KEY CAN ACCESS THE CONTENTS OF THIS SARCOPHAGUS.
          </Text>
        </View>

        <View style={styles.inset}>
          <View style={styles.infoSection}>
            <View style={styles.infoBox}>
              <View style={styles.infoBoxTitle}>
                <Text>PRIVATE KEY</Text>
              </View>
              <View style={styles.infoBoxContent}>
                <Text>{privateKeyFirstHalf}</Text>
                <Text>{privateKeySecondHalf}</Text>
              </View>
            </View>

            <View style={styles.imageView}>
              <Image
                style={styles.image}
                src={privateKeyQR}
              />
            </View>
          </View>
        </View>

        <View style={styles.privateKeyBorder}>
          <Text>
            ANYONE WITH ACCESS TO PRIVATE KEY CAN ACCESS THE CONTENTS OF THIS SARCOPHAGUS.
          </Text>
        </View>
        {bgStripes}
      </Page>
    </Document>
  );
};
