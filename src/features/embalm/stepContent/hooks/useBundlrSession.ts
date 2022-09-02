import { WebBundlr } from '@bundlr-network/client';
import { useToast } from '@chakra-ui/react';
import { InjectedEthereumSigner } from 'arbundles/src/signing';
import { ethers } from 'ethers';
import { AllNetworkConfigs } from 'lib/config/networkConfig';
import {
  connectFailure,
  connectStart,
  connectSuccess,
  disconnect as disconnectToast,
} from 'lib/utils/toast';
import { useCallback, useEffect, useMemo } from 'react';
import { connect, disconnect as disconnectBundlr, setBundlr } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useAccount, useNetwork } from 'wagmi';

export function useBundlrSession() {
  const nodeUrl = process.env.REACT_APP_BUNDLR_NODE || 'https://node1.bundlr.network';

  const dispatch = useDispatch();
  const { isConnected } = useSelector(x => x.bundlrState);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();

  // TODO: Find a way to use the provider from wagmi
  const connector: any = window.ethereum;
  const provider = useMemo(() => new ethers.providers.Web3Provider(connector), [connector]);

  // Get the name of the currency that bundlr will understand
  const currency = useMemo(
    () => AllNetworkConfigs[chain?.id || 1].bundlrCurrencyName || 'ethereum',
    [chain]
  );

  /**
   * Connects to the arweave bundlr node.
   * This will prompt the user to sign a message.
   * Defaults to https://node1.bundlr.network.
   */
  const connectToBundlr = useCallback(async (): Promise<void> => {
    let newBundlr = new WebBundlr(nodeUrl, currency, provider);

    toast(connectStart());
    try {
      // Prompts the user to sign a message. I beleive the primary purpose of this signature is to
      // get inject the user's public key into the bundlr instance.
      await newBundlr.ready();

      // Store the public key in local storage to be injected into the bundlr instance after a reload
      const publicKey = newBundlr.currencyConfig.getSigner().publicKey;
      localStorage.setItem('publicKey', JSON.stringify(publicKey));

      dispatch(connect());
      dispatch(setBundlr(newBundlr));
      toast(connectSuccess());
    } catch (_error) {
      const error = _error as Error;
      toast(connectFailure(error.message));
    }
  }, [currency, dispatch, nodeUrl, provider, toast]);

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

  /**
   * Manually injects a public key into a bundlr instance, bypassing the signature.
   *
   * To connect to the bundlr, `await bundlr.ready()` is called. This prompts the user to sign a
   * message, then the bundlr methods may be called. This method injects a public key into a signer
   * and injects the signer, address, and provider into the bundlr instance so that no signature is
   * needed.
   *
   */
  const createInjectedBundlr = useCallback(
    (publicKey: Buffer) => {
      const injectedSigner = new InjectedEthereumSigner(provider);
      injectedSigner.publicKey = publicKey;

      // Cast as `any` because typescript doesn't recognize that the bundlr has some of
      // these properties
      let newBundlr: any = new WebBundlr(nodeUrl, currency, provider);
      newBundlr.address = address?.toLowerCase();
      newBundlr.currencyConfig._address = address?.toLowerCase();
      newBundlr.currencyConfig.signer = injectedSigner;
      newBundlr.currencyConfig.providerInstance = provider;
      newBundlr.currencyConfig.w3signer = provider.getSigner();

      return newBundlr;
    },
    [address, currency, nodeUrl, provider]
  );

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
   * Automatically instantiates the WebBundlr if it doesn't exist.
   *
   * The injected bundlr within this useEffect has been tested with `getBalance()`, `getPrice()`,
   * `fund()`, `withdraw()`, and `upload()`. It's not guaranteed that the bundlr will work with
   * other methods.
   *
   * If a developer runs into an issue with the bundlr not working, disable this useEffect and
   * connect to the bundlr the standard way using the `connectToBundlr()` function.
   */
  useEffect(() => {
    if (isConnected) return;

    const publicKeyJson = localStorage.getItem('publicKey');
    if (!publicKeyJson) return;
    const publicKeyObj = JSON.parse(publicKeyJson);
    const publicKey = Buffer.from(new Uint8Array(publicKeyObj.data));

    // const publicKey = loadPublicKey();
    const newBundlr = createInjectedBundlr(publicKey);

    dispatch(connect());
    dispatch(setBundlr(newBundlr));
  }, [createInjectedBundlr, dispatch, isConnected]);

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
