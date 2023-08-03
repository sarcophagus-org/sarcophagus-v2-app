import { Input, Link, Text, Tooltip, VStack } from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { maxSarcophagusNameLength } from 'lib/constants';
import prettyBytes from 'pretty-bytes';
import { FileDragAndDrop } from '../components/FileDragAndDrop';
import { useUploadPayload } from '../hooks/useUploadPayload';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';

export function UploadPayload() {
  const { error, file, handleSetFile, fileInputRef } = useUploadPayload();
  const { formattedUploadPrice } = useUploadPrice();

  const { isBundlrConnected } = useSupportedNetwork();

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

  const formattedFilename = !file
    ? ''
    : file.name.length > maxSarcophagusNameLength * 2
    ? `${file.name.slice(0, maxSarcophagusNameLength * 2 - 4)}...`
    : file.name;

  const filenameTooltip =
    !!file && file.name.length > maxSarcophagusNameLength * 2 ? file.name : '';

  return (
    <VStack
      w="100%"
      align="left"
    >
      <Text
        mb={6}
        variant="secondary"
      >
        This is the payload the recipient will receive when you fail to rewrap (attest).
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
            <Tooltip label={filenameTooltip}>
              <Text
                px={2}
                maxW={600}
                align="center"
                flexWrap={'wrap'}
              >
                {formattedFilename}
              </Text>
            </Tooltip>
            <Text>Size: {prettyBytes(file.size)}</Text>
            <Text>
              {"Bundlr's upload price: "}
              {isBundlrConnected ? formattedUploadPrice : 'Not connected to Bundlr'}
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
