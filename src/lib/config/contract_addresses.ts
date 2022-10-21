const chainIds = process.env.REACT_APP_SUPPORTED_CHAIN_IDS;

export const supportedChainIds = chainIds?.split(',').map(id => parseInt(id)) || [];