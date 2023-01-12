import { CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Textarea } from '@chakra-ui/react';
import { AddIcon } from 'components/icons';

interface PrivateKeyInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showAddButton?: boolean;
  hideRemoveButton?: boolean;
  onClickAddButton?: () => void;
  onClickRemoveButton?: () => void;
}

export function PrivateKeyInput({
  value,
  onChange,
  showAddButton,
  hideRemoveButton,
  onClickAddButton,
  onClickRemoveButton,
}: PrivateKeyInputProps) {
  return (
    <Flex
      position="relative"
      mb={6}
    >
      <Textarea
        placeholder="0x000..."
        value={value}
        onChange={onChange}
        h={125}
        p={6}
        resize="none"
        spellCheck={false}
      />
      <Flex
        position="absolute"
        right="-48px"
        justify="flex-start"
        direction="column"
      >
        {showAddButton && (
          <IconButton
            size="sm"
            variant="unstyled"
            aria-label="Add Private Key"
            icon={<AddIcon />}
            onClick={onClickAddButton}
          />
        )}
        {!hideRemoveButton && (
          <IconButton
            color="brand.700"
            size="sm"
            variant="unstyled"
            aria-label="Remove Private Key"
            icon={<CloseIcon />}
            onClick={onClickRemoveButton}
          />
        )}
      </Flex>
    </Flex>
  );
}
