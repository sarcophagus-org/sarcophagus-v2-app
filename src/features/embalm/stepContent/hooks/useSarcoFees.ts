import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    async function setFees() {
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
      if (newProtocolFee && protocolFeeBasePercentage) {
        totalProtocolFees = newProtocolFee.add(
          totalCurseFeesCalc.div(
            BigNumber.from(10000).div(BigNumber.from(protocolFeeBasePercentage))
          )
        );
      } else {
        totalProtocolFees = ethers.constants.Zero;
      }

      setProtocolFee(totalProtocolFees);

      // Calculate and set digging and curse fees
      const diggingFeesAndCurseFees = newTotalDiggingFees.add(totalCurseFeesCalc);
      dispatch(setTotalFees(diggingFeesAndCurseFees.add(totalProtocolFees)));
    }

    setFees();
  }, [dispatch, protocolFeeBasePercentage, resurrection, selectedArchaeologists, timestampMs]);

  return {
    totalFees,
    totalDiggingFees,
    formattedTotalDiggingFees,
    protocolFee,
    totalCurseFees,
    protocolFeeBasePercentage,
  };
}
