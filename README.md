# Sarcophagus Interface

[![Discord](https://img.shields.io/discord/753398645507883099?color=768AD4&label=discord)](https://discord.com/channels/753398645507883099/)
[![Twitter](https://img.shields.io/twitter/follow/sarcophagusio?style=social)](https://twitter.com/sarcophagusio)

Sarcophagus is a decentralized dead man's switch built on Ethereum and Arweave.

# Local Development Guide

## Clone the repo and install dependencies

```
git clone git@github.com:sarcophagus-org/sarcophagus-v2-app.git
cd sarcophagus-v2-app
nvm use
npm i --legacy-peer-deps

cp .env.example .env
```

- after creating a .env file, you’ll need to set `REACT_APP_INFURA_API_KEY` to an Infura API key that you own

## Running on Goerli with MetaMask

You’ll need an address on Goerli funded with ETH and SARCO to run through the full create sarcophagus flow.

1. Install metamask
2. On the network dropdown at the top of the MetaMask popup, select show/hide test networks and toggle on test networks
3. Change your network to Goerli
4. Import the private key for an account funded with Goerli Ether and SARCO
5. On step 3 within the embalm flow, you’ll be prompted to fund your Bundlr account with Ether. This process can take up
   to 20 minutes to complete on Goerli.

## Running on hardhat local network and ArLocal with MetaMask

You may deploy the contracts on a local hardhat node and simulate an Arweave connection with ArLocal for local
development. Note that you will not be able to connect to Bundlr when connecting the app to a local hardhat network.
Step 3 (Fund Bundlr) will not be required.

1. Run ArLocal and mint tokens

```
npx arlocal
curl http://localhost:1984/mint/Xm17-cZJjcx-jc_UL5me1o5nfqC2T1mF-yu03gmKeK4/1000000000000000000000
curl http://localhost:1984/mine
```

2. Install MetaMask
3. On the network dropdown at the top of the MetaMask popup, select show/hide test networks and toggle on test networks
4. Change your network to localhost:8545
5. Inside of settings > networks > localhost:8545, change the localhost:8545 network’s chain id to 31337
6. Start a local hardhat node (see the v2 contracts repo for more detailed instructions)
7. Import the private key for an account funded with SARCO and Ether on the local hardhat network.
    - The first account generated when the node is run from the v2 contracts project will be funded. Its private key
      is `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
8. Ensure that at least one archaeologist has been registered on your local hardhat node and is running on the local
   hardhat network
    - If your node is restarted, you will need to reregister your archaeologist

## Community

[![Discord](https://img.shields.io/discord/753398645507883099?color=768AD4&label=discord)](https://discord.com/channels/753398645507883099/)
[![Twitter](https://img.shields.io/twitter/follow/sarcophagusio?style=social)](https://twitter.com/sarcophagusio)

We can also be found on [Telegram](https://t.me/sarcophagusio).

Made with :skull: and proudly decentralized.
