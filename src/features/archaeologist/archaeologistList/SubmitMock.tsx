import { Button, useToast } from '@chakra-ui/react';
import { solidityKeccak256 } from 'ethers/lib/utils';
import useArweaveService from 'hooks/useArweaveService';
import { useEffect, useState } from 'react';
import { useSelector } from '../../../store';
import { confirmArweaveTransaction } from '../discovery';

export function SubmitMock() {
  const toast = useToast();

  const arweaveService = useArweaveService();

  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);
  const archaeologistsRequired = useSelector(s => s.archaeologistState.archaeologistsRequired);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(selectedArchaeologists.length < archaeologistsRequired);
  }, [selectedArchaeologists, archaeologistsRequired]);

  function handleSubmit() {
    const connectedArchAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';

    const unencryptedShard = 'arch2encryptedShard';

    arweaveService.uploadArweaveFile(`{"${connectedArchAddress}": "${unencryptedShard}-but-encrypted"}`).then(arweaveTxId => {
      selectedArchaeologists.forEach(archAddress => confirmArweaveTransaction({
        archAddress,
        arweaveTxId,
        unencryptedShardHash: solidityKeccak256(['string'], [unencryptedShard]),
      })
      );
    });

    const archCount = selectedArchaeologists.length;
    toast({
      title: 'Uploaded to arweave and sent id to archaeologists for review!',
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
