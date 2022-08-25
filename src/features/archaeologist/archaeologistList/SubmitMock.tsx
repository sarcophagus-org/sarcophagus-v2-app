import { Button, useToast } from '@chakra-ui/react';
import { hexlify, solidityKeccak256 } from 'ethers/lib/utils';
import useArweaveService from 'hooks/useArweaveService';
import { useEffect, useState } from 'react';
import { useSelector } from '../../../store';
import { confirmArweaveTransaction } from '../discovery';
import { split } from 'shamirs-secret-sharing-ts';

export function SubmitMock() {
  const toast = useToast();

  const arweaveService = useArweaveService();

  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);
  const archaeologistsRequired = useSelector(s => s.archaeologistState.archaeologistsRequired);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(selectedArchaeologists.length < archaeologistsRequired);
  }, [selectedArchaeologists, archaeologistsRequired]);

  async function buildShardsBlob() {
    const archShards: Record<string, string> = {};
    const unencryptedArchShardHashes: Record<string, string> = {};

    // TODO: replace recipient's public key (in same format) when available
    const secret = Buffer.from('0x04e74846db647eb80d06fefcb6aa8a8fe9a34c030c354fd723c1c24e4190e237f4e9cf5cef068bf53a750b2868bc4dd06d28df9ec408fbcb1fe3c33b590d2b1d45');

    const shards = split(secret, {
      shares: selectedArchaeologists.length,
      threshold: archaeologistsRequired,
    }).map(s => hexlify(s));

    let shardI = 0;
    for await (const arch of selectedArchaeologists) {
      archShards[arch.publicKey] = await arweaveService.encryptShard(shards[shardI], arch.publicKey);
      unencryptedArchShardHashes[arch.address] = solidityKeccak256(['string'], [shards[shardI]]);
      shardI++;
    }

    return [archShards, unencryptedArchShardHashes];
  }

  async function handleSubmit() {
    const [encryptedShards, unencryptedArchShardHashes] = await buildShardsBlob();

    const arweaveTxId = await arweaveService.uploadArweaveFile(JSON.stringify(encryptedShards));
    selectedArchaeologists.forEach(arch => confirmArweaveTransaction({
      arch,
      arweaveTxId,
      unencryptedShardHash: unencryptedArchShardHashes[arch.address],
    }));

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
