import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { setTotalFees } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function useSarcoFees() {
  const dispatch = useDispatch();
  const { selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const { timestampMs } = useSelector(x => x.appState);
  const { totalFees } = useSelector(x => x.embalmState);

  const [totalDiggingFees, setTotalDiggingFees] = useState(ethers.constants.Zero);
  const [formattedTotalDiggingFees, setFormattedTotalDiggingFees] = useState('');
  const [protocolFee, setProtocolFee] = useState(ethers.constants.Zero);
  const [totalCurseFees, setTotalCurseFees] = useState(ethers.constants.Zero);
  const [protocolFeeBasePercentage, setProtocolFeeBasePercentage] = useState('');
  const [feesError, setFeesError] = useState(false);
  const [areFeesLoading, setAreFeesLoading] = useState(true);

  const retryInterval = 1000; // Time in milliseconds to wait before retrying
  const maxRetries = 10; // Maximum number of retries

  const setFeesWithRetry = useCallback(
    async (retryCount: number = 0) => {
      try {
        // Get the fees
        const {
          totalDiggingFees: newTotalDiggingFees,
          protocolFee: newProtocolFee,
          formattedTotalDiggingFees: newFormattedTotalDiggingFees,
          protocolFeeBasePercentage: newProtocolFeeBasePercentage,
        } = await sarco.archaeologist.getTotalFeesInSarco(
          selectedArchaeologists,
          resurrection,
          timestampMs
        );

        // Set the fees in state
        setTotalDiggingFees(newTotalDiggingFees);
        setFormattedTotalDiggingFees(newFormattedTotalDiggingFees);
        setProtocolFeeBasePercentage(newProtocolFeeBasePercentage.toString());

        // Calculate and set total curse fees
        const totalCurseFeesCalc = selectedArchaeologists.reduce(
          (acc, archaeologist) => acc.add(archaeologist.profile.curseFee),
          ethers.constants.Zero
        );
        setTotalCurseFees(totalCurseFeesCalc);

        // TODO -- protocol fees with curse fees should happen in the SDK
        let totalProtocolFees;
        if (newProtocolFee && newProtocolFeeBasePercentage) {
          totalProtocolFees = newProtocolFee.add(
            totalCurseFeesCalc.div(
              BigNumber.from(10000).div(BigNumber.from(newProtocolFeeBasePercentage))
            )
          );
        } else {
          totalProtocolFees = ethers.constants.Zero;
        }

        setProtocolFee(totalProtocolFees);

        // Calculate and set digging and curse fees
        const diggingFeesAndCurseFees = newTotalDiggingFees.add(totalCurseFeesCalc);
        dispatch(setTotalFees(diggingFeesAndCurseFees.add(totalProtocolFees)));
      } catch (error) {
        if (retryCount < maxRetries) {
          console.log(`retrying setFeesWithRetry... #${retryCount}`);
          setTimeout(() => setFeesWithRetry(retryCount + 1), retryInterval);
        } else {
          setFeesError(true);
          console.error(`error in fetchFeesWithRetry: ${error}`);
        }
      } finally {
        setAreFeesLoading(false);
      }
    },
    [dispatch, timestampMs, selectedArchaeologists, resurrection]
  );

  useEffect(() => {
    setAreFeesLoading(true);
    setFeesWithRetry();
  }, [
    dispatch,
    protocolFeeBasePercentage,
    resurrection,
    selectedArchaeologists,
    timestampMs,
    setFeesWithRetry,
  ]);

  return {
    areFeesLoading,
    feesError,
    totalFees,
    totalDiggingFees,
    formattedTotalDiggingFees,
    protocolFee,
    totalCurseFees,
    protocolFeeBasePercentage,
  };
}
