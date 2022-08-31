import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { readFileDataAsBase64 } from 'lib/utils/helpers';
import { useEffect } from 'react';
import { useBundlr } from '../hooks/useBundlr';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 */
export function UploadFile() {
  const { uploadFile, isConnected, isUploading, handleFileChange, file } = useBundlr();

  async function handleUpload() {
    if (!file) return;
    const buffer = await readFileDataAsBase64(file);
    await uploadFile(buffer);
  }

  useEffect(() => {}, []);

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
          disabled={!isConnected || isUploading}
          onChange={handleFileChange}
        ></Input>
        <Button
          mt={3}
          width={200}
          disabled={!isConnected}
          isLoading={isUploading}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
}
