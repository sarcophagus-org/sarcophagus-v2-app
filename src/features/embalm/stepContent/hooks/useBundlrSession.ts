import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import { hardhatChainId } from 'lib/config/networkConfigs';
import {
  connectFailure,
  connectStart,
  connectSuccess,
  disconnect as disconnectToast,
} from 'lib/utils/toast';
import { useCallback, useEffect, useMemo } from 'react';
import { sarco } from 'sarcophagus-v2-sdk';
import { useAccount } from 'wagmi';

export function useBundlrSession() {
  const toast = useToast();
  const networkConfig = useNetworkConfig();
  const isHardhatNetwork = networkConfig.chainId === hardhatChainId;

  /**
   * Disconnects from the arweave bundlr node
   */
  const disconnectFromBundlr = useCallback(() => {
    localStorage.removeItem('publicKey');
    sarco.bundlr.disconnect();
    const id = 'disconnectFromBundlr';
    if (!toast.isActive(id)) {
      toast({ ...disconnectToast(), id });
    }
  }, [toast]);

  useAccount({
    onDisconnect() {
      disconnectFromBundlr();
    },
  });

  // TODO: Find a way to use the provider from wagmi
  const connector: any = window.ethereum;

  const provider = useMemo(
    () => (!!connector ? new ethers.providers.Web3Provider(connector) : undefined),
    [connector]
  );

  const connectToBundlr = useCallback(async (): Promise<void> => {
    if (isHardhatNetwork) {
      console.error(
        'Bundlr cannot be used with the hardhat local network. Switch to Goerli or Mainnet to interact with bunldr.'
      );
      return;
    }

    toast(connectStart());
    try {
      const publicKey = await sarco.bundlr.connect();
      console.log('injectPublicKey', publicKey);
      // sarco.bundlr.injectPublicKey(publicKey);
      console.log('done');
      
      toast(connectSuccess());
    } catch (_error) {
      const error = _error as Error;
      toast(connectFailure(error.message));
    }
  }, [toast, isHardhatNetwork]);

  // Uses the connect wallet button to detect chain change.
  // I was not able to use an wagmi hooks to detect a chain change from the wallet.
  const handleChainChange = useCallback(() => {
    disconnectFromBundlr();
  }, [disconnectFromBundlr]);

  // Uses the connect wallet button to detect account change.
  // I was not able to use an wagmi hooks to detect an account change from the wallet.
  const handleAccountsChange = useCallback(() => {
    disconnectFromBundlr();
  }, [disconnectFromBundlr]);

  /**
   * Disconnects from the bundlr node if the chain or account changes.
   */
  useEffect(() => {
    window?.ethereum?.on?.('chainChanged', handleChainChange);
    window?.ethereum?.on?.('accountsChanged', handleAccountsChange);

    return () => {
      window?.ethereum?.removeListener?.('chainChanged', handleChainChange);
      window?.ethereum?.removeListener?.('accountsChanged', handleAccountsChange);
    };
  }, [handleAccountsChange, handleChainChange, provider]);

  return {
    connectToBundlr,
    disconnectFromBundlr,
  };
}
