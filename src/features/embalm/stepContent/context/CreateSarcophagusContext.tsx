import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { createEncryptionKeypairAsync } from '../hooks/useCreateEncryptionKeypair';
import { useSelector } from '../../../../store';
import { ArchaeologistEncryptedShard } from '../../../../types';

interface CreateSarcophagusContextProps {
  outerPrivateKey: string;
  outerPublicKey: string;
  publicKeysReady: boolean;
  archaeologistShards: ArchaeologistEncryptedShard[];
  setArchaeologistShards: React.Dispatch<React.SetStateAction<ArchaeologistEncryptedShard[]>>;
  encryptedShardsTxId: string;
  setEncryptedShardsTxId: React.Dispatch<React.SetStateAction<string>>;
  negotiationTimestamp: number;
  setNegotiationTimestamp: React.Dispatch<React.SetStateAction<number>>;
  archaeologistSignatures: Map<string, string>;
  setArchaeologistSignatures: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  sarcophagusPayloadTxId: string;
  setSarcophagusPayloadTxId: React.Dispatch<React.SetStateAction<string>>;
}

const CreateSarcophagusContext = createContext({} as CreateSarcophagusContextProps);

function CreateSarcophagusContextProvider({ children }: { children: ReactNode }) {
  // Global state from embalm steps, used to create sarcophagus
  const { selectedArchaeologists } = useSelector(x => x.embalmState);
  const [publicKeysReady, setPublicKeysReady] = useState(false);

  // Sets publicKeysReady to true once all archaeologists have sent their keys
  useEffect(() => {
    if (selectedArchaeologists.length > 0) {
      setPublicKeysReady(selectedArchaeologists.every(arch => !!arch.publicKey));
    }
  }, [selectedArchaeologists]);

  // Generate the outer layer keypair for the sarcophagus.
  const [outerPrivateKey, setOuterPrivateKey] = useState('');
  const [outerPublicKey, setOuterPublicKey] = useState('');

  useEffect(() => {
    (async () => {
      if (outerPrivateKey) {
        return;
      }
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      setOuterPrivateKey(privateKey);
      setOuterPublicKey(publicKey);
    })();
  });

  const [archaeologistShards, setArchaeologistShards] = useState(
    [] as ArchaeologistEncryptedShard[]
  );
  const [encryptedShardsTxId, setEncryptedShardsTxId] = useState('');
  const [negotiationTimestamp, setNegotiationTimestamp] = useState(0);
  const [archaeologistSignatures, setArchaeologistSignatures] = useState(
    new Map<string, string>([])
  );
  const [sarcophagusPayloadTxId, setSarcophagusPayloadTxId] = useState('');

  return (
    <CreateSarcophagusContext.Provider
      value={{
        outerPrivateKey,
        outerPublicKey,
        publicKeysReady,
        archaeologistShards,
        setArchaeologistShards,
        encryptedShardsTxId,
        setEncryptedShardsTxId,
        negotiationTimestamp,
        setNegotiationTimestamp,
        archaeologistSignatures,
        setArchaeologistSignatures,
        sarcophagusPayloadTxId,
        setSarcophagusPayloadTxId,
      }}
    >
      {children}
    </CreateSarcophagusContext.Provider>
  );
}

export { CreateSarcophagusContext, CreateSarcophagusContextProvider };
