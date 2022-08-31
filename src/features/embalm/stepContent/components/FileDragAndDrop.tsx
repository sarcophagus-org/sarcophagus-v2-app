import { Center } from '@chakra-ui/react';
import { createRef, ReactNode, useCallback, useEffect, useState } from 'react';

interface FileUploaderProps {
  children: ReactNode;
  handleFileDrop: (e: DragEvent) => void;
}

export function FileDragAndDrop(props: FileUploaderProps) {
  const { children, handleFileDrop } = props;

  const dropAreaRef = createRef<HTMLDivElement>();
  const [isHovering, setIsHovering] = useState(false);

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsHovering(false);
      handleFileDrop(e);
    },
    [handleFileDrop]
  );

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragenter', handleDragEnter);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragenter', handleDragEnter);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, [dropAreaRef, handleDrop]);

  return (
    <Center
      border="1px dashed"
      borderColor="brand.500"
      bg={isHovering ? 'brand.100' : 'none'}
      h={175}
      ref={dropAreaRef}
    >
      {children}
    </Center>
  );
}
