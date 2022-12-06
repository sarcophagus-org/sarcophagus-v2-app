import { WebBundlr } from '@bundlr-network/client';
import { useToast } from '@chakra-ui/react';
import { InjectedEthereumSigner } from 'arbundles/src/signing';
import { connectFailure, connectStart, connectSuccess } from 'lib/utils/toast';
import { useCallback, useEffect, useMemo } from 'react';
import { connect, setBundlr } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useAccount } from 'wagmi';
import { useNetworkConfig } from 'lib/config';
import { hardhatChainId } from '../../../../lib/config/hardhat';
import { useBundlrDisconnect } from './useBundlrDisconnect';
import { publicProvider } from 'wagmi/providers/public';
import { ethers } from 'ethers';

export function useBundlrSession() {
  const dispatch = useDispatch();
  const { isConnected } = useSelector(x => x.bundlrState);
  const toast = useToast();
  const networkConfig = useNetworkConfig();
  const isHardhatNetwork = networkConfig.chainId === hardhatChainId;
  const { disconnectFromBundlr } = useBundlrDisconnect();

  const { address } = useAccount({
    onDisconnect() {
      disconnectFromBundlr();
    },
  });

  // TODO: Find a way to use the provider from wagmi
  const connector: any = window.ethereum;
  const provider: ethers.providers.Web3Provider = useMemo(
    () => new ethers.providers.Web3Provider(connector),
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
  }, [dispatch, networkConfig, provider, toast, isHardhatNetwork]);

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
      let newBundlr: any = new WebBundlr(
        networkConfig.bundlr.nodeUrl,
        networkConfig.bundlr.currencyName,
        provider,
        {
          timeout: 100000,
          providerUrl: networkConfig.bundlr.providerUrl,
        }
      );

      newBundlr.address = address?.toLowerCase();
      newBundlr.currencyConfig._address = address?.toLowerCase();
      newBundlr.currencyConfig.signer = injectedSigner;
      newBundlr.currencyConfig.providerInstance = provider;
      newBundlr.currencyConfig.w3signer = publicProvider;

      return newBundlr;
    },
    [address, networkConfig, provider]
  );

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
    if (isHardhatNetwork || isConnected || !networkConfig.bundlr.nodeUrl) return;

    const publicKeyJson = localStorage.getItem('publicKey');
    if (!publicKeyJson) return;
    const publicKeyObj = JSON.parse(publicKeyJson);
    const publicKey = Buffer.from(new Uint8Array(publicKeyObj.data));

    // const publicKey = loadPublicKey();
    const newBundlr = createInjectedBundlr(publicKey);

    dispatch(connect());
    dispatch(setBundlr(newBundlr));
  }, [createInjectedBundlr, dispatch, isConnected, isHardhatNetwork, networkConfig.bundlr.nodeUrl]);

  /**
   * Disconnects from the bundlr node if the chain or account changes.
   */
  useBundlrDisconnect();

  return {
    connectToBundlr,
    isConnected,
  };
}
