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
