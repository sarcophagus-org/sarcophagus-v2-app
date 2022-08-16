// import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useContract, useContractRead, useProvider } from 'wagmi';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { ISarcophagus } from 'types/sarcophagi.interfaces';
import { useNetworkConfig } from 'lib/config';

const useSarcophagi = () => {
  const { address: embalmerAddress } = useAccount();
  const provider = useProvider();
  const [sarcophagi, setSarcophagi] = useState<ISarcophagus[]>([]);
  const networkConfig = useNetworkConfig();

  const viewStateContract = useContract({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    signerOrProvider: provider,
  });

  const getEmbalmersarcophagi = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getEmbalmersarcophagi',
    args: [embalmerAddress],
  });

  async function updateSarcophagi() {
    const results = await getEmbalmersarcophagi.refetch();
    const sarcoIds = (results.data as string[]) || [];
    const s = await Promise.all(
      sarcoIds.map(async id => {
        const res = await viewStateContract.getSarcophagus(id);
        const sarcophagus = { ...(res as ISarcophagus), sarcoId: id };
        return { ...sarcophagus };
      })
    );
    return setSarcophagi(s.reverse());
  }

  return { sarcophagi, updateSarcophagi };
};

export default useSarcophagi;
