import { Button, Tooltip } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useBurySarcophagus } from 'hooks/embalmerFacet';

export function BuryButton({ id }: { id?: string }) {
  const { bury, isBurying, error } = useBurySarcophagus(id || ethers.constants.HashZero);

  function handleBury() {
    bury?.();
  }

  return (
    <>
      {!error ? (
        <Tooltip
          placement="top"
          label="Deactivate this Sarcophagus so it can never be resurrected"
        >
          <Button
            onClick={handleBury}
            isLoading={isBurying}
            loadingText={isBurying ? 'Burying...' : undefined}
            disabled={isBurying || !!error}
          >
            Bury
          </Button>
        </Tooltip>
      ) : (
        <></>
      )}
    </>
  );
}
