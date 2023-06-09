import React, { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { dialArchaeologistFailure, dialArchaeologistSuccess } from '../../lib/utils/toast';
import { ArchaeologistData, sarco } from 'sarcophagus-v2-sdk';

export function useAttemptDialArchaeologists(
  setIsDialing?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const toast = useToast();

  // Dials the archaeologist and hangs up after an interval
  // sets dial status for use in the UX
  const testDialArchaeologist = useCallback(
    async (
      arch: ArchaeologistData,
      showToast: boolean = false,
      hangUpInterval: number = 200
    ): Promise<boolean> => {
      try {
        if (!!setIsDialing) {
          setIsDialing(true);
        }

        await sarco.archaeologist.dialArchaeologist(arch);

        if (showToast) {
          toast(dialArchaeologistSuccess());
        }

        setTimeout(async () => {
          await sarco.archaeologist.hangUp(arch);
        }, hangUpInterval);

        return true;
      } catch (error) {
        console.log(error);

        if (showToast) {
          toast(dialArchaeologistFailure());
        }

        return false;
      } finally {
        if (!!setIsDialing) {
          setIsDialing(false);
        }
      }
    },
    [setIsDialing, toast]
  );
  return {
    testDialArchaeologist,
  };
}
