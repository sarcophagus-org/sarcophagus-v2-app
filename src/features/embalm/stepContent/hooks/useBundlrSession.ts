import { WebBundlr } from '@bundlr-network/client';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useNetworkConfig } from 'lib/config';
import {
  connectFailure,
  connectStart,
  connectSuccess,
  disconnect as disconnectToast,
} from 'lib/utils/toast';
import { useCallback, useEffect, useMemo } from 'react';
import { connect, disconnect as disconnectBundlr, setBundlr } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { hardhatChainId } from '../../../../lib/config/hardhat';

export function useBundlrSession() {
  const dispatch = useDispatch();
  const { isConnected } = useSelector(x => x.bundlrState);
  const toast = useToast();
  const networkConfig = useNetworkConfig();
  const isHardhatNetwork = networkConfig.chainId === hardhatChainId;

  /**
   * Disconnects from the arweave bundlr node
   */
  const disconnectFromBundlr = useCallback(() => {
    localStorage.removeItem('publicKey');
    dispatch(disconnectBundlr());
    const id = 'disconnectFromBundlr';
    if (!toast.isActive(id)) {
      toast({ ...disconnectToast(), id });
    }
  }, [dispatch, toast]);

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
    let newBundlr = new WebBundlr(
      networkConfig.bundlr.nodeUrl,
      networkConfig.bundlr.currencyName,
      provider,
      {
        timeout: 100000,
        providerUrl: networkConfig.bundlr.providerUrl,
      }
    );

    toast(connectStart());
    try {
      // Prompts the user to sign a message. I beleive the primary purpose of this signature is to
      // get inject the user's public key into the bundlr instance.
      await newBundlr.ready();

      dispatch(connect());
      dispatch(setBundlr(newBundlr));
      toast(connectSuccess());
    } catch (_error) {
      const error = _error as Error;
      toast(connectFailure(error.message));
    }
  }, [dispatch, networkConfig, provider, toast, isHardhatNetwork]);

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
    isConnected,
  };
}
