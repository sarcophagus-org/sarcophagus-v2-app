import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Heading,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useState } from 'react';
import { useNetwork } from 'wagmi';
import { goerliNetworkConfig } from 'lib/config/goerli';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 */
export function FundBundlr() {
  const defaultAmount = '0.1';
  const { bundlr, fund, isFunding } = useBundlr();
  const [amount, setAmount] = useState(defaultAmount);
  const { chain } = useNetwork();

  function handleChangeAmount(valueAsString: string) {
    setAmount(valueAsString);
  }

  async function handleFund() {
    await fund(amount);
  }

  function fundButtonDisabled() {
    return amount.trim().length === 0 || parseFloat(amount) === 0 || !bundlr || isFunding;
  }

  return (
    <Flex
      mt={6}
      direction="column"
    >
      <Heading size="md">Fund Bundlr Node</Heading>
      <Flex
        mt={3}
        direction="column"
        maxWidth={800}
      >
        {chain?.id !== goerliNetworkConfig.chainId && (
          <Alert status="warning">
            <AlertIcon color="warning" />
            <Text color="warning">
              This does not use testnet. You will be funding the bundlr node with real currency.
            </Text>
          </Alert>
        )}
      </Flex>
      <Flex
        mt={3}
        direction="column"
      >
        <Flex align="center">
          <NumberInput
            mt={1}
            width={200}
            isDisabled={!bundlr || isFunding}
            value={amount}
            onChange={handleChangeAmount}
          >
            <NumberInputField />
          </NumberInput>
          <Button
            ml={3}
            disabled={fundButtonDisabled()}
            onClick={handleFund}
            isLoading={isFunding}
          >
            Fund Bundlr
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
