import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
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
    children: JSX.Element[];
    isDismissible: boolean;
    coverImage?: JSX.Element;
    title?: JSX.Element;
    secondaryButton?: ModalButtonProps,
}

function useSarcoModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const modal = (props: SarcoModalProps) =>
        <Modal closeOnOverlayClick={props.isDismissible} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent minWidth='484px' paddingX='46px' paddingY='26px' bgColor={colors.brand[100]}>

                {props.isDismissible ?? < Box height={5} />}

                {(!!props.title || !!props.coverImage) ?
                    <ModalHeader paddingY={38}>
                        <Flex direction='column' alignItems={'center'}>
                            {props.coverImage}
                            {props.title}
                        </Flex>
                    </ModalHeader> : <Box height={30} />
                }

                {props.isDismissible && <ModalCloseButton />}

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
                        {props.children}
                    </Flex>
                </ModalBody>

                <ModalFooter alignSelf={'center'}>
                    {props.secondaryButton &&
                        <Button variant='ghost' onClick={() => {
                            props.secondaryButton?.onClick();
                            if (props.secondaryButton?.dismissesModal) onClose();
                        }}>
                            {props.secondaryButton.label}
                        </Button>}
                </ModalFooter>
            </ModalContent>
        </Modal >;

    return { SarcoModal: modal, openModal: onOpen, closeModal: onClose };
}

export { useSarcoModal };
