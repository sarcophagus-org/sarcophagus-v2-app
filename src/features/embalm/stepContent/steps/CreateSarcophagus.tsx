import { Button, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { RetryCreateModal } from 'components/RetryCreateModal';
import { BigNumber } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { RouteKey, RoutesPathMap } from 'pages';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllowance } from '../../../../hooks/sarcoToken/useAllowance';
import { useDispatch, useSelector } from '../../../../store';
import {
  clearSarcoQuoteInterval,
  goToStep,
  setArchaeologists,
  setCancelToken,
  setSarcoQuoteInterval,
} from '../../../../store/embalm/actions';
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
import { useSarcoFees } from '../hooks/useSarcoFees';
import { useSarcoQuote } from '../hooks/useSarcoQuote';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { CreateSarcophagusStage, defaultCreateSarcophagusStages } from '../utils/createSarcophagus';
import { SwapInfo } from '../../../../components/SwapUX/SwapInfo';

// TODO -- remove need for this, see RetryCreateModal reference
const SHOW_RETRY_CREATE_MODAL = false;
export function CreateSarcophagus() {
  const { refreshProfiles } = useLoadArchaeologists();
  const { allowance } = useAllowance();
  const { cancelCreateToken, retryingCreate, isBuyingSarco } = useSelector(s => s.embalmState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createSarcophagusStages, setCreateSarcophagusStages] = useState<Record<number, string>>(
    defaultCreateSarcophagusStages
  );

  const { archaeologists } = useSelector(x => x.embalmState);

  const {
    areFeesLoading,
    totalFees,
    formattedTotalDiggingFees,
    totalCurseFees,
    protocolFeeBasePercentage,
    totalDiggingFees,
    protocolFee,
    feesError,
  } = useSarcoFees();

  // TODO -- buffer is temporarily removed. Determine if we need a buffer.
  // When testing, it was confusing that swap amount was more than required fees.
  const totalFeesWithBuffer = totalFees;

  const { isSarcophagusFormDataComplete, parametersError } = useSarcophagusParameters();
  const { balance } = useSarcoBalance();

  const sarcoDeficit = totalFeesWithBuffer.sub(BigNumber.from(balance));

  const { sarcoQuoteETHAmount, sarcoQuoteInterval, sarcoQuoteError } = useSarcoQuote(sarcoDeficit);

  useEffect(() => {
    if (sarcoQuoteETHAmount === '0') {
      dispatch(clearSarcoQuoteInterval());
    }
  }, [dispatch, sarcoQuoteETHAmount]);

  useEffect(() => {
    if (!!sarcoQuoteInterval) {
      dispatch(setSarcoQuoteInterval(sarcoQuoteInterval));
    }
  }, [dispatch, sarcoQuoteInterval]);

  const {
    currentStage,
    handleCreate,
    stageError,
    stageInfo,
    retryStage,
    retryCreateSarcophagus,
    successData,
    clearSarcophagusState,
  } = useCreateSarcophagus(createSarcophagusStages, totalFeesWithBuffer);

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
    let stepsCopy = { ...defaultCreateSarcophagusStages };

    // remove approval step if user has enough allowance on sarco token
    if (allowance && BigNumber.from(allowance).gte(totalFeesWithBuffer)) {
      const { [CreateSarcophagusStage.APPROVE]: removedApproval, ...rest } = stepsCopy;
      stepsCopy = rest;
    }

    // remove buy sarco step if the user has enough sarco
    if (sarcoDeficit.lte(0) || !isBuyingSarco) {
      const { [CreateSarcophagusStage.BUY_SARCO]: removedBuySarco, ...rest } = stepsCopy;
      stepsCopy = rest;
    }

    // Only update state if there's a change
    if (JSON.stringify(stepsCopy) !== JSON.stringify(createSarcophagusStages)) {
      setCreateSarcophagusStages(stepsCopy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowance, isBuyingSarco, sarcoDeficit, totalFeesWithBuffer]); // Removed createSarcophagusStages from the dependency array

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

  if (areFeesLoading || feesError) {
    return (
      <Center
        height="100%"
        width="100%"
      >
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex
      direction="column"
      w="100%"
    >
      {!isCreateCompleted() && <Heading mb={6}>Create Sarcophagus</Heading>}

      {!isCreateProcessStarted() ? (
        <>
          <ReviewSarcophagus
            totalFees={totalFees}
            formattedTotalDiggingFees={formattedTotalDiggingFees}
            protocolFee={protocolFee}
            totalCurseFees={totalCurseFees}
            protocolFeeBasePercentage={protocolFeeBasePercentage}
          />
          <Flex
            alignSelf="center"
            display="flex"
            flexDirection="column"
            w={350}
            pt={6}
          >
            {sarcoDeficit.gt(0) && (
              <SwapInfo
                sarcoQuoteError={sarcoQuoteError}
                sarcoQuoteETHAmount={sarcoQuoteETHAmount}
                sarcoDeficit={sarcoDeficit}
                balance={balance}
                totalFeesWithBuffer={totalFeesWithBuffer}
              />
            )}
            <Button
              w="full"
              p={6}
              mt={6}
              onClick={handleCreate}
              isDisabled={
                areFeesLoading ||
                feesError ||
                parametersError ||
                !formattedTotalDiggingFees ||
                !totalDiggingFees ||
                !protocolFee ||
                (sarcoDeficit.gt(0) && !isBuyingSarco) ||
                !isSarcophagusFormDataComplete()
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
            {Object.keys(createSarcophagusStages)
              .map(stageIndexString => Number.parseInt(stageIndexString))

              // Necessarily, a couple of these mappings don't have UI importance, thus no titles.
              .filter(stageIndex => !!createSarcophagusStages[stageIndex])
              .map(stageIndex => {
                const stageName = createSarcophagusStages[stageIndex];
                const trueStageIndex = Object.values(defaultCreateSarcophagusStages).indexOf(
                  stageName
                );
                return (
                  <ProgressTrackerStage
                    stageIndex={trueStageIndex}
                    key={stageName}
                  >
                    {stageName}
                  </ProgressTrackerStage>
                );
              })}
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
                = See console for error details
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

      {/* TODO -- this needs to be updated to be dynamic, currently only accounts for one error case */}
      {retryingCreate && SHOW_RETRY_CREATE_MODAL ? (
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
