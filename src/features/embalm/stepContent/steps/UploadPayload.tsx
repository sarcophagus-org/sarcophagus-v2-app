import { Checkbox, HStack, Input, Link, Text, Tooltip, VStack } from '@chakra-ui/react';
import { SarcoAlert } from 'components/SarcoAlert';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { maxSarcophagusNameLength } from 'lib/constants';
import prettyBytes from 'pretty-bytes';
import { FileDragAndDrop } from '../components/FileDragAndDrop';
import { useUploadPayload } from '../hooks/useUploadPayload';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { useDispatch, useSelector } from 'store/index';
import { toggleSponsorBundlr } from 'store/embalm/actions';
import { useState, useEffect } from 'react';

const MAX_SPONSORED_FILE_SIZE = 5000000; // 5 MB
export function UploadPayload() {
  const { error, file, handleSetFile, fileInputRef } = useUploadPayload();
  const { formattedUploadPrice } = useUploadPrice();
  const [canBeSponsored, setCanBeSponsored] = useState(false);

  const dispatch = useDispatch();

  const { isBundlrConnected } = useSupportedNetwork();

  const sponsorBundlr = useSelector(select => select.embalmState.sponsorBundlr);

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

  useEffect(() => {
    if (file && file.size <= MAX_SPONSORED_FILE_SIZE) {
      setCanBeSponsored(true);
    } else {
      setCanBeSponsored(false);
      // If sponsored upload is true, set to false.
      if (sponsorBundlr) {
        dispatch(toggleSponsorBundlr());
      }
    }
  }, [file, dispatch, sponsorBundlr]);

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
            {canBeSponsored ? (
              <HStack
                cursor={'pointer'}
                onClick={e => {
                  e.stopPropagation();
                  dispatch(toggleSponsorBundlr());
                }}
              >
                <Checkbox
                  mr={1}
                  isChecked={sponsorBundlr}
                  onChange={() => dispatch(toggleSponsorBundlr())}
                />
                <Text>Use sponsored upload</Text>
              </HStack>
            ) : (
              <Text
                fontSize="xs"
                as="i"
                variant="secondary"
              >
                Max size for sponsored Bundlr file is 5MB
              </Text>
            )}
            {!sponsorBundlr ? (
              <Text>
                {"Bundlr's upload price: "}
                {isBundlrConnected ? formattedUploadPrice : 'Not connected to Bundlr'}
              </Text>
            ) : (
              <Text>The Sarcophagus DAO will sponsor your payload upload</Text>
            )}
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
