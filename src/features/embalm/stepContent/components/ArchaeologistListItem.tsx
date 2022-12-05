import { Flex, Td, Text, Tr, Button, Checkbox } from '@chakra-ui/react';
import { Archaeologist } from '../../../../types/index';
import { formatAddress } from 'lib/utils/helpers';
import { selectArchaeologist, deselectArchaeologist } from 'store/embalm/actions';
import { ethers } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import { useAttemptDialArchaeologists } from '../../../../hooks/utils/useAttemptDialArchaeologists';
import { SarcoTokenIcon } from 'components/icons';
import { useDispatch } from 'store/index';
import { useEnsName } from 'wagmi';
import { useNetworkConfig } from 'lib/config';

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

  const { data } = useEnsName({
    address: archaeologist.profile.archAddress as `0x${string}`,
    chainId: networkConfig.chainId,
  });

  const formattedArchAddress = () => {
    return data ?? formatAddress(archaeologist.profile.archAddress);
  };

  function TableContent({ children, icon, checkbox }: TableContentProps) {
    return (
      <Td isNumeric>
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
              colorScheme="checkboxScheme"
            ></Checkbox>
          )}
          <Text
            ml={3}
            bg={'table.textBackground'}
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
      background={isSelected ? (archaeologist.exception ? 'errorHighlight' : 'brand.50') : ''}
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
        {Number(ethers.utils.formatEther(archaeologist.profile.minimumDiggingFee))
          .toFixed(0)
          .toString()
          .concat(' SARCO')}
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
            onClick={() => testDialArchaeologist(archaeologist.fullPeerId!)}
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
