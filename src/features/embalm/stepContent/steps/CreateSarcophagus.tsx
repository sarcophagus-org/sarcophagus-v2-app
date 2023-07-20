import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { RetryCreateModal } from 'components/RetryCreateModal';
import { BigNumber, ethers } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { RouteKey, RoutesPathMap } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract, useSigner } from 'wagmi';
import { useAllowance } from '../../../../hooks/sarcoToken/useAllowance';
import { useNetworkConfig } from '../../../../lib/config';
import { useDispatch, useSelector } from '../../../../store';
import { goToStep, setArchaeologists, setCancelToken } from '../../../../store/embalm/actions';
import { Step } from '../../../../store/embalm/reducer';
import { PageBlockModal } from '../components/PageBlockModal';
import { ProgressTracker } from '../components/ProgressTracker';
import { ProgressTrackerStage } from '../components/ProgressTrackerStage';
import { ReviewSarcophagus } from '../components/ReviewSarcophagus';
import { StageInfoIcon } from '../components/StageInfoIcon';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';
import {
  CancelCreateToken,
  useCreateSarcophagus,
} from '../hooks/useCreateSarcophagus/useCreateSarcophagus';
import { useLoadArchaeologists } from '../hooks/useLoadArchaeologists';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { CreateSarcophagusStage, defaultCreateSarcophagusStages } from '../utils/createSarcophagus';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function CreateSarcophagus() {
  const { refreshProfiles } = useLoadArchaeologists();
  const { cancelCreateToken, retryingCreate } = useSelector(s => s.embalmState);
  const { timestampMs } = useSelector(x => x.appState);
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

  const {
    archaeologists,
    selectedArchaeologists,
    resurrection: resurrectionTimeMs,
  } = useSelector(x => x.embalmState);

  const { isSarcophagusFormDataComplete, isError } = useSarcophagusParameters();
  const { balance } = useSarcoBalance();

  const [totalDiggingFees, setTotalDiggingFees] = useState<BigNumber>();
  const [protocolFee, setProtocolFee] = useState<BigNumber>();
  const [totalFeesWithApproveBuffer, setTotalFeesWithApproveBuffer] = useState(
    ethers.constants.Zero
  );

  useEffect(() => {
    const fetchFees = async () => {
      const { totalDiggingFees: diggingFees, protocolFee: protocolFeeVal } =
        await sarco.archaeologist.getTotalFeesInSarco(
          selectedArchaeologists,
          resurrectionTimeMs,
          timestampMs
        );

      setTotalDiggingFees(diggingFees);
      setProtocolFee(protocolFeeVal);

      const totalCurseFees = selectedArchaeologists.reduce(
        (acc, archaeologist) => acc.add(archaeologist.profile.curseFee),
        BigNumber.from(0)
      );

      const diggingFeesAndCurseFees = diggingFees.add(totalCurseFees);
      const totalFees = diggingFeesAndCurseFees.add(protocolFeeVal);

      setTotalFeesWithApproveBuffer(totalFees.add(totalFees.div(10)));
    };

    fetchFees();
  }, [resurrectionTimeMs, selectedArchaeologists, timestampMs]);

  const {
    currentStage,
    handleCreate,
    stageError,
    stageInfo,
    retryStage,
    retryCreateSarcophagus,
    successData,
    clearSarcophagusState,
  } = useCreateSarcophagus(createSarcophagusStages, embalmerFacet!, totalFeesWithApproveBuffer);

  const isCreateProcessStarted = (): boolean => currentStage !== CreateSarcophagusStage.NOT_STARTED;

  const isCreateCompleted = useCallback(() => {
    return currentStage === CreateSarcophagusStage.COMPLETED;
  }, [currentStage]);

  const cancelCreation = useCallback(async () => {
    // TODO add alert to user before cancelling
    await clearSarcophagusState();
    cancelCreateToken.cancel();
    dispatch(goToStep(Step.NameSarcophagus));
    navigate('/');
    dispatch(setCancelToken(new CancelCreateToken()));
  }, [cancelCreateToken, clearSarcophagusState, dispatch, navigate]);

  useEffect(() => {
    // remove approval step if user has enough allowance on sarco token
    if (
      !!createSarcophagusStages[CreateSarcophagusStage.APPROVE] &&
      allowance &&
      BigNumber.from(allowance).gte(totalFeesWithApproveBuffer)
    ) {
      const stepsCopy = { ...defaultCreateSarcophagusStages };
      delete stepsCopy[CreateSarcophagusStage.APPROVE];
      setCreateSarcophagusStages(stepsCopy);
    }
  }, [allowance, createSarcophagusStages, totalFeesWithApproveBuffer]);

  // Reload the archaeologist list when create is completed. This is so that free bonds from the
  // arch profiles will be updated.
  useEffect(() => {
    (async () => {
      if (isCreateCompleted()) {
        // Get the profiles from the contract
        const profiles = await refreshProfiles(archaeologists.map(a => a.profile.archAddress));
        if (profiles) {
          dispatch(setArchaeologists(profiles));
        }

        // restart the peer discovery process
        // TODO -- re-enable once peer discovery is added
        // await addPeerDiscoveryEventListener(globalLibp2pNode!);
      }
    })();
  }, [dispatch, refreshProfiles, isCreateCompleted, archaeologists]);

  if (isCreateCompleted()) {
    // setTimeout with delay set to 0 is an easy fix for the following error:
    // react_devtools_backend.js:4026 Warning: Cannot update a component (`BrowserRouter`) while
    // rendering a different component
    setTimeout(() => {
      navigate(RoutesPathMap[RouteKey.SARCOPHAGUS_CREATED], {
        state: successData,
      });
    }, 10);
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
              disabled={
                !totalDiggingFees ||
                !protocolFee ||
                balance?.lte(totalDiggingFees.add(protocolFee)) ||
                !isSarcophagusFormDataComplete() ||
                isError
              }
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
            isApproved={createSarcophagusStages[CreateSarcophagusStage.APPROVE] === undefined}
          >
            {Object.values(createSarcophagusStages)
              // Necessarily, a couple of these mappings don't have UI importance, thus no titles.
              .filter(text => !!text)
              .map(stage => (
                <ProgressTrackerStage key={stage}>{stage}</ProgressTrackerStage>
              ))}
          </ProgressTracker>
          {stageInfo && !stageError && (
            <Flex
              mt={3}
              alignItems="center"
            >
              <StageInfoIcon />
              <Text
                ml={2}
                variant="secondary"
              >
                {stageInfo}
              </Text>
            </Flex>
          )}
          {stageError && (
            <Flex
              mt={3}
              alignItems="center"
            >
              <SummaryErrorIcon error={stageError} />
              <Text
                ml={2}
                variant="secondary"
              >
                = {stageError}
              </Text>
            </Flex>
          )}
          <Button
            size="xs"
            variant="outline"
            w="150px"
            mt="20px"
            onClick={cancelCreation}
          >
            Cancel Sarcophagus
          </Button>
        </>
      )}

      {retryingCreate ? (
        <RetryCreateModal
          retryCreate={retryCreateSarcophagus}
          cancelCreation={cancelCreation}
        />
      ) : (
        <></>
      )}

      {currentStage === CreateSarcophagusStage.COMPLETED ? null : <PageBlockModal />}
    </Flex>
  );
}
