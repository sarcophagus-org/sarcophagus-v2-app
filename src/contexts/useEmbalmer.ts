// import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useContractRead, useContract, useProvider, useSigner } from 'wagmi';
import { ViewStateFacet__factory, EmbalmerFacet__factory } from '../assets/typechain';
import { ISarcophagus } from '../types/sarcophagi.interfaces';
import useArchaeologistService from '../contexts/useArchaeologistService';

const useEmbalmer = () => {
  const { address: embalmerAddress } = useAccount();
  const provider = useProvider();
  const signer = useSigner();
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
    console.log(console.log(signer.refetch()));
    console.log(signer.data);
    const results = await getEmbalmersarcophagi.refetch();
    const sarcoIds = (results.data as string[]) || [];
    console.log('now2');
    const s = await Promise.all(
      sarcoIds.map(async id => {
        const res = await viewStateContract.getSarcophagus(id);
        const sarcophagus = { ...(res as ISarcophagus), sarcoId: id };
        const confirmations = await getConfirmations(sarcophagus.arweaveTxId);
        return { ...sarcophagus, confirmations: confirmations };
      })
    );
    console.log(s);
    setSarcophagi(s.reverse());
  }

  return { sarcophagi, updateSarcophagi };
};

export default useEmbalmer;
