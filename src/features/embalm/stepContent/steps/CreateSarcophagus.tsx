import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import {
  EmbalmerFacet__factory,
  SarcoTokenMock__factory,
} from '@sarcophagus-org/sarcophagus-v2-contracts';
import { BigNumber, ethers } from 'ethers';
import { useBootLibp2pNode } from 'hooks/libp2p/useBootLibp2pNode';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useGetProtocolFeeAmount } from 'hooks/viewStateFacet';
import { getTotalFeesInSarco } from 'lib/utils/helpers';
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

export function CreateSarcophagus() {
  const { getProfiles } = useLoadArchaeologists();
  const { addPeerDiscoveryEventListener } = useBootLibp2pNode(20_000);
  const globalLibp2pNode = useSelector(s => s.appState.libp2pNode);
  const { cancelCreateToken } = useSelector(s => s.embalmState);
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

  const {
    currentStage,
    handleCreate,
    stageError,
    stageInfo,
    retryStage,
    successData,
    clearSarcophagusState,
  } = useCreateSarcophagus(createSarcophagusStages, embalmerFacet!, sarcoToken!);

  const { isSarcophagusFormDataComplete, isError } = useSarcophagusParameters();
  const { balance } = useSarcoBalance();

  const { selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const protocolFeeBasePercentage = useGetProtocolFeeAmount();

  const isCreateProcessStarted = (): boolean => {
    return currentStage !== CreateSarcophagusStage.NOT_STARTED;
  };

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

  // Reload the archaeologist list when create is completed. This is so that free bonds from the
  // arch profiles will be updated.
  useEffect(() => {
    (async () => {
      if (isCreateCompleted()) {
        // Get the profiles from the contract
        const profiles = await getProfiles();
        if (profiles) {
          dispatch(setArchaeologists(profiles));
        }

        // restart the peer discovery process
        // TODO -- re-enable once peer discovery is added
        // await addPeerDiscoveryEventListener(globalLibp2pNode!);
      }
    })();
  }, [addPeerDiscoveryEventListener, globalLibp2pNode, dispatch, getProfiles, isCreateCompleted]);

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

  const { totalDiggingFees, protocolFee } = getTotalFeesInSarco(
    resurrection,
    selectedArchaeologists.map(a => a.profile.minimumDiggingFeePerSecond),
    protocolFeeBasePercentage
  );

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

      {currentStage === CreateSarcophagusStage.COMPLETED ? null : <PageBlockModal />}
    </Flex>
  );
}
