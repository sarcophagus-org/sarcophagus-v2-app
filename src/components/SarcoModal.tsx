import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    useDisclosure,
    Box,
    Flex,
} from '@chakra-ui/react';
import { colors } from 'theme/colors';

interface ModalButtonProps {
    label: string;
    onClick: () => void;
    dismissesModal?: boolean;
}

interface SarcoModalProps {
    isDismissible?: boolean;
    image?: JSX.Element;
    title: string;
    subtitle?: string;
    primaryButton: ModalButtonProps,
    secondaryButton?: ModalButtonProps,
}

function useSarcoModal(props: SarcoModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        title,
        subtitle,
        image,
        primaryButton,
        secondaryButton,
        isDismissible = true,
    } = props;

    const modal = () =>
        <Modal closeOnOverlayClick={isDismissible} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent minWidth='484px' paddingX='46px' paddingY='26px' bgColor={colors.brand[100]}>

                {isDismissible && <Box height={5} />}

                <ModalHeader paddingY={38} fontSize={'20px'} fontWeight={400} textAlign='center'>
                    {title}
                </ModalHeader>

                {isDismissible && <ModalCloseButton />}

                <ModalBody >
                    <Flex
                        direction='column'
                        padding='32px'
                        border='solid'
                        borderColor={colors.brand[300]}
                        borderWidth='1px'
                        alignContent='center'
                        bgGradient="linear(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.09) 100%)"
                    >
                        <Text fontSize={'14px'} textAlign='center'>{subtitle ?? ''}</Text>
                        <Box height={30} />
                        <Button colorScheme='blue' onClick={() => {
                            primaryButton.onClick();
                            if (primaryButton.dismissesModal) onClose();
                        }}>
                            {primaryButton.label}
                        </Button>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    {secondaryButton &&
                        <Button variant='ghost' onClick={() => {
                            secondaryButton?.onClick();
                            if (secondaryButton?.dismissesModal) onClose();
                        }}>
                            {secondaryButton.label}
                        </Button>}
                </ModalFooter>
            </ModalContent>
        </Modal >;

    return { SarcoModal: modal, openModal: onOpen };
}

export { useSarcoModal };
