import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import {
  EmbalmerFacet__factory,
  SarcoTokenMock__factory,
} from '@sarcophagus-org/sarcophagus-v2-contracts';
import { BigNumber, ethers } from 'ethers';
import { RouteKey, RoutesPathMap } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract, useSigner } from 'wagmi';
import { useAllowance } from '../../../../hooks/sarcoToken/useAllowance';
import { useNetworkConfig } from '../../../../lib/config';
import { ProgressTracker } from '../components/ProgressTracker';
import { ProgressTrackerStage } from '../components/ProgressTrackerStage';
import { ReviewSarcophagus } from '../components/ReviewSarcophagus';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';
import { useCreateSarcophagus } from '../hooks/useCreateSarcophagus/useCreateSarcophagus';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { CreateSarcophagusStage, defaultCreateSarcophagusStages } from '../utils/createSarcophagus';
import { goToStep } from '../../../../store/embalm/actions';
import { Step } from '../../../../store/embalm/reducer';
import { useDispatch } from '../../../../store';

export function CreateSarcophagus() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const { currentStage, handleCreate, stageError, retryStage, successData, clearSarcophagusState } =
    useCreateSarcophagus(createSarcophagusStages, embalmerFacet!, sarcoToken!);

  const { isSarcophagusFormDataComplete } = useSarcophagusParameters();

  const isCreateProcessStarted = (): boolean => {
    return currentStage !== CreateSarcophagusStage.NOT_STARTED;
  };

  const isCreateCompleted = (): boolean => {
    return currentStage === CreateSarcophagusStage.COMPLETED;
  };

  const cancelCreate = useCallback(async () => {
    // TODO add alert to user before cancelling
    clearSarcophagusState();
    dispatch(goToStep(Step.NameSarcophagus));
    navigate('/');
  }, [clearSarcophagusState, dispatch, navigate]);

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

  if (isCreateCompleted()) {
    // setTimeout with delay set to 0 is an easy fix for the following error:
    // react_devtools_backend.js:4026 Warning: Cannot update a component (`BrowserRouter`) while
    // rendering a different component
    setTimeout(() => {
      navigate(RoutesPathMap[RouteKey.SARCOPHAGUS_CREATED], {
        state: successData,
      });
    }, 0);
  }

  return (
    <Flex
      direction="column"
      w="100%"
    >
      {!isCreateCompleted() && <Heading mb={6}>Create Sarcophagus</Heading>}

      {!isCreateProcessStarted() ? (
        <>
          <ReviewSarcophagus />
          <Flex justifyContent="center">
            <Button
              w={250}
              p={6}
              mt={9}
              onClick={handleCreate}
              disabled={!isSarcophagusFormDataComplete()}
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
            retryStage={retryStage}
          >
            {Object.values(createSarcophagusStages)
              // Necessarily, a couple of these mappings don't have UI importance, thus no titles.
              .filter(text => !!text)
              .map(stage => (
                <ProgressTrackerStage key={stage}>{stage}</ProgressTrackerStage>
              ))}
          </ProgressTracker>
          {stageError && (
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
          )}
          <Button
            size="xs"
            variant="outline"
            onClick={cancelCreate}
          >
            Cancel Create Sarcophagus
          </Button>
        </>
      )}
    </Flex>
  );
}
