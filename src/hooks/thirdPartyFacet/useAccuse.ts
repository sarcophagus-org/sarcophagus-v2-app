import { useToast } from '@chakra-ui/react';
import { ThirdPartyFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { Abi } from 'abitype';
import { Signature } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useNetworkConfig } from 'lib/config';
import { isBytes32 } from 'lib/utils/helpers';
import { accuseFailure, accuseSuccess } from 'lib/utils/toast';
import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

export function useAccuse(
  sarcoId: string,
  publicKeys: string[],
  signatures: Signature[],
  paymentAddress: string | undefined
) {
  const networkConfig = useNetworkConfig();
  const toast = useToast();

  // Validate the inputs
  const enabled =
    isBytes32(sarcoId) && signatures.length > 0 && !!paymentAddress && isAddress(paymentAddress);

  // Include only v, r, and s in the signature elements
  const signaturesVrs = signatures.map(sig => ({ v: sig.v, r: sig.r, s: sig.s }));

  const { config, isError } = usePrepareContractWrite({
    address: networkConfig.diamondDeployAddress,
    abi: ThirdPartyFacet__factory.abi as Abi,
    functionName: 'accuse',
    enabled,
    args: [sarcoId, publicKeys, signaturesVrs, paymentAddress],
  });

  // Wagmi is for some reason unable to track when write has been called
  const [isAccusing, setIsAccusing] = useState(false);

  const { write, data } = useContractWrite({
    ...config,
    onError() {
      setIsAccusing(false);
    },
  });

  function accuse() {
    write?.();
    setIsAccusing(true);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast(accuseSuccess());
      setIsAccusing(false);
    },
    onError(e) {
      console.error(e);
      toast(accuseFailure());
      setIsAccusing(false);
    },
  });

  return { accuse, isAccusing, isLoading, isSuccess, isError, isEnabled: enabled };
}
