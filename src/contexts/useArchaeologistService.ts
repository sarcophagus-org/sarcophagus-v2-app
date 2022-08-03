import { useState } from 'react';
import Arweave from 'arweave';

const initArweave = () => {
  return Arweave.init({
    host: 'localhost', // 'arweave.net', // Hostname or IP address for a Arweave host
    port: 1984, //443, // Port
    protocol: 'http', // 'https', // Network protocol http or https
    timeout: 20000, // Network request timeouts in milliseconds
    logging: false, // Enable network request logging
  });
};

const useArchaeologistService = () => {
  const [sendStatus, setStatus] = useState<{ status: string; confirmations: number }>({
    status: '',
    confirmations: 0,
  });
  //TODO: remove when archologist do the upload.
  const uploadArweaveFile = async (sarcoId: string, file: Buffer): Promise<string> => {
    const arweave = initArweave();

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

    const address = await arweave.wallets.getAddress(key);
    const tx = await arweave.createTransaction({ data: file }, key);
    tx.addTag('Content-Type', 'plain/text');
    await arweave.transactions.sign(tx, key);

    let uploader = await arweave.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      );
    }
    return tx.id;
  };

  const updateStatus = async () => {
    const arweave = initArweave();
    const currentTextArweaveAddress = 'Xm17-cZJjcx-jc_UL5me1o5nfqC2T1mF-yu03gmKeK4';
    const txId = await arweave.wallets.getLastTransactionID(currentTextArweaveAddress);

    const res = await arweave.transactions.getStatus(txId);
    if (res && res.status === 200) {
      if ((res.confirmed as unknown as string) === 'Pending') {
        setStatus({ status: 'Pending', confirmations: 0 });
      } else {
        setStatus({
          status: 'Success',
          confirmations: res.confirmed?.number_of_confirmations || 0,
        });
      }
    }
  };

  const getConfirmations = async (txId: string | undefined): Promise<number> => {
    if (!txId) return 0;
    const arweave = initArweave();
    const res = await arweave.transactions.getStatus(txId);
    if (res && res.status === 200) {
      if ((res.confirmed as unknown as string) === 'Pending') {
        return 0;
      } else {
        return res.confirmed?.number_of_confirmations || 0;
      }
    }
    return 0;
  };

  return { uploadArweaveFile, updateStatus, sendStatus, getConfirmations };
};
export default useArchaeologistService;
