import { Button, Checkbox, Flex, Heading, Text } from '@chakra-ui/react';
import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { RetryCreateModal } from 'components/RetryCreateModal';
import { BigNumber } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { RouteKey, RoutesPathMap } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract, useSigner } from 'wagmi';
import { useAllowance } from '../../../../hooks/sarcoToken/useAllowance';
import { useNetworkConfig } from '../../../../lib/config';
import { useDispatch, useSelector } from '../../../../store';
import {
  goToStep,
  setArchaeologists,
  setCancelToken,
  setSarcoQuoteInterval,
  toggleIsBuyingSarco,
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

export function CreateSarcophagus() {
  const { refreshProfiles } = useLoadArchaeologists();
  const { cancelCreateToken, retryingCreate, isBuyingSarco } = useSelector(s => s.embalmState);
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

  const { archaeologists } = useSelector(x => x.embalmState);

  const { totalFees, totalDiggingFees, protocolFee } = useSarcoFees();

  const totalFeesWithBuffer = totalFees.add(totalFees.div(10));

  const { isSarcophagusFormDataComplete, isError } = useSarcophagusParameters();
  const { balance } = useSarcoBalance();

  const sarcoDeficit = totalFeesWithBuffer.sub(BigNumber.from(balance));

  const { sarcoQuoteETHAmount, sarcoQuoteInterval } = useSarcoQuote(sarcoDeficit);

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
  } = useCreateSarcophagus(createSarcophagusStages, embalmerFacet!, totalFeesWithBuffer);

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

  function handleChangeBuySarcoChecked() {
    dispatch(toggleIsBuyingSarco());
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
          <Flex
            alignSelf="center"
            display="flex"
            flexDirection="column"
            w={350}
            pt={6}
          >
            {sarcoDeficit.gt(0) && (
              <Flex flexDirection="column">
                <Checkbox
                  defaultChecked
                  isChecked={isBuyingSarco}
                  onChange={handleChangeBuySarcoChecked}
                >
                  <Text>Automatically buy SARCO</Text>
                </Checkbox>
                <Text
                  mt={3}
                  variant="secondary"
                >
                  {isBuyingSarco
                    ? `${sarco.utils.formatSarco(
                        sarcoQuoteETHAmount,
                        4
                      )} ETH will be swapped for ${sarco.utils.formatSarco(
                        sarcoDeficit.toString()
                      )} SARCO before the sarcophagus is created.`
                    : "You don't have enough SARCO to cover the fees. You can check the box to automatically buy the required SARCO token"}
                </Text>
              </Flex>
            )}
            <Button
              w="full"
              p={6}
              mt={6}
              onClick={handleCreate}
              isDisabled={
                !totalDiggingFees ||
                !protocolFee ||
                (balance?.lte(totalDiggingFees.add(protocolFee)) && !isBuyingSarco) ||
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
