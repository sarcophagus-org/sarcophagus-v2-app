import {
  CloseButton,
  HStack,
  AlertStatus,
  ToastProps as ChakraToastProps,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';
import { colors } from 'theme/colors';

const defaultDuration = 5000;
const defaultPosition = 'bottom-right';

export function useSarcoToast() {
  const charkaToast = useToast();
  interface ToastProps extends Omit<ChakraToastProps, 'status' | 'description'> {
    description: React.ReactNode;
    status: AlertStatus;
    title?: string;
  }

  const open = (props: ToastProps): ToastId => {
    const { status, title, description, duration, position, isClosable } = props;

    return charkaToast({
      duration: duration === undefined ? defaultDuration : duration,
      position: position || defaultPosition,
      ...props,
      render: ({ onClose }) => (
        <HStack
          alignItems="flex-start"
          spacing={0}
          //TODO; set this to the colorscheme of the alert?
          bg="grayBlue.500"
        >
          <SarcoAlert
            title={title}
            status={status || 'info'}
            onClose={onClose}
          >
            {description}
          </SarcoAlert>
          {isClosable && <CloseButton onClick={onClose} />}
        </HStack>
      ),
    });
  };
  return { open };
}
