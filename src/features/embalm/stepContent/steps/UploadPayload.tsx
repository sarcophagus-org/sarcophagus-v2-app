import { Button, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { createRef } from 'react';
import { setPayloadPath } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function UploadPayload() {
  const dispatch = useDispatch();
  const { payloadPath } = useSelector(x => x.embalmState);
  const fileInput = createRef<HTMLInputElement>();

  function handleClickButton() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const path = e.target.value;
    const size = e.target.files?.[0].size;
    dispatch(setPayloadPath(path, size));
  }

  return (
    <VStack
      spacing={9}
      align="left"
    >
      <Heading>Upload payload</Heading>
      <VStack
        align="left"
        spacing={6}
      >
        <Flex>
          <Text>File:</Text>
          <Text ml={3}>{payloadPath}</Text>
        </Flex>
        <Button onClick={handleClickButton}>Choose File</Button>
        <Input
          hidden
          onChange={handleFileChange}
          ref={fileInput}
          type="file"
        />
      </VStack>
    </VStack>
  );
}
