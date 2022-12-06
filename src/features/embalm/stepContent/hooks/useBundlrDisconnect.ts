import { useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useDispatch } from 'store/index';
import { disconnect as disconnectBundlr } from 'store/bundlr/actions';
import { disconnect as disconnectToast } from 'lib/utils/toast';
import { useProvider } from 'wagmi';

export function useBundlrDisconnect() {
  const dispatch = useDispatch();
  const toast = useToast();
  const provider = useProvider();

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

  const handleChainChange = useCallback(() => {
    disconnectFromBundlr();
  }, [disconnectFromBundlr]);

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
