import { useState, useEffect, useCallback } from 'react';
import { encrypt } from 'ecies-geth';
import { utils } from 'ethers';

const useFileEncryption = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileByteArray, setFileByteArrayArray] = useState<ArrayBuffer | string | null>(null);
  const [fileEncryptedRecipient, setFileEncryptedRecipient] = useState<Buffer | null>(null);
  const [recipientPublicKey, setRecipientPublicKey] = useState<string | null>(
    '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
  );
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
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
      const formattedPublicKey = recipientPublicKey?.startsWith('0x04')
        ? recipientPublicKey
        : '0x04' + recipientPublicKey;

      const recipientPublicKeyBytes = hexToBytes(formattedPublicKey, true).slice(1);
      const encrypted = await encrypt(recipientPublicKeyBytes, fileByteArray as Buffer);
      setFileEncryptedRecipient(encrypted);
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
    try {
      const formattedPublicKey = recipientPublicKey?.startsWith('0x04')
        ? recipientPublicKey
        : '0x04' + recipientPublicKey;

      setRecipientAddress(
        formattedPublicKey ? utils.computeAddress(formattedPublicKey || '') : null
      );
    } catch {
      setRecipientAddress(null);
    }
  }, [recipientPublicKey]);

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
    recipientAddress,
    fileEncryptedRecipient,
    setRandomPublicKey,
    doubleEncryptedFile,
  };
};

export default useFileEncryption;
