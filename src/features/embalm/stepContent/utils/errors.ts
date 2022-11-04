import { Archaeologist } from '../../../../types';
import { CreateSarcophagusStage } from './createSarcophagus';
import { formatContractCallException } from '../../../../lib/utils/contract-error-handler';

const processArchCommsException = (offendingArchs: Archaeologist[]) => {
  if (!!offendingArchs.length) {
    console.log(
      '',
      offendingArchs.map(
        a => `${a.profile.peerId}:\n ${a.exception!.code}: ${a.exception!.message}`
      )
    );
  }
};

export const createSarcophagusErrors: Record<number, string> = {
  [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]: 'Could not connect to all archaeologists',
  [CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS]: 'Upload Archaeologist Data to Arweave',
  [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION]: 'Retrieve Archaeologist Signatures',
  [CreateSarcophagusStage.UPLOAD_PAYLOAD]: 'Upload File Data to Arweave',
  [CreateSarcophagusStage.APPROVE]: 'Approve',
  [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS]: 'Create Sarcophagus',
  [CreateSarcophagusStage.COMPLETED]: ''
};

export const formatCreateSarcophagusError = (
  sourceStage: CreateSarcophagusStage,
  e: any,
  selectedArchaeologists?: Archaeologist[]
): string => {
  switch (sourceStage) {
    case CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS:
    case CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION:
      const offendingArchs = selectedArchaeologists!.filter(
        arch => arch.exception !== undefined
      );
      processArchCommsException(offendingArchs);
      return e.message;
    case CreateSarcophagusStage.APPROVE:
      return e.reason ? formatContractCallException(e.reason) : 'Failed to approve sarco token allowance.';
    case CreateSarcophagusStage.SUBMIT_SARCOPHAGUS:
      return e.reason ? formatContractCallException(e.reason) : 'Failed to create sarcophagus.';
    default:
      return e.message;
  }
};