import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Text, useClipboard } from '@chakra-ui/react';
import { SuccessIcon } from 'components/icons/SuccessIcon';
import { useNetworkConfig } from 'lib/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../../store';
import { goToStep } from '../../../../store/embalm/actions';
import { Step } from '../../../../store/embalm/reducer';
import { SuccessData } from '../hooks/useCreateSarcophagus/useClearSarcophagusState';

export function SuccessfulCreateSarcophagus({
  successEncryptedShardsTxId,
  successSarcophagusPayloadTxId,
  successSarcophagusTxId,
}: SuccessData) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();

  const goToDashboard = () => {
    dispatch(goToStep(Step.NameSarcophagus));
    navigate('/dashboard');
  };

  const boxBorder = '0.5px solid';

  const { onCopy: copyShardsId, hasCopied: hasCopiedShardsId } = useClipboard(
    successEncryptedShardsTxId,
    { timeout: 5000 }
  );
  const { onCopy: copyFileId, hasCopied: hasCopiedFileId } = useClipboard(
    successSarcophagusPayloadTxId,
    { timeout: 5000 }
  );

  const copyIcon = (hasCopiedFlag: boolean, onClick: () => void) =>
    hasCopiedFlag ? (
      <CheckIcon mt={4} />
    ) : (
      <CopyIcon
        mt={4}
        cursor="pointer"
        bgColor={'transparent'}
        color="white"
        aria-label="copy"
        onClick={onClick}
      />
    );

  const arweaveTxId = (txId: string) => (
    <Text
      width="50%"
      fontSize="10px"
      color="brand.700"
      textAlign="right"
      mt={4}
    >
      {`${txId.slice(0, 5)}...${txId.slice(-4)}`}
    </Text>
  );

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {/*
       * SUCCESS MESSAGE
       */}
      <Heading
        fontSize="xl"
        mx={5}
        mb={6}
      >
        Sarcophagus Created Successfully
      </Heading>
      <SuccessIcon
        width={50}
        height={50}
        mb={6}
      />

      {/*
       * DETAILS BOX AND CONTENT
       */}
      <Flex
        width={700}
        direction="column"
      >
        <Heading
          fontSize="md"
          py="12px"
          textAlign="center"
          bgGradient="linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
          border={boxBorder}
          borderColor="brand.300"
          borderBottom="none"
          borderRadius="4px 4px 0px 0px"
        >
          Transaction Details
        </Heading>

        {/*
         * CONTENT
         */}
        <Flex
          direction="column"
          border={boxBorder}
          borderColor="brand.200"
          borderTop="none"
        >
          <Flex
            justifyContent="space-between"
            wrap="wrap"
            px="18px"
          >
            {/*
             * ARWEAVE SHARDS TRANSACTION ID
             */}
            <Text
              width="40%"
              fontSize="sm"
              mt={4}
            >
              {/* TODO: This label is weird, almost meaningless */}
              Archaeologist Arweave ID
            </Text>
            {arweaveTxId(successEncryptedShardsTxId)}
            {copyIcon(hasCopiedShardsId, copyShardsId)}

            {/*
             * ARWEAVE PAYLOAD TRANSACTION ID
             */}
            <Text
              width="40%"
              fontSize="sm"
              mt={4}
            >
              Arweave File ID
            </Text>
            {arweaveTxId(successSarcophagusPayloadTxId)}
            {copyIcon(hasCopiedFileId, copyFileId)}

            {/*
             * SARCO CREATION TX ETHERSCAN LINK
             */}
            <Text
              width="40%"
              fontSize="sm"
              mt={4}
            >
              Sarcophagus Creation
            </Text>
            <Text
              fontSize="10px"
              color="brand.700"
              textAlign="right"
              decoration="underline"
              mt={4}
              cursor="pointer"
              onClick={() =>
                window.open(`${networkConfig.explorerUrl}/tx/${successSarcophagusTxId}`)
              }
            >
              VIEW TX ON ETHERSCAN
            </Text>
          </Flex>

          <Button
            onClick={goToDashboard}
            my={6}
            width="163px"
            alignSelf="center"
          >
            Go to Dashboard
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
