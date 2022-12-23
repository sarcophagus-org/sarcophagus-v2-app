import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { createEncryptionKeypairAsync } from '../hooks/useCreateEncryptionKeypair';

interface CreateSarcophagusContextProps {
  outerPrivateKey: string;
  outerPublicKey: string;
  negotiationTimestamp: number;
  setNegotiationTimestamp: React.Dispatch<React.SetStateAction<number>>;
  archaeologistSignatures: Map<string, string>;
  setArchaeologistSignatures: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  archaeologistPublicKeys: Map<string, string>;
  setArchaeologistPublicKeys: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  sarcophagusPayloadTxId: string;
  setSarcophagusPayloadTxId: React.Dispatch<React.SetStateAction<string>>;
  setOuterPrivateKey: React.Dispatch<React.SetStateAction<string>>;
  setOuterPublicKey: React.Dispatch<React.SetStateAction<string>>;
  sarcophagusTxId: string;
  setSarcophagusTxId: React.Dispatch<React.SetStateAction<string>>;
}

const initialCreateSarcophagusState = {
  outerPrivateKey: '',
  outerPublicKey: '',
  negotiationTimestamp: 0,
  archaeologistPublicKeys: new Map<string, string>([]),
  archaeologistSignatures: new Map<string, string>([]),
  sarcophagusPayloadTxId: '',
  sarcophagusTxId: '',
};

const CreateSarcophagusContext = createContext({} as CreateSarcophagusContextProps);

// Global state from embalm steps, used to create sarcophagus
function CreateSarcophagusContextProvider({ children }: { children: ReactNode }) {
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

  const [negotiationTimestamp, setNegotiationTimestamp] = useState(
    initialCreateSarcophagusState.negotiationTimestamp
  );
  const [archaeologistPublicKeys, setArchaeologistPublicKeys] = useState(
    initialCreateSarcophagusState.archaeologistPublicKeys
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
        negotiationTimestamp,
        setNegotiationTimestamp,
        archaeologistPublicKeys,
        setArchaeologistPublicKeys,
        archaeologistSignatures,
        setArchaeologistSignatures,
        sarcophagusPayloadTxId,
        setSarcophagusPayloadTxId,
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
