import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { createEncryptionKeypairAsync } from '../hooks/useCreateEncryptionKeypair';

interface CreateSarcophagusContextProps {
  payloadPrivateKey: string;
  payloadPublicKey: string;
  negotiationTimestamp: number;
  setNegotiationTimestamp: React.Dispatch<React.SetStateAction<number>>;
  archaeologistSignatures: Map<string, string>;
  setArchaeologistSignatures: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  archaeologistPublicKeys: Map<string, string>;
  setArchaeologistPublicKeys: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  sarcophagusPayloadTxId: string;
  setSarcophagusPayloadTxId: React.Dispatch<React.SetStateAction<string>>;
  setPayloadPrivateKey: React.Dispatch<React.SetStateAction<string>>;
  setPayloadPublicKey: React.Dispatch<React.SetStateAction<string>>;
  sarcophagusTxId: string;
  setSarcophagusTxId: React.Dispatch<React.SetStateAction<string>>;
}

const initialCreateSarcophagusState = {
  payloadPrivateKey: '',
  payloadPublicKey: '',
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
  const [payloadPrivateKey, setPayloadPrivateKey] = useState(
    initialCreateSarcophagusState.payloadPrivateKey
  );
  const [payloadPublicKey, setPayloadPublicKey] = useState(
    initialCreateSarcophagusState.payloadPublicKey
  );

  useEffect(() => {
    (async () => {
      if (payloadPrivateKey) {
        return;
      }
      const { privateKey, publicKey } = await createEncryptionKeypairAsync();
      setPayloadPrivateKey(privateKey);
      setPayloadPublicKey(publicKey);
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
        payloadPrivateKey,
        payloadPublicKey,
        negotiationTimestamp,
        setNegotiationTimestamp,
        archaeologistPublicKeys,
        setArchaeologistPublicKeys,
        archaeologistSignatures,
        setArchaeologistSignatures,
        sarcophagusPayloadTxId,
        setSarcophagusPayloadTxId,
        setPayloadPrivateKey,
        setPayloadPublicKey,
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
