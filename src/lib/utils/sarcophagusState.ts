import { ethers } from 'ethers';
import { SarcophagusResponse, SarcophagusState } from 'types';

export const getSarcophagusState = (sarco: SarcophagusResponse): SarcophagusState => {
  if (sarco.resurrectionTime.eq(ethers.constants.Zero)) return SarcophagusState.DoesNotExist;
  if (sarco.resurrectionTime.eq(ethers.constants.MaxUint256)) return SarcophagusState.Buried;
  if (sarco.publishedKeyShareCount >= sarco.threshold) return SarcophagusState.Resurrected;
  if (sarco.publishedKeyShareCount > 0) return SarcophagusState.Resurrecting;
  if (sarco.resurrectionTime.toNumber() * 1000 <= Date.now()) return SarcophagusState.Failed;
  if (sarco.isCompromised) return SarcophagusState.Accused;
  if (!sarco.hasLockedBond) return SarcophagusState.Cleaned;
  return SarcophagusState.Active;
};
