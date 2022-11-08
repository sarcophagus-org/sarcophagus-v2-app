import { Button, Flex, FormLabel, Heading, Input, Link, VStack } from '@chakra-ui/react';
import { useResurrection } from 'features/resurrection/hooks/useResurrection';
import React, { useState } from 'react';

export function TempResurrectionPage() {
  const [sarcoId, setSarcoId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const { canResurrect, resurrect } = useResurrection(sarcoId, privateKey);

  // linkRef is used to automatically trigger a download
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  // Resurrects and clicks the link to download the file
  async function handleClickResurrect() {
    const { fileName, data } = await resurrect();
    const dataUrl = data.toString();
    if (linkRef.current) {
      linkRef.current.href = dataUrl;
      linkRef.current.download = fileName;
      linkRef.current.click();
    }
  }

  function handleChangeSarcoId(e: React.ChangeEvent<HTMLInputElement>) {
    setSarcoId(e.target.value);
  }

  function handleChangePrivateKey(e: React.ChangeEvent<HTMLInputElement>) {
    setPrivateKey(e.target.value);
  }

  return (
    <Flex
      direction="column"
      p={6}
      w={650}
    >
      <Link ref={linkRef} />
      <VStack spacing={6}>
        <Heading>Temporary Resurrection page</Heading>
        <FormLabel w="100%">Sarcophagus ID</FormLabel>
        <Input
          placeholder="Sarcophagus ID"
          value={sarcoId}
          onChange={handleChangeSarcoId}
        />
        <FormLabel w="100%">Private Key</FormLabel>
        <Input
          placeholder="Private Key"
          value={privateKey}
          onChange={handleChangePrivateKey}
        />
        <Button
          w="100%"
          disabled={!canResurrect || sarcoId.trim() === '' || privateKey.trim() === ''}
          onClick={handleClickResurrect}
        >
          Resurrect
        </Button>
      </VStack>
    </Flex>
  );
}
