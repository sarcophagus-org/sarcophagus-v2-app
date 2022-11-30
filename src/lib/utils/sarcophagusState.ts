import { ethers } from 'ethers';
import { SarcophagusResponseContract, SarcophagusState } from 'types';

export const getSarcophagusState = (sarco: SarcophagusResponseContract): SarcophagusState => {
    if (sarco.resurrectionTime.eq(ethers.constants.Zero)) return SarcophagusState.DoesNotExist;
    if (sarco.resurrectionTime.eq(ethers.constants.MaxUint256)) return SarcophagusState.Buried;

    if (sarco.publishedKeyShareCount >= sarco.threshold) return SarcophagusState.Resurrected;
    if (sarco.publishedKeyShareCount > 0) return SarcophagusState.Resurrecting;

    const nowSeconds = Math.trunc(Date.now() / 1000);
    const isPastResurrectionTime = nowSeconds >= sarco.resurrectionTime.toNumber(); // TODO: add grace period
    if (isPastResurrectionTime && !sarco.hasLockedBond) return SarcophagusState.Cleaned;
    if (isPastResurrectionTime) return SarcophagusState.Failed;

    if (sarco.isCompromised) return SarcophagusState.Accused;
    return SarcophagusState.Active;
};
