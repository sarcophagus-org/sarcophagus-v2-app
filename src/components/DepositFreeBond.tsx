import { Box, Button, FormControl, FormLabel, FormHelperText, Input } from '@chakra-ui/react';

import useDepositFreeBond from '../contexts/useDepositFreeBond';

function DepositFreeBond() {
  const {
    depositAmount,
    setDepositAmount,
    depositFreeBond,
    approveSarcoToken,
    hasSarcoTokenApproval,
  } = useDepositFreeBond();

  return (
    <Box>
      <FormControl>
        <FormLabel>Free Bond Amount</FormLabel>
        <Input
          id="amount"
          value={depositAmount}
          onChange={e => {
            setDepositAmount(e.target.value);
          }}
        />
        <FormHelperText>Enter amount for free bond deposit</FormHelperText>
        {hasSarcoTokenApproval() ? (
          <Button onClick={() => depositFreeBond()}>Deposit</Button>
        ) : (
          <Button onClick={() => approveSarcoToken()}>Approve</Button>
        )}
      </FormControl>
    </Box>
  );
}

export default DepositFreeBond;
