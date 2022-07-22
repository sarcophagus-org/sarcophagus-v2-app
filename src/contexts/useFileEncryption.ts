import { useState, useEffect, useCallback } from 'react';
import { encrypt } from 'ecies-geth';
import { utils } from 'ethers';

const useFileEncryption = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileByteArray, setFileByteArrayArray] = useState<ArrayBuffer | string | null>(null);
  const [fileEncryptedRecipient, setFileEncryptedRecipient] = useState<Buffer | null>(null);
  const [recipientPublicKey, setRecipientPublicKey] = useState<string | null>(null);
  const [doubleEncryptedFile, setDoubleEncryptedFile] = useState<Buffer | null>(null);
  const [randomPublicKey, setRandomPublicKey] = useState<string>('');

  function hexToBytes(hex: string, pad = false) {
    let byteArray = utils.arrayify(hex);
    if (pad) {
      let padByte = new Uint8Array([4]);
      return Buffer.from(new Uint8Array([...padByte, ...byteArray]));
    } else {
      return Buffer.from(byteArray);
    }
  }

  const firstEncryption = useCallback(async () => {
    try {
      //todo - rewrite verify public key to use less code and not substr
      let formattedPublicKey;
      if (recipientPublicKey?.substr(0, 4) !== '0x04') {
        formattedPublicKey = '0x04' + recipientPublicKey;
      }
      const keyToUse = formattedPublicKey
        ? formattedPublicKey
        : recipientPublicKey
        ? recipientPublicKey
        : '';

      const recipPubKeyBytes = hexToBytes(keyToUse, true).slice(1);
      const encrypted = await encrypt(recipPubKeyBytes, fileByteArray as Buffer);
      setFileEncryptedRecipient(encrypted);

      //   const hashedOnce = utils.keccak256(encrypted);
      //   const hashedTwice = utils.keccak256(hashedOnce);
      //   setAssetDoubleHash(utils.arrayify(hashedTwice));
    } catch (e) {
      console.error(e);
    }
  }, [recipientPublicKey, fileByteArray]);

  const secondEncryption = useCallback(async () => {
    try {
      const randomPublicKeyBytes = hexToBytes(randomPublicKey, true).slice(1);
      const encrypted = await encrypt(randomPublicKeyBytes, fileEncryptedRecipient as Buffer);
      setDoubleEncryptedFile(encrypted);
    } catch (e) {
      console.error(e);
    }
  }, [fileEncryptedRecipient, randomPublicKey]);

  useEffect(() => {
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (!result) return;
        setFileByteArrayArray(result);
      };
    } catch (e) {
      console.error(e);
    }
  }, [file]);

  useEffect(() => {
    if (!fileByteArray || !recipientPublicKey) return;
    firstEncryption();
  }, [fileByteArray, recipientPublicKey, firstEncryption]);

  useEffect(() => {
    if (!fileEncryptedRecipient || !randomPublicKey) return;
    secondEncryption();
  }, [fileEncryptedRecipient, randomPublicKey, secondEncryption]);

  return {
    file,
    setFile,
    recipientPublicKey,
    setRecipientPublicKey,
    fileEncryptedRecipient,
    setRandomPublicKey,
    doubleEncryptedFile,
  };
};

export default useFileEncryption;
