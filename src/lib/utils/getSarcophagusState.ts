import { ethers } from 'ethers';
import { SarcophagusResponseContract, SarcophagusState } from 'types';

export const getSarcophagusState = (
  sarco: SarcophagusResponseContract,
  gracePeriod: number
): SarcophagusState => {
  if (sarco.resurrectionTime.eq(ethers.constants.Zero)) return SarcophagusState.DoesNotExist;
  if (sarco.resurrectionTime.eq(ethers.constants.MaxUint256)) return SarcophagusState.Buried;

  const nowSeconds = Math.trunc(Date.now() / 1000);
  const withinGracePeriod =
    nowSeconds >= sarco.resurrectionTime.toNumber() &&
    nowSeconds < sarco.resurrectionTime.toNumber() + gracePeriod;

  if (withinGracePeriod) return SarcophagusState.Resurrecting;

  const isPastGracePeriod = nowSeconds >= sarco.resurrectionTime.toNumber() + gracePeriod;
  const isCleaned = isPastGracePeriod && !sarco.hasLockedBond;

  if (sarco.publishedKeyShareCount >= sarco.threshold)
    return isCleaned ? SarcophagusState.CleanedResurrected : SarcophagusState.Resurrected;

  if (isPastGracePeriod)
    return isCleaned ? SarcophagusState.CleanedFailed : SarcophagusState.Failed;

  if (sarco.isCompromised) return SarcophagusState.Accused;
  return SarcophagusState.Active;
};
