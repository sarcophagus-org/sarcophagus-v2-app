import { Flex, Heading, Input, Link, Text, VStack } from '@chakra-ui/react';
import { Alert } from 'components/Alert';
import { FileDragAndDrop } from '../components/FileDragAndDrop';
import { useUploadPayload } from '../hooks/useUploadPayload';

export function UploadPayload() {
  const { error, file, handleSetFile, fileInputRef } = useUploadPayload();

  function handleClickFilePicker() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFile = e.target.files?.[0];
    handleSetFile(newFile);
  }

  async function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer) return;
    const newFile = e.dataTransfer.files[0];
    handleSetFile(newFile);
  }

  return (
    <Flex
      w="100%"
      direction="column"
    >
      <Heading>Upload your payload</Heading>
      <Text mt={4}>Your payload (corpse) will be wrapped in a later step.</Text>
      <Flex h={12} />
      {error && (
        <Alert
          mb={3}
          status="error"
        >
          {error}
        </Alert>
      )}
      <FileDragAndDrop handleFileDrop={handleFileDrop}>
        {file ? (
          <VStack spacing={3}>
            <Text>{file.name}</Text>
            <Link
              textDecor="underline"
              onClick={handleClickFilePicker}
            >
              Upload a different file
            </Link>
          </VStack>
        ) : (
          <Text>
            Drag and drop or{' '}
            <Link
              textDecor="underline"
              onClick={handleClickFilePicker}
            >
              browse files
            </Link>
          </Text>
        )}
      </FileDragAndDrop>
      <Input
        hidden
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </Flex>
  );
}
