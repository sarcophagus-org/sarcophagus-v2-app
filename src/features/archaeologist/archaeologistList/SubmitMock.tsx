import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from '../../../store';
import { formatAddress } from '../../../utils/helpers';

export function SubmitMock() {
  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);
  const archaeologistsRequired = useSelector(s => s.archaeologistState.archaeologistsRequired);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(selectedArchaeologists.length < archaeologistsRequired);
  }, [selectedArchaeologists, archaeologistsRequired]);

  function handleSubmit() {
    const archCount = selectedArchaeologists.length;
    alert(
      `DEV MESSAGE \n\n${archCount} archaeologists selected requiring ${archaeologistsRequired} of ${archCount} to unwrap.\n\n Selected Archaeologists:\n${selectedArchaeologists
        .map(x => formatAddress(x))
        .join('\n')}`
    );
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
