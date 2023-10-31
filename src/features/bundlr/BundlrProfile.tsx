import { Button, Flex, Text } from '@chakra-ui/react';
import { EthereumIcon } from 'components/icons/EthereumIcon';
import { BigNumber, ethers } from 'ethers';
import { useBundlrBalance } from 'features/embalm/stepContent/hooks/useBundlrBalance';
import { useEthPrice } from 'hooks/useEthPrice';
import { useSelector } from 'store/index';
import { BundlrInput } from './BundlrInput';
import { formatEther } from 'ethers/lib/utils';
import { useState } from 'react';
import { useNetwork } from 'wagmi';
import { WalletBalance } from './WalletBalance';

export enum BundlrAction {
  Deposit,
  Withdraw,
  Connect,
}

interface BundlrProfileProps {
  action: BundlrAction;
  onDeposit?: (amount: BigNumber) => void;
  onWithdraw?: (amount: BigNumber) => void;
  onConnect?: () => void;
}

export function BundlrProfile({ action, onDeposit, onWithdraw, onConnect }: BundlrProfileProps) {
  const { balanceOffset } = useSelector(s => s.bundlrState);

  const bundlrBalanceData = useBundlrBalance();

  const bundlrBalanceInEth = !bundlrBalanceData?.balance
    ? '--'
    : formatEther(bundlrBalanceData.balance.toString());

  const ethPrice = useEthPrice();

  const bundlrUsdValue = bundlrBalanceData?.balance
    ? Math.round(parseFloat(bundlrBalanceInEth) * parseFloat(ethPrice))
    : undefined;

  const { chain } = useNetwork();

  const buttonText = {
    [BundlrAction.Deposit]: 'Add Funds to Bundlr',
    [BundlrAction.Withdraw]: 'Withdraw from Bundlr',
    [BundlrAction.Connect]: 'Connect to Bundlr',
  };

  const [bundlrInputBN, setBundlrAmountBN] = useState<BigNumber>();

  function handleClickButton() {
    switch (action) {
      case BundlrAction.Deposit:
        onDeposit?.(bundlrInputBN!);
        break;
      case BundlrAction.Withdraw:
        onWithdraw?.(bundlrInputBN!);
        break;
      case BundlrAction.Connect:
        onConnect?.();
        break;
      default:
        break;
    }
  }

  return (
    <Flex direction="column">
      <Text>Bundlr {chain?.nativeCurrency?.name || 'ETH'}</Text>
      <Flex
        mt={1}
        align="center"
      >
        <EthereumIcon boxSize="30px" />
        <Text fontSize="3xl">{`${bundlrBalanceInEth}`}</Text>
      </Flex>
      <Text mt={1}>{!bundlrUsdValue ? '--' : `$${bundlrUsdValue}`}</Text>
      {!balanceOffset.eq(ethers.constants.Zero) && (
        <Text
          mt={3}
          color="yellow"
        >
          You have a pending balance update. Your balance should be updated in a few minutes.
        </Text>
      )}
      <Text
        mt={6}
        mb={3}
      >
        Enter Amount
      </Text>
      <BundlrInput
        onInputChange={(input: BigNumber | undefined) => {
          setBundlrAmountBN(input);
        }}
      />
      <WalletBalance />
      <Button
        mt={6}
        onClick={handleClickButton}
        disabled={!bundlrInputBN}
      >
        {buttonText[action]}
      </Button>
    </Flex>
  );
}
