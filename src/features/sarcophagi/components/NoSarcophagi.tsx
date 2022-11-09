import { Button, Center, CenterProps } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Component that shows when there are no sarcophagi to display on the sarcohagi component
export function NoSarcpohagi(props: CenterProps) {
  const navigate = useNavigate();

  function handleClickCreate() {
    navigate('/embalm');
  }
  return (
    <Center
      border="1px solid"
      borderColor="whiteAlpha.300"
      py={8}
      {...props}
    >
      <Button
        variant="link"
        onClick={handleClickCreate}
      >
        Create a Sarcophagus
      </Button>
    </Center>
  );
}
