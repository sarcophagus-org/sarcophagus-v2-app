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
  setPublicKeysReady: React.Dispatch<React.SetStateAction<boolean>>;
  setOuterPrivateKey: React.Dispatch<React.SetStateAction<string>>;
  setOuterPublicKey: React.Dispatch<React.SetStateAction<string>>;
  sarcophagusTxId: string;
  setSarcophagusTxId: React.Dispatch<React.SetStateAction<string>>;
}

const initialCreateSarcophagusState = {
  publicKeysReady: false,
  outerPrivateKey: '',
  outerPublicKey: '',
  archaeologistShards: [] as ArchaeologistEncryptedShard[],
  encryptedShardsTxId: '',
  negotiationTimestamp: 0,
  archaeologistSignatures: new Map<string, string>([]),
  sarcophagusPayloadTxId: '',
  sarcophagusTxId: '',
};

const CreateSarcophagusContext = createContext({} as CreateSarcophagusContextProps);

function CreateSarcophagusContextProvider({ children }: { children: ReactNode }) {
  // Global state from embalm steps, used to create sarcophagus
  const { selectedArchaeologists } = useSelector(x => x.embalmState);
  const [publicKeysReady, setPublicKeysReady] = useState(
    initialCreateSarcophagusState.publicKeysReady
  );

  // Sets publicKeysReady to true once all archaeologists have sent their keys
  useEffect(() => {
    if (selectedArchaeologists.length > 0) {
      setPublicKeysReady(selectedArchaeologists.every(arch => !!arch.publicKey));
    }
  }, [selectedArchaeologists]);

  // Generate the outer layer keypair for the sarcophagus.
  const [outerPrivateKey, setOuterPrivateKey] = useState(
    initialCreateSarcophagusState.outerPrivateKey
  );
  const [outerPublicKey, setOuterPublicKey] = useState(
    initialCreateSarcophagusState.outerPublicKey
  );

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
    initialCreateSarcophagusState.archaeologistShards
  );
  const [encryptedShardsTxId, setEncryptedShardsTxId] = useState(
    initialCreateSarcophagusState.encryptedShardsTxId
  );
  const [negotiationTimestamp, setNegotiationTimestamp] = useState(
    initialCreateSarcophagusState.negotiationTimestamp
  );
  const [archaeologistSignatures, setArchaeologistSignatures] = useState(
    initialCreateSarcophagusState.archaeologistSignatures
  );
  const [sarcophagusPayloadTxId, setSarcophagusPayloadTxId] = useState(
    initialCreateSarcophagusState.sarcophagusPayloadTxId
  );
  const [sarcophagusTxId, setSarcophagusTxId] = useState(
    initialCreateSarcophagusState.sarcophagusTxId
  );

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
        setPublicKeysReady,
        setOuterPrivateKey,
        setOuterPublicKey,
        sarcophagusTxId,
        setSarcophagusTxId,
      }}
    >
      {children}
    </CreateSarcophagusContext.Provider>
  );
}

export {
  CreateSarcophagusContext,
  CreateSarcophagusContextProvider,
  initialCreateSarcophagusState,
};
