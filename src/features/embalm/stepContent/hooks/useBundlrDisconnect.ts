import { useCallback, useEffect, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { useDispatch } from 'store/index';
import { disconnect as disconnectBundlr } from 'store/bundlr/actions';
import { disconnect as disconnectToast } from 'lib/utils/toast';
import { ethers } from 'ethers';

export function useBundlrDisconnect() {
  const dispatch = useDispatch();
  const toast = useToast();

  // TODO: Find a way to use the provider from wagmi
  const connector: any = window.ethereum;
  const provider = useMemo(() => new ethers.providers.Web3Provider(connector), [connector]);

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
    disconnectFromBundlr,
    provider,
  };
}
