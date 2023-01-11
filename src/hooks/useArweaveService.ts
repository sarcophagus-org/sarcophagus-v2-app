import { hardhat } from '@wagmi/chains';
import { CreateSarcophagusContext } from 'features/embalm/stepContent/context/CreateSarcophagusContext';
import { CancelCreateToken } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useCreateSarcophagus';
import { useArweave } from 'hooks/useArweave';
import { useCallback, useContext, useState } from 'react';
import { useBundlr } from '../features/embalm/stepContent/hooks/useBundlr';
import { useNetworkConfig } from '../lib/config';

export enum ArweaveTxStatus {
  PENDING,
  SUCCESS,
  FAIL,
}

export interface ArweaveFileMetadata {
  fileName: string;
  type: string;
}

const useArweaveService = () => {
  const [transactionStatus, setTransactionStatus] = useState<{
    status: ArweaveTxStatus | null;
    confirmations: number;
  }>({
    status: null,
    confirmations: 0,
  });

  const { uploadFile } = useBundlr();
  const networkConfig = useNetworkConfig();

  const { arweave } = useArweave();
  const arweaveNotReadyMsg = 'Arweave instance not ready!';
  const { setSarcophagusPayloadTxId } = useContext(CreateSarcophagusContext);

  const uploadArLocalFile = useCallback(
    async (file: string | Buffer, metadata: ArweaveFileMetadata): Promise<string> => {
      if (!arweave) return '';

      const key = {
        kty: 'RSA',
        e: 'AQAB',
        n: '5WCiWm4TGRRm1fpIy-dmRtcOqjrk9K2nE0mykYiMk6p3OaSQCkQ2udO2LSfi1OYpDPh3xyDS1yFgWkrYZpGsd4CjS0MTsxSjIzlIorqodjUTztStc1oBVVT791WKFOLv7YYvvuPCplxA7EFpDmZPCXo42G-dG6V9ZF7YZmROCD47-vejmMbnR3Z8aaYBrreitRSDF6i9FEDmN03yd0ddSrWfKmmEDdkQMNaajl4OIkVSfU1h-x030GguV8fEuus9AuMnoE27RqXDDeTzuocX_9n81Cg6FmhL8sc-JZXTuGGjwpLkoMXRGz0thZJGNzwGnWX_Hl0LMQFfwX9mZxcD2RnW8ldnqSfFS_8TAN-fAXEgOomnTnqHXYbXPHCEK73ip4sqD2X7KAjEfnW0CwnUW5wf1LBwCl-Lh9zPYJhT5Y7458wqG1h4NGOcWfBYUVSEn7CMadtLRlHVIkIFx2yrRCsbiokPCxcDw4g5ew_ISAqdc2jQ_1z8ObPA0qp1zY0OS9S6awcHxThnMrL-OBl1ttopPcm2Iamok2jHCOch7D6qoLxbupLX-GiKSLFaBV2YjUouh5I8uClpB2VXJqDsGvsylWWy832uDdrxhFzsz67aEOKtYfFlCRRohLPvBw7zA26c2m00clvurgh947jtzXHCj8riP1v86zg8PqJAS40',
        d: 'TUVD_B23vkuipvPVISeXS0b4UD1d0tVLAtLhXmh3Humel2MKCQNYwjoBVW3p2pmce5uaUhELJeC_AjvTcZ4iUPGbUOfMU5ggquWJxBQIWyXfQd5gfgr0hwgFh5kf1pBqjgQVwoMcmAlc75nLZ8fsWT98teDHtsAFoVHYKYohxWIdt5pD2NwsnmTaXYbIa1C-dazuyoIUDCYex8Ow6iC220uazmFUVIvqieFJmKszrLTYqJBwcPUzT7hA4F5SNju3xmi6eSSmcZK2xk_6ETygR5bqNphElTbWWvdmxqeV9rehwJLWhRiOrFPsKWKQ19uXSN_K1TI36m7RkLA30YOtzgpDnaVfrrDPrEe4lZ9SiXZbox_4uyH1iFSzkT-CMAfWFw-hZvyukgD1W4nHRePqtyV7Nl2QsuV_kUktcw-rt3ZevgEJYjYraRS_SOejU8i5gAhiCCxvbvIsKVRohoPG-fwFj36D60oSEaRk0O_xlzKzSopgoBnDEi_KBKTbnN0xvZDwy6BuEFEo5txbfPz8-zgGxR9rRq0_xU4jSitxB7pt6CegNBQ03jswUNuIN0yfuejKsIl1h7kXiUAKfxoCu5H00nUXiCxY0cxdBTpcVxjkutNmJ0GlnraH07KZPm0wqiIryIi41gNci8GZ934drozv7qZ4ZcySVikodILJdSs',
        p: '8xWEC27ReEeXfsy_avEZEtZPisuogXU9EElM6rXvYnCt91gwH-duVv4RNWLA_oiWuhr0cFLy8CUmnt-RzVQvswJglB8FAadm1-lS4oohX0qcnu50xK6zhrPU02q9pIepVsU2uhBjsLox_HORhvQcY_GEZndWip7cTZ0OUNiePIfK5DidaHG6c4bA_KHxgBNwiH5wt1p9E1F1wXNd7qKFhIUZXhbMb5i0nIH45-pMCGY9xMChx2cKvLEpOTdwG-oDh6a6OpQ65iQJTjzcZQtSjGaARdZ2vP6e18Mtk3kN_mKEWwoR1f0pDNcAdrY6ZtWOPkK63JAOxFOY3M3MCjUqyw',
        q: '8ZCttPunWAiPcWqWFLgCh22wuJRJzz_qBPo_-6tB58dOuIIpyRmUNisjwGFvHN-g6Uv_tLMzpQ7_oMetwYWpBaENpfbcnzAIssoT4qB3lTNqvWjd3OZFJJOfZObfr8J12Hb2eDcEI_9ZVk_84Otq-gI6_5mkziFex8zyQ5FlOW6FaE7Gvxv8HBcBs9QeAmMuulQVD25ovhWkILyQKMAFaAx8vxH9HsElnPuthV6xLV2aI11nrYJDUwUCRK-lfdCos0y5r_hOzrXvIW6PZ5FqnSPJAwIC_sWw8FXWvfsVVdi6FoOId6kHpCmNFrVVZyloBBjZ2Tvq4Ws-DywUKEBgBw',
        dp: '2TWTnSez81d9jqdkMCop7oQj5XEgLDXXj7MAEQbrVjo7qTZbIlcJaKB0PhD1RTxF-xxU6f2k6WM5BGPgA-rDCKEKLbEeJyEvq6TpFFa7hUvFcdq_6nP1JVuRxCywMtGqRkfJJC-69NMcEWovUrjUmZXZajoe0ZUsZAoAHcvCcXIhoRbZyNc-9TYnQldu1bQJLV5WV_B6rQVwRKFTAQamagkI5uNWYC3Czcrx4EGjGSpK7YH3zZdMp9libacU_Ux5RQB9jhSgIL94tTl68qtQYvbAjicaSLz4sPHNyuYz0-iyPitcTqt9v-RqnKkuvG79QLMeCDKNj27nu_4E4eYqSw',
        dq: 'wOg4z_7ndHXhl0D2-TS5UE1Ygw5oowj3aWIvFlt9Fgsj4lSP6fhzU46_zjIA-Z3ccnIuka9J3tZLbaoIKDME92nV7GNna_h_-cdGegSLeqrE4t2Lz4xUSxFYiMuWdlVkpqjZysakl9qjDTpzR2q4005UrymTYsljV0tjbHH_1A1enB3MuXEvs37r7R_Hl0B9YG8lIl2ZZ7MAjuQGe4RczOqr9Cn5aUX1M5gIyikEdKX7IaLF2Nndyb6GQTPDhOXM0uLCprQ0uv6vKJOSEbMe4L5jF_PTUIGu-z6RbsXEE_ovISuJH4XshDxqX2gP-4IlfqAZ2FDxEXMC7DrXHg3KoQ',
        qi: 'kS2AXYKfVKOdtNGiksIgs2YT4Pz-62rCeynyFlnUDc6E3eylzctLHhuWMRqWqnPwVPwnw2Fd6eUTOYZe82kVf9d0-XbeDtOOP6fS7HU30ICIvFrLTiaVEsLekUdQwoyC7s0xH99FZpdGJHzC7iNdlChybmrh4Ci5OyOLn_o8goNQBYWEXOgr6JgJLTh9BXvDEbNLLJ0JTZFQeLVqQeimPDSoAwBFCLBBwOd6CFOr5wTc9Pkt8cDrpcf9usU-61uu3Lr4-3PG4yUUQyphnDy84DgpUyuF5JNy0KgtuZaMMuAZJTb_gKN3IdLUHV9phqwrSKylLn-enGJ0f4FTpfcDEQ',
      };
      // address: Xm17-cZJjcx-jc_UL5me1o5nfqC2T1mF-yu03gmKeK4

      const tx = await arweave.createTransaction({ data: file }, key);
      tx.addTag('Content-Type', 'plain/text');
      tx.addTag('metadata', JSON.stringify(metadata));
      await arweave.transactions.sign(tx, key);

      let uploader = await arweave.transactions.getUploader(tx);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        );
      }

      setSarcophagusPayloadTxId(tx.id);
      return tx.id;
    },
    [arweave, setSarcophagusPayloadTxId]
  );

  const updateStatus = useCallback(
    async (arweaveTxId: string) => {
      if (!arweave) return;

      const res = await arweave.transactions.getStatus(arweaveTxId);
      if (res && res.confirmed && res.status === 200) {
        if ((res.confirmed as unknown as string) === 'Pending') {
          setTransactionStatus({ status: ArweaveTxStatus.PENDING, confirmations: 0 });
        } else {
          setTransactionStatus({
            status: ArweaveTxStatus.SUCCESS,
            confirmations: res.confirmed.number_of_confirmations || 0,
          });
        }
      } else {
        setTransactionStatus({ status: ArweaveTxStatus.FAIL, confirmations: 0 });
      }
    },
    [arweave]
  );

  const getTransactionStatusMessage = (): string => {
    switch (transactionStatus.status) {
      case null:
        return 'Status not set';
      case ArweaveTxStatus.SUCCESS:
        return 'Arweave TX upload successful';
      case ArweaveTxStatus.PENDING:
        return 'Waiting for Arweave TX to confirm';
      case ArweaveTxStatus.FAIL:
        return 'Transaction failed';
    }
  };

  const getConfirmations = (): number => transactionStatus.confirmations;

  const uploadToArweave = useCallback(
    (data: Buffer, metadata: ArweaveFileMetadata, cancelToken: CancelCreateToken): Promise<string> => {
      if (!arweave) throw new Error(arweaveNotReadyMsg);
      return networkConfig.chainId === hardhat.id
        ? uploadArLocalFile(data, metadata)
        : uploadFile(data, metadata, cancelToken);
    },
    [arweave, networkConfig.chainId, uploadArLocalFile, uploadFile]
  );

  return {
    updateStatus,
    getTransactionStatusMessage,
    getConfirmations,
    uploadToArweave,
  };
};

export default useArweaveService;
