import { Button, Tooltip } from '@chakra-ui/react';
import { useCleanSarcophagus } from 'hooks/thirdPartyFacet/useCleanSarcophagus';
import { Sarcophagus } from 'types';

export function CleanButton({ sarco }: { sarco: Sarcophagus }) {
  const { clean, isCleaning, isError } = useCleanSarcophagus(sarco.id);

  return (
    <>
      {!isError ? (
        <Tooltip
          placement="top"
          label="Deactivate the Sarcophagus and claim back culprit archaeologist locked bonds and digging fees"
        >
          <Button
            onClick={() => clean?.()}
            isLoading={isCleaning}
            loadingText={isCleaning ? 'Cleaning...' : undefined}
            disabled={isCleaning || isError}
          >
            Clean
          </Button>
        </Tooltip>
      ) : (
        <></>
      )}
    </>
  );
}
