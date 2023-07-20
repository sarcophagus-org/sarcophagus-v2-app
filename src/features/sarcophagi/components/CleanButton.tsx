import { Button, Tooltip } from '@chakra-ui/react';
import { useCleanSarcophagus } from 'hooks/thirdPartyFacet/useCleanSarcophagus';
import { useGetEmbalmerCanClean } from 'hooks/viewStateFacet/useGetEmbalmerCanClean';
import { SarcophagusData } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export const cleanTooltip =
  'Claim bonds and digging fees from Archaeologists that did not participate in the unwrapping ceremony';

export function CleanButton({ sarco }: { sarco: SarcophagusData }) {
  const canEmbalmerClean = useGetEmbalmerCanClean(sarco);
  const { clean, isCleaning, isError, mayFail } = useCleanSarcophagus(sarco.id, canEmbalmerClean);

  return (
    <>
      {!isError ? (
        <Tooltip
          placement="top"
          label={cleanTooltip}
        >
          <Button
            onClick={() => clean?.()}
            isLoading={isCleaning}
            loadingText={isCleaning ? 'Cleaning...' : undefined}
            disabled={isCleaning || isError || mayFail}
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
