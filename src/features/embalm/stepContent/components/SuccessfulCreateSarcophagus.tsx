import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Text, useClipboard } from '@chakra-ui/react';
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

  const formatId = (id: string) => `${id.slice(0, 5)}...${id.slice(-4)}`;

  const { onCopy: copyShardsId, hasCopied: hasCopiedShardsId } = useClipboard(successEncryptedShardsTxId, { timeout: 5000 });
  const { onCopy: copyFileId, hasCopied: hasCopiedFileId } = useClipboard(successSarcophagusPayloadTxId, { timeout: 5000 });

  return (
    <Flex
      mt={6}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading
        fontSize="xl"
        mb={4}
      >
        Sarcophagus Creation Successful!
      </Heading>
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
            {/* TODO: This label is weird, almost meaningless */}
            <Text
              width="40%"
              fontSize="sm"
              mt={4}
            >
              Archaeologist Arweave ID
            </Text>
            <Text
              width="50%"
              fontSize="10px"
              color="brand.700"
              textAlign="right"
              mt={4}
            >
              {formatId(successEncryptedShardsTxId)}
            </Text>
            {hasCopiedShardsId ? <CheckIcon mt={4} /> :
              <CopyIcon mt={4}
                cursor="pointer"
                bgColor={'transparent'} color='white' aria-label='copy' onClick={copyShardsId} />}

            <Text
              width="40%"
              fontSize="sm"
              mt={4}
            >
              Arweave File ID
            </Text>
            <Text
              width="50%"
              textAlign="right"
              fontSize="10px"
              color="brand.700"
              mt={4}
            >
              {formatId(successSarcophagusPayloadTxId)}
            </Text>
            {hasCopiedFileId ? <CheckIcon mt={4} /> :
              <CopyIcon mt={4}
                cursor="pointer"
                bgColor={'transparent'} color='white' aria-label='copy' onClick={copyFileId} />}

            <Text
              width="40%"
              fontSize="sm"
              mt={4}
            >
              Sarcophagus Creation
            </Text>
            <Text
              width="60%"
              fontSize="10px"
              color="brand.700"
              textAlign="right"
              decoration="underline"
              mt={4}
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
