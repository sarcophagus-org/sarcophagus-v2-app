import { Box, Button, Checkbox, Flex, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { SarcoTokenIcon } from 'components/icons';
import { useNetworkConfig } from 'lib/config';
import {
  calculateDiggingFees,
  convertSarcoPerSecondToPerMonth,
  formatAddress,
  formatSarco,
} from 'lib/utils/helpers';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  deselectArchaeologist,
  selectArchaeologist,
  setArchaeologistEnsName,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useEnsName } from 'wagmi';
import { useAttemptDialArchaeologists } from '../../../../hooks/utils/useAttemptDialArchaeologists';
import { MultiLineTooltip } from './MultiLineTooltip';
import { ArchaeologistData } from 'sarcophagus-v2-sdk/src/types/archaeologist';

interface ArchaeologistListItemProps {
  archaeologist: ArchaeologistData;
  isSelected: boolean;
  includeDialButton: boolean;
  isDialing: boolean;
  setIsDialing: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
}

interface TableContentProps {
  children: React.ReactNode;
  icon: boolean;
  checkbox: boolean;
  align?: string;
  multiLineTooltipLabel?: string[] | null;
}

export function ArchaeologistListItem({
  isSelected,
  archaeologist,
  includeDialButton,
  isDialing,
  setIsDialing,
  onClick: handleClickRow,
}: ArchaeologistListItemProps) {
  const { testDialArchaeologist } = useAttemptDialArchaeologists(setIsDialing);
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const rowTextColor = isSelected ? (archaeologist.exception ? '' : 'brand.950') : '';

  const resurrectionTime = useSelector(s => s.embalmState.resurrection);
  const { timestampMs } = useSelector(s => s.appState);

  const diggingFees = calculateDiggingFees(archaeologist, resurrectionTime, timestampMs);

  const totalFees = diggingFees?.add(archaeologist.profile.curseFee);

  const { data: ensName } = useEnsName({
    address: archaeologist.profile.archAddress as `0x${string}`,
    chainId: networkConfig.chainId,
  });

  useEffect(() => {
    if (!ensName) return;
    dispatch(setArchaeologistEnsName(archaeologist.profile.peerId, ensName));
  }, [archaeologist.profile.peerId, dispatch, ensName]);

  const formattedArchAddress = () => {
    return ensName ?? formatAddress(archaeologist.profile.archAddress);
  };

  function TableContent({
    children,
    icon,
    checkbox,
    align,
    multiLineTooltipLabel,
  }: TableContentProps) {
    return (
      <Td
        borderBottom="none"
        isNumeric
      >
        <MultiLineTooltip
          lines={multiLineTooltipLabel ?? []}
          placement="top"
        >
          <Flex justify={align || (icon || checkbox ? 'left' : 'center')}>
            {icon && <SarcoTokenIcon boxSize="18px" />}
            {checkbox && (
              <Checkbox
                isChecked={isSelected}
                onChange={() => {
                  if (isSelected === true) {
                    dispatch(selectArchaeologist(archaeologist));
                  } else {
                    dispatch(deselectArchaeologist(archaeologist.profile.archAddress));
                  }
                }}
              />
            )}
            <Box width={!icon && !checkbox ? '4' : '0'} />
            <Text
              ml={3}
              bg={archaeologist.hiddenReason ? 'transparent.red' : 'grayBlue.950'}
              color={rowTextColor}
              py={0.5}
              px={2}
              borderRadius="2px"
            >
              {children}
            </Text>
          </Flex>
        </MultiLineTooltip>
      </Td>
    );
  }

  return (
    <Tooltip
      label={archaeologist.hiddenReason}
      placement="top"
    >
      <Tr
        background={
          isSelected
            ? archaeologist.exception || archaeologist.hiddenReason
              ? 'background.red'
              : 'brand.50'
            : ''
        }
        onClick={() => handleClickRow()}
        cursor="pointer"
        _hover={isSelected ? {} : { background: 'brand.0' }}
      >
        <TableContent
          icon={false}
          checkbox={!archaeologist.hiddenReason}
          align="left"
        >
          {formattedArchAddress()}
        </TableContent>

        <TableContent
          icon={true}
          checkbox={false}
          multiLineTooltipLabel={
            diggingFees && [
              `Digging fee: ${formatSarco(diggingFees?.toString() ?? '0')}`,
              `Curse fee: ${formatSarco(archaeologist.profile.curseFee.toString())}`,
            ]
          }
        >
          {diggingFees
            ? formatSarco(totalFees?.toString() ?? '0')
            : formatSarco(
                convertSarcoPerSecondToPerMonth(
                  archaeologist.profile.minimumDiggingFeePerSecond.toString()
                )
              )}
        </TableContent>
        <TableContent
          icon={false}
          checkbox={false}
        >
          {archaeologist.profile.successes.toString()}
        </TableContent>
        <TableContent
          icon={false}
          checkbox={false}
        >
          {archaeologist.profile.failures.toString()}
        </TableContent>

        {includeDialButton ? (
          <Td>
            <Button
              disabled={isDialing || !!archaeologist.connection}
              onClick={() => testDialArchaeologist(archaeologist, true)}
            >
              {archaeologist.connection ? 'Connected' : 'Dial'}
            </Button>
          </Td>
        ) : (
          <></>
        )}
      </Tr>
    </Tooltip>
  );
}
