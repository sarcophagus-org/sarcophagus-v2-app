import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import React from 'react';
import { useDispatch, useSelector } from '../../store';
import { toggleIsBuyingSarco } from '../../store/embalm/actions';
import { useNetworkConfig } from '../../lib/config';
import { BigNumber } from 'ethers';

interface SwapInfoProps {
  sarcoQuoteError: string;
  sarcoQuoteETHAmount: string;
  sarcoDeficit: BigNumber;
  balance: BigNumber | undefined;
  totalFeesWithBuffer: BigNumber;
  isRewrap?: boolean;
}

export const SwapInfo = ({
 sarcoQuoteError,
 sarcoQuoteETHAmount,
 sarcoDeficit,
 balance,
 totalFeesWithBuffer,
 isRewrap
}: SwapInfoProps) => {
  const { isBuyingSarco } = useSelector(s => s.embalmState);
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  function handleChangeBuySarcoChecked() {
    dispatch(toggleIsBuyingSarco());
  }

  return (
    <Flex flexDirection="column">
      <Checkbox
        defaultChecked
        isChecked={isBuyingSarco}
        onChange={handleChangeBuySarcoChecked}
      >
        <Text>Swap {networkConfig.tokenSymbol} for SARCO</Text>
      </Checkbox>
      <Text
        mt={3}
        variant="secondary"
      >
        {isBuyingSarco
          ? sarcoQuoteError
            ? `There was a problem getting a SARCO quote: ${sarcoQuoteError}`
            : `${sarco.utils.formatSarco(sarcoQuoteETHAmount, 18)} ${
              networkConfig.tokenSymbol
            } will be swapped for ${sarco.utils.formatSarco(
              sarcoDeficit.toString()
            )} SARCO before the sarcophagus is ${isRewrap ? 'rewrapped' : 'created'}.`
          : `Your current SARCO balance is ${sarco.utils.formatSarco(
            balance ? balance.toString() : '0'
          )} SARCO, but required balance is ${sarco.utils.formatSarco(
            totalFeesWithBuffer.toString()
          )} SARCO. You can check the box to automatically swap ${
            networkConfig.tokenSymbol
          } to purchase the required balance during the ${isRewrap ? 'rewrapp' : 'creation'} process.`}
      </Text>
    </Flex>
  );
};