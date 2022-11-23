import { Input, Link, Text, VStack } from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import prettyBytes from 'pretty-bytes';
import { useSelector } from 'store/index';
import { FileDragAndDrop } from '../components/FileDragAndDrop';
import { useUploadPayload } from '../hooks/useUploadPayload';

export function UploadPayload() {
  const { error, file, handleSetFile, fileInputRef } = useUploadPayload();
  const { formattedUploadPrice } = useUploadPrice();
  const isConnected = useSelector(x => x.bundlrState.isConnected);

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
    <VStack
      w="100%"
      align="left"
    >
      <Text
        mb={6}
        variant="secondary"
      >
        Your payload (corpse) will be wrapped in a later step.
      </Text>
      {error && (
        <SarcoAlert
          mb={3}
          status="error"
        >
          {error}
        </SarcoAlert>
      )}
      <FileDragAndDrop
        onClick={handleClickFilePicker}
        handleFileDrop={handleFileDrop}
      >
        {file ? (
          <VStack spacing={3}>
            <Text
              px={2}
              align="center"
            >
              {file.name}
            </Text>
            <Text>Size: {prettyBytes(file.size)}</Text>
            <Text>
              {"Bundlr's upload price: "}
              {isConnected ? formattedUploadPrice : 'Not connected to the Bundlr'}
            </Text>
            <Link textDecor="underline">Upload a different file</Link>
          </VStack>
        ) : (
          <Text>
            Drag and drop or <Link textDecor="underline">browse files</Link>
          </Text>
        )}
      </FileDragAndDrop>
      <Input
        hidden
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </VStack>
  );
}
