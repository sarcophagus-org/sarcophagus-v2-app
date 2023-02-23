import { Button, Checkbox, Flex, Td, Text, Tr } from '@chakra-ui/react';
import { SarcoTokenIcon } from 'components/icons';
import { useNetworkConfig } from 'lib/config';
import { convertSarcoPerSecondToPerMonth, formatAddress, formatSarco } from 'lib/utils/helpers';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { useEnsName } from 'wagmi';
import { useAttemptDialArchaeologists } from '../../../../hooks/utils/useAttemptDialArchaeologists';
import { Archaeologist } from '../../../../types/index';

interface ArchaeologistListItemProps {
  archaeologist: Archaeologist;
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
}

export function ArchaeologistListItem({
  isSelected,
  archaeologist,
  includeDialButton,
  isDialing,
  setIsDialing,
  onClick,
}: ArchaeologistListItemProps) {
  const { testDialArchaeologist } = useAttemptDialArchaeologists(setIsDialing);
  const dispatch = useDispatch();
  const networkConfig = useNetworkConfig();
  const rowTextColor = isSelected ? (archaeologist.exception ? '' : 'brand.950') : '';

  const resurrectionTime = useSelector(s => s.embalmState.resurrection);

  const diggingFees = useMemo(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    const resurrectionTimeSec = Math.floor(resurrectionTime / 1000);
    return resurrectionTimeSec > nowSec
      ? archaeologist.profile.minimumDiggingFeePerSecond.mul(resurrectionTimeSec - nowSec)
      : null;
  }, [archaeologist.profile.minimumDiggingFeePerSecond, resurrectionTime]);

  const { data } = useEnsName({
    address: archaeologist.profile.archAddress as `0x${string}`,
    chainId: networkConfig.chainId,
  });

  const formattedArchAddress = () => {
    return data ?? formatAddress(archaeologist.profile.archAddress);
  };

  function TableContent({ children, icon, checkbox }: TableContentProps) {
    return (
      <Td
        borderBottom="none"
        isNumeric
      >
        <Flex justify={icon || checkbox ? 'left' : 'center'}>
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
            ></Checkbox>
          )}
          <Text
            ml={3}
            bg={'grayBlue.950'}
            color={rowTextColor}
            py={0.5}
            px={2}
            borderRadius="2px"
          >
            {children}
          </Text>
        </Flex>
      </Td>
    );
  }

  const handleClickRow = () => {
    onClick();
  };

  return (
    <Tr
      background={isSelected ? (archaeologist.exception ? 'background.red' : 'brand.50') : ''}
      onClick={() => handleClickRow()}
      cursor="pointer"
      _hover={isSelected ? {} : { background: 'brand.0' }}
    >
      <TableContent
        icon={false}
        checkbox={true}
      >
        {formattedArchAddress()}
      </TableContent>

      <TableContent
        icon={true}
        checkbox={false}
      >
        {/* TODO: this shows monthly values. will need to be updated to show actual digging fees based on resurrection time */}
        {/* We may want to show the monthly values on the "archaeologists" page */}
        {diggingFees
          ? formatSarco(diggingFees.toString())
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
  );
}
