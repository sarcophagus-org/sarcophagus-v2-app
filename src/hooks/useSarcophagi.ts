// import { ethers } from 'ethers';
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
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet__factory.abi,
    signerOrProvider: provider,
  });

  const getEmbalmersarcophagi = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet__factory.abi,
    functionName: 'getEmbalmersarcophagi',
    args: [embalmerAddress],
  });

  async function updateSarcophagi() {
    console.log('start', embalmerAddress);
    const results = await getEmbalmersarcophagi.refetch();
    console.log('results', results);
    //const sarcoIds = (results.data as string[]) || [];
    const sarcoIds = ['0xa5abc2cd280c9cab5f4ea0e01dd7b0881a5d1bb473b4e2de888c33bbcc2f9113'];
    console.log('results', results, sarcoIds);
    const s = await Promise.all(
      sarcoIds.map(async id => {
        const res = await viewStateContract.getSarcophagus(id);
        const sarcophagus = { ...(res as ISarcophagus), sarcoId: id };
        return { ...sarcophagus };
      })
    );
    console.log(s);
    return setSarcophagi(s.reverse());
  }

  return { sarcophagi, updateSarcophagi };
};

export default useSarcophagi;
