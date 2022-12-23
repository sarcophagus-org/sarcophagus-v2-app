import { Button, Flex, Text } from '@chakra-ui/react';
import { EthereumIcon } from 'components/icons/EthereumIcon';
import { BigNumber, ethers } from 'ethers';
import { useGetBalance } from 'features/embalm/stepContent/hooks/useGetBalance';
import { useEthBalance } from 'hooks/useEthBalance';
import { useEthPrice } from 'hooks/useEthPrice';
import { useState } from 'react';
import { useSelector } from 'store/index';
import { BundlrInput } from './BundlrInput';
import { formatEther } from 'ethers/lib/utils';

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
  const [inputAmount, setInputAmount] = useState('');
  const { balanceOffset } = useSelector(s => s.bundlrState);
  const bundlrBalanceData = useGetBalance();
  const bundlrBalanceInEth = !bundlrBalanceData?.balance
    ? '--'
    : formatEther(bundlrBalanceData.balance.toString());
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
    setInputAmount(valueAsString);
  }

  function handleClickButton() {
    switch (action) {
      case BundlrAction.Deposit:
        onDeposit?.(ethers.utils.parseUnits(inputAmount));
        break;
      case BundlrAction.Withdraw:
        onWithdraw?.(ethers.utils.parseUnits(inputAmount));
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
      <Text>Bundlr ETH</Text>
      <Flex
        mt={1}
        align="center"
      >
        <EthereumIcon boxSize="30px" />
        <Text fontSize="3xl">{`${bundlrBalanceInEth}`}</Text>
      </Flex>
      <Text mt={1}>{isNaN(bundlrUsdValue) ? '--' : `$${bundlrUsdValue}`}</Text>
      {!balanceOffset.eq(ethers.constants.Zero) && (
        <Text
          mt={3}
          color="yellow"
        >
          You have a pending balance update. Your balance should be updated in a few minutes.
        </Text>
      )}
      <Text mt={6}>Enter Amount</Text>
      <BundlrInput
        value={inputAmount}
        onChange={handleChangeAmount}
      />
      <Text mt={3}>
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
