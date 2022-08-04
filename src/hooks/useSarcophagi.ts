// import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useContract, useContractRead, useProvider } from 'wagmi';
import { ViewStateFacet__factory } from '../typechain';
import { ISarcophagus } from '../types/sarcophagi.interfaces';
import useArchaeologistService from './useArchaeologistService';

const useSarcophagi = () => {
  const { address: embalmerAddress } = useAccount();
  const provider = useProvider();
  const [sarcophagi, setSarcophagi] = useState<ISarcophagus[]>([]);
  const { getConfirmations } = useArchaeologistService();

  const viewStateContract = useContract({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet__factory.abi,
    signerOrProvider: provider,
  });

  const getEmbalmersarcophagi = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet__factory.abi,
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
        const confirmations = await getConfirmations(sarcophagus.arweaveTxId);
        return { ...sarcophagus, confirmations: confirmations };
      })
    );
    return setSarcophagi(s.reverse());
  }

  return { sarcophagi, updateSarcophagi };
};

export default useSarcophagi;
