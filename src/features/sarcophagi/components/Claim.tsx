import { Button, Center, Flex, Link, Spinner, Text, Textarea } from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';
import { BigNumber, ethers } from 'ethers';
import { useResurrection } from 'features/resurrection/hooks/useResurrection';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function Claim() {
  const { id } = useParams();
  const [privateKey, setPrivateKey] = useState('');
  const { sarcophagus, isLoading: isLoadingSarcophagus } = useGetSarcophagusDetails({
    sarcoId: id,
  });
  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0)
  );

  const {
    canResurrect,
    resurrect,
    isResurrecting,
    isLoading: isLoadingResurrection,
  } = useResurrection(id || ethers.constants.HashZero, privateKey);

  const handleChangePrivateKey = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrivateKey(e.target.value);
  };

  // linkRef is used to automatically trigger a download
  const linkRef = useRef<HTMLAnchorElement>(null);
  async function handleResurrect() {
    const { fileName, data } = await resurrect();
    const dataUrl = data.toString();
    if (linkRef.current) {
      linkRef.current.href = dataUrl;
      linkRef.current.download = fileName;
      linkRef.current.click();
    }
  }

  return (
    <Flex
      direction="column"
      align="left"
    >
      <Link ref={linkRef} />
      <Text>Resurrection Date</Text>
      <Text variant="secondary">{sarcophagus?.resurrectionTime ? resurrectionString : '--'}</Text>
      {!isLoadingResurrection && !isLoadingSarcophagus ? (
        <>
          {canResurrect ? (
            <>
              <Text mt={12}>Sarcophagus Private Key</Text>
              <Textarea
                mt={2}
                w="100%"
                h="100px"
                value={privateKey}
                onChange={handleChangePrivateKey}
                placeholder="0x0000..."
              />
              <Text mt={2}>Please enter the Private Key to decrypt the Sarcophagus</Text>
              <Button
                w="fit-content"
                disabled={!canResurrect}
                mt={6}
                onClick={handleResurrect}
                isLoading={isResurrecting}
              >
                Decrypt and Download
              </Button>
            </>
          ) : (
            <Flex mt={12}>
              <SarcoAlert status="warning">This Sarcophagus cannot be claimed yet.</SarcoAlert>
            </Flex>
          )}
        </>
      ) : (
        <Center mt={12}>
          <Spinner size="lg" />
        </Center>
      )}
    </Flex>
  );
}
