import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { readFileDataAsBase64 } from '../../lib/utils/helpers';
import { useBundlr } from './hooks/useBundlr';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 */
export function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const { uploadFile, isConnected } = useBundlr();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) return;
    const buffer = await readFileDataAsBase64(file);
    await uploadFile(buffer);
  }

  return (
    <Flex
      mt={6}
      direction="column"
    >
      <Heading size="md">Upload Payload</Heading>
      <Flex
        mt={6}
        direction="column"
      >
        <Input
          border="none"
          width={300}
          type="file"
          disabled={!isConnected}
          onChange={handleFileChange}
        ></Input>
        <Button
          mt={3}
          width={200}
          disabled={!isConnected}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
}
