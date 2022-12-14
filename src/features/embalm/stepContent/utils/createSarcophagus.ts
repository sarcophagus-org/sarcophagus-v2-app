import { ArchaeologistEncryptedShard } from '../../../../types';
import { ethers } from 'ethers';
import { encrypt } from '../../../../lib/utils/helpers';

export async function encryptShardsWithArchaeologistPublicKeys(
  publicKeys: string[],
  keyShares: Uint8Array[]
): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(
    publicKeys.map(async (publicKey, i) => ({
      publicKey,
      encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(keyShares[i]))),
    }))
  );
}

export async function encryptShardsWithRecipientPublicKey(
  publicKey: string,
  keyShares: Uint8Array[]
): Promise<Uint8Array[]> {
  return Promise.all(
    keyShares.map(async (share, i) => {
      return encrypt(publicKey, Buffer.from(keyShares[i]));
    })
  );
}

// Note: ORDER MATTERS HERE
export enum CreateSarcophagusStage {
  NOT_STARTED,
  DIAL_ARCHAEOLOGISTS,
  ARCHAEOLOGIST_NEGOTIATION,
  UPLOAD_PAYLOAD,
  APPROVE,
  SUBMIT_SARCOPHAGUS,
  CLEAR_STATE,
  COMPLETED,
}

export const defaultCreateSarcophagusStages: Record<number, string> = {
  [CreateSarcophagusStage.NOT_STARTED]: '',
  [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]: 'Connect to Archaeologists',
  [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION]: 'Retrieve Archaeologist Signatures',
  [CreateSarcophagusStage.UPLOAD_PAYLOAD]: 'Upload File Data to Arweave',
  [CreateSarcophagusStage.APPROVE]: 'Approve',
  [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS]: 'Create Sarcophagus',
  [CreateSarcophagusStage.CLEAR_STATE]: '',
  [CreateSarcophagusStage.COMPLETED]: '',
};
