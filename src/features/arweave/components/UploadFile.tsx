import { VStack, Button } from '@chakra-ui/react';
import { useSelector } from 'store/index';
import { UploadPayload } from '../../embalm/stepContent/steps/UploadPayload';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';

export function UploadFile() {
  const file = useSelector(x => x.embalmState.file);
  const { uploadFile } = useBundlr();

  async function handleUploadClick() {
    if (file === null || file === undefined) {
      console.log('file empty');
      return;
    } else {
      const b = Buffer.from(await file.arrayBuffer());
      uploadFile(b);
    }
  }

  return (
    <VStack
      align="left"
      spacing={10}
    >
      <UploadPayload />; <Button onClick={handleUploadClick}>Upload</Button>
    </VStack>
  );
}
