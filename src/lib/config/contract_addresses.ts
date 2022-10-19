const envContractAddresses = process.env.REACT_APP_CONTRACT_ADDRESSES;
const envTokenAddresses = process.env.REACT_APP_TOKEN_ADDRESSES;

export const contractAddresses = !envContractAddresses ? {} : JSON.parse(envContractAddresses) as Record<string, string>;
export const tokenAddresses = !envTokenAddresses ? {} : JSON.parse(envTokenAddresses) as Record<string, string>;

export const supportedChainIds = Object.keys(contractAddresses).map(Number.parseInt);