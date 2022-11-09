import { useState } from 'react';
import { useAccount, useContract, useContractRead, useProvider } from 'wagmi';
import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { ISarcophagus } from 'types/sarcophagi.interfaces';
import { useNetworkConfig } from 'lib/config';

const useSarcophagi = () => {
  const { address: embalmerAddress } = useAccount();
  const provider = useProvider();
  const [sarcophagi, setSarcophagi] = useState<ISarcophagus[]>([]);
  const networkConfig = useNetworkConfig();

  const viewStateContract = useContract({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    signerOrProvider: provider,
  });

  const getEmbalmerSarcophagi = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getEmbalmerSarcophagi',
    args: [embalmerAddress],
  });

  async function updateSarcophagi() {
    const results = await getEmbalmerSarcophagi.refetch();
    const sarcoIds = (results.data as string[]) || [];

    const sarcosWithId = await Promise.all(
      sarcoIds.map(async id => {
        const res = await viewStateContract!.getSarcophagus(id);
        const sarcophagus = { ...(res as ISarcophagus), sarcoId: id };
        return { ...sarcophagus };
      })
    );

    return setSarcophagi(sarcosWithId.reverse());
  }

  return { sarcophagi, updateSarcophagi };
};

export default useSarcophagi;
