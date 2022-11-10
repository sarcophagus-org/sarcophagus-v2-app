import { Button, Flex, Text } from '@chakra-ui/react';
import { EthereumIcon } from 'components/icons/EthereumIcon';
import { ethers } from 'ethers';
import { useGetBalance } from 'features/embalm/stepContent/hooks/useGetBalance';
import { useEthBalance } from 'hooks/useEthBalance';
import { useEthPrice } from 'hooks/useEthPrice';
import { useState } from 'react';
import { BundlrInput } from './BundlrInput';

export enum BundlrAction {
  Deposit,
  Withdraw,
  Connect,
}

interface BundlrProfileProps {
  action: BundlrAction;
  onDeposit?: (amount: string) => void;
  onWithdraw?: (amount: string) => void;
  onConnect?: () => void;
}

export function BundlrProfile({ action, onDeposit, onWithdraw, onConnect }: BundlrProfileProps) {
  const [amount, setAmount] = useState('');
  const bundlrBalanceData = useGetBalance();
  const bundlrBalance = !bundlrBalanceData?.balance
    ? '--'
    : Number(bundlrBalanceData?.balance).toFixed(2);

  const ethPrice = useEthPrice();
  const bundlrUsdValue = Math.round(parseFloat(bundlrBalance) * parseFloat(ethPrice));

  const { balance: ethBalance } = useEthBalance();
  const formattedEthBalance = Number(ethBalance).toFixed(4);

  const ethUsdValue = Math.round(parseFloat(ethBalance) * parseFloat(ethPrice));

  const buttonText = {
    [BundlrAction.Deposit]: 'Add Funds to Bundlr',
    [BundlrAction.Withdraw]: 'Withdraw from Bundlr',
    [BundlrAction.Connect]: 'Connect to Bundlr',
  };

  function handleChangeAmount(valueAsString: string) {
    if (valueAsString.length > 20) return;
    setAmount(valueAsString);
  }

  function handleClickButton() {
    switch (action) {
      case BundlrAction.Deposit:
        onDeposit?.(amount);
        break;
      case BundlrAction.Withdraw:
        onWithdraw?.(amount);
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
      <Text color="whiteAlpha.700">Bundlr ETH</Text>
      <Flex
        mt={1}
        align="center"
      >
        <EthereumIcon
          h="30px"
          w="30px"
        />
        <Text fontSize="3xl">{bundlrBalance}</Text>
      </Flex>
      <Text
        color="whiteAlpha.700"
        mt={1}
      >
        {isNaN(bundlrUsdValue) ? '--' : `$${bundlrUsdValue}`}
      </Text>
      <Text
        mt={6}
        color="whiteAlpha.700"
      >
        Enter Amount
      </Text>
      <BundlrInput
        value={amount}
        onChange={handleChangeAmount}
      />
      <Text
        mt={3}
        color="whiteAlpha.700"
      >
        Wallet Balance: {formattedEthBalance} ETH{' '}
        {!isNaN(ethUsdValue) && `($${ethers.utils.commify(ethUsdValue)})`}
      </Text>
      <Button
        mt={6}
        onClick={handleClickButton}
      >
        {buttonText[action]}
      </Button>
    </Flex>
  );
}
