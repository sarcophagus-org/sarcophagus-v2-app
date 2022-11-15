import { Flex, Image, Td, Text, Tr, Button, Checkbox, Spinner } from '@chakra-ui/react';
import { Archaeologist } from '../../../../types/index';
import { formatAddress } from 'lib/utils/helpers';
import { selectArchaeologist, deselectArchaeologist } from 'store/embalm/actions';
import { ethers } from 'ethers';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAttemptDialArchaeologists } from '../../../../hooks/utils/useAttemptDialArchaeologists';
import { useDialArchaeologists } from '../hooks/useCreateSarcophagus/useDialArchaeologists';

import { useDispatch } from 'store/index';

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
  const [isPinging, setIsPinging] = useState(false);
  const { testDialArchaeologist } = useAttemptDialArchaeologists(setIsDialing);
  const { pingArchaeologist } = useDialArchaeologists();
  const dispatch = useDispatch();

  const rowTextColor = isSelected ? (archaeologist.exception ? '' : 'brand.950') : '';

  function TableContent({ children, icon, checkbox }: TableContentProps) {
    return (
      <Td isNumeric>
        <Flex justify={icon || checkbox ? 'left' : 'center'}>
          {icon && (
            <Image
              src="sarco-token-icon.png"
              w="18px"
              h="18px"
            />
          )}
          {isPinging && checkbox ? (
            <Spinner
              size="sm"
              mr={'10px'}
            />
          ) : (
            <></>
          )}
          {checkbox && (
            <Checkbox
              isChecked={isSelected && true}
              onChange={() => {
                if (isSelected === true) {
                  dispatch(selectArchaeologist(archaeologist));
                } else {
                  dispatch(deselectArchaeologist(archaeologist.profile.archAddress));
                }
              }}
              colorScheme="blue"
            ></Checkbox>
          )}
          <Text
            ml={3}
            bg={'brand.100'}
            color={rowTextColor}
            py={0.5}
            px={2}
          >
            {children}
          </Text>
        </Flex>
      </Td>
    );
  }

  const handleClickRow = () => {
    onClick();

    if (!isSelected) {
      setIsPinging(true);
      pingArchaeologist(archaeologist.fullPeerId!, () => setIsPinging(false));
    }
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
        {formatAddress(archaeologist.profile.archAddress)}
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
        {archaeologist.profile.cleanups.toString()}
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
