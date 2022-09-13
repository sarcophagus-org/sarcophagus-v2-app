import { useContractRead } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { ViewStateFacet } from 'lib/abi/ViewStateFacet';
import { useNetworkConfig } from 'lib/config';
import { ArchaeologistProfile } from 'types';
import { useAsyncEffect } from 'hooks/useAsyncEffect';
import { useDispatch } from '../../store';
import { startLoad, stopLoad } from 'store/app/actions';
import { storeArchaeologists } from 'store/archaeologist/actions';

export function useGetArchaeologistProfiles() {
  const networkConfig = useNetworkConfig();
  const dispatch = useDispatch();

  dispatch(startLoad());
  const { data: addresses, isLoading: loadingAddresses } = useContractRead({
    addressOrName: networkConfig.diamondDeployAddress,
    contractInterface: ViewStateFacet.abi,
    functionName: 'getArchaeologistProfileAddresses',
  });

  // const config: ReadContractsConfig = { contracts: [] };
  let profiles: ArchaeologistProfile[] = [];

  useAsyncEffect(async () => {
    if (!loadingAddresses && addresses) {
      // TODO: Having to do single use `readContract`s in a loop because `useContractReads` does not work in hardhat
      for await (const addr of addresses) {

        console.log('addresses', addresses[0]);
        console.log('addr', addr);

        const profile = await readContract({
          addressOrName: networkConfig.diamondDeployAddress,
          contractInterface: ViewStateFacet.abi,
          functionName: 'getArchaeologistProfile',
          args: [addr],
        });

        console.log('profile', profile);

        if (profile) {
          profiles.push({
            archAddress: addr,
            exists: profile.exists,
            minimumDiggingFee: profile.minimumDiggingFee,
            maximumRewrapInterval: profile.maximumRewrapInterval,
            peerId: profile.peerId,
          });
        }

        // config.contracts.push({
        //   addressOrName: networkConfig.diamondDeployAddress,
        //   contractInterface: ViewStateFacet.abi,
        //   functionName: 'getArchaeologistProfile',
        //   args: [addr],
        // });
      }

      const archaeologists = profiles.map(profile => ({ profile, isOnline: false }));

      dispatch(storeArchaeologists(archaeologists));
      dispatch(stopLoad());
    }

  }, [loadingAddresses, addresses]);

  // const { data, isLoading: loadingProfiles } = useContractReads(config);
  // profiles = data?.map((d, i) => ({
  //   archAddress: addresses![i],
  //   exists: d.exists,
  //   minimumDiggingFee: d.minimumDiggingFee,
  //   maximumRewrapInterval: d.maximumRewrapInterval,
  //   peerId: d.peerId,
  // })) ?? [];
}
