import { Button, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from '../../../store';

export function SubmitMock() {
  const toast = useToast();

  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);
  const archaeologistsRequired = useSelector(s => s.archaeologistState.archaeologistsRequired);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(selectedArchaeologists.length < archaeologistsRequired);
  }, [selectedArchaeologists, archaeologistsRequired]);

  function handleSubmit() {
    const archCount = selectedArchaeologists.length;
    toast({
      title: 'Fake submitted fake archaeologists!',
      description: `${archCount} archaeologists selected requiring ${archaeologistsRequired} of ${archCount} to unwrap.`,
      status: 'success',
    });
  }

  return (
    <Button
      background="grey"
      onClick={handleSubmit}
      disabled={disabled}
    >
      Submit
    </Button>
  );
}
