import { Button, useToast } from '@chakra-ui/react';
import { hexlify, solidityKeccak256 } from 'ethers/lib/utils';
import useArweaveService from 'hooks/useArweaveService';
import { LibP2pContext } from 'lib/network/P2PNodeProvider';
import { useCallback, useContext, useEffect, useState } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { useSelector } from '../../../store';
import { connectArchaeologists } from '../hooks/useConnectArchaeologists';

export function SubmitMock() {
  const toast = useToast();

  const arweaveService = useArweaveService();

  const selectedArchaeologists = useSelector(s => s.embalmState.selectedArchaeologists);
  const archaeologistsRequired = useSelector(s => s.embalmState.requiredArchaeologists);

  const [disabled, setDisabled] = useState(false);
  const browserNodeContext = useContext(LibP2pContext);

  const buildShardsBlob = useCallback(async () => {
    console.log('build shards');

    const archShards: Record<string, string> = {};
    const unencryptedArchShardHashes: Record<string, string> = {};

    // TODO: replace recipient's public key (in same format) when available
    const secret = Buffer.from(
      '0x04e74846db647eb80d06fefcb6aa8a8fe9a34c030c354fd723c1c24e4190e237f4e9cf5cef068bf53a750b2868bc4dd06d28df9ec408fbcb1fe3c33b590d2b1d45'
    );

    const shards = split(secret, {
      shares: selectedArchaeologists.length,
      threshold: archaeologistsRequired,
    }).map(s => hexlify(s));

    let shardI = 0;
    for await (const arch of selectedArchaeologists) {
      archShards[arch.publicKey!] = await arweaveService.encryptShard(
        shards[shardI],
        arch.publicKey!
      );
      unencryptedArchShardHashes[arch.profile.archAddress] = solidityKeccak256(
        ['string'],
        [shards[shardI]]
      );
      shardI++;
    }

    return [archShards, unencryptedArchShardHashes];
  }, [archaeologistsRequired, arweaveService, selectedArchaeologists]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('selectedArchaeologists', selectedArchaeologists);

    setDisabled(selectedArchaeologists.length < parseInt(archaeologistsRequired));

    if (!isSubmitting) return;

    let allArchsReady = selectedArchaeologists.length === parseInt(archaeologistsRequired);
    for (let i = 0; i < selectedArchaeologists.length; i++) {
      console.log('selectedArchaeologists[i].publicKey', selectedArchaeologists[i].publicKey);

      if (!selectedArchaeologists[i].publicKey) {
        allArchsReady = false;
        break;
      }
    }

    if (allArchsReady) {
      setIsSubmitting(false);
      buildShardsBlob();
    }
  }, [selectedArchaeologists, archaeologistsRequired, buildShardsBlob, isSubmitting]);

  async function handleSubmit() {
    setIsSubmitting(true);
    const browserNode = await browserNodeContext;
    await connectArchaeologists(selectedArchaeologists, browserNode!);
    // const [encryptedShards, unencryptedArchShardHashes] = await buildShardsBlob();

    // const arweaveTxId = await arweaveService.uploadArweaveFile(JSON.stringify(encryptedShards));
    // selectedArchaeologists.forEach(arch => confirmArweaveTransaction({
    //   arch,
    //   arweaveTxId,
    //   unencryptedShardHash: unencryptedArchShardHashes[arch.profile.archAddress],
    // }));

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
