import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { ProgressTracker } from '../components/ProgressTracker';
import { ProgressTrackerStage } from '../components/ProgressTrackerStage';
import { useCreateSarcophagus } from '../hooks/useCreateSarcophagus/useCreateSarcophagus';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { ReviewSarcophagus } from '../components/ReviewSarcophagus';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';
import { useAllowance } from '../../../../hooks/sarcoToken/useAllowance';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { CreateSarcophagusStage, defaultCreateSarcophagusStages } from '../utils/createSarcophagus';
import { useContract, useSigner } from 'wagmi';
import {
  EmbalmerFacet__factory,
  SarcoTokenMock__factory,
} from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from '../../../../lib/config';

export function CreateSarcophagus() {
  const { allowance } = useAllowance();
  const [createSarcophagusStages, setCreateSarcophagusStages] = useState<Record<number, string>>(
    defaultCreateSarcophagusStages
  );

  const networkConfig = useNetworkConfig();
  const { data: signer } = useSigner();

  const embalmerFacet = useContract({
    address: networkConfig.diamondDeployAddress,
    abi: EmbalmerFacet__factory.abi,
    signerOrProvider: signer,
  });

  const sarcoToken = useContract({
    address: networkConfig.sarcoTokenAddress,
    abi: SarcoTokenMock__factory.abi,
    signerOrProvider: signer,
  });

  const { currentStage, handleCreate, stageError } = useCreateSarcophagus(
    createSarcophagusStages,
    embalmerFacet!,
    sarcoToken!
  );

  const { isSarcophagusComplete } = useSarcophagusParameters();

  const isCreateProcessStarted = (): boolean => {
    return currentStage !== CreateSarcophagusStage.NOT_STARTED;
  };

  useEffect(() => {
    // remove approval step if user has allowance on sarco token
    // TODO: compare with pending fees instead
    if (allowance) {
      if (
        BigNumber.from(allowance).gte(
          ethers.constants.MaxUint256.sub(ethers.utils.parseEther('1000'))
        )
      ) {
        const stepsCopy = { ...defaultCreateSarcophagusStages };
        delete stepsCopy[CreateSarcophagusStage.APPROVE];
        setCreateSarcophagusStages(stepsCopy);
      } else {
        setCreateSarcophagusStages(defaultCreateSarcophagusStages);
      }
    }
  }, [allowance, signer]);

  return (
    <Flex
      direction="column"
      w="100%"
    >
      <Heading mb={6}>Create Sarcophagus</Heading>
      {!isCreateProcessStarted() ? (
        <>
          <ReviewSarcophagus />
          <Flex justifyContent="center">
            <Button
              w={250}
              p={6}
              mt={9}
              onClick={handleCreate}
              disabled={!isSarcophagusComplete()}
            >
              Create Sarcophagus
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <ProgressTracker
            title="Creating Sarcophagus"
            currentStage={currentStage}
            stageError={stageError}
          >
            {Object.values(createSarcophagusStages)
              // Necessarily, a couple of these mappings don't have UI importance, thus no titles.
              .filter(text => !!text)
              .map(stage => (
                <ProgressTrackerStage key={stage}>{stage}</ProgressTrackerStage>
              ))}
          </ProgressTracker>
          {stageError ? (
            <Flex
              mt={3}
              alignItems="center"
            >
              <SummaryErrorIcon error={stageError} />
              <Text
                ml={2}
                color="brand.500"
              >
                = {stageError}
              </Text>
            </Flex>
          ) : (
            ''
          )}
          {currentStage === CreateSarcophagusStage.COMPLETED ? (
            <Flex
              mt={6}
              direction="column"
            >
              <Text>Sarcophagus creation successful!</Text>
              <Text mt={2}>Redirecting you to the embalmer dashboard....</Text>
            </Flex>
          ) : (
            <></>
          )}
        </>
      )}
    </Flex>
  );
}
