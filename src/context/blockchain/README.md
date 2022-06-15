# Sarcophagus Blockchain Provider

## Usage

The context provider is exported from `BlockchainProvider.tsx`. It should be a child of the `Web3Provider` and can wrap the rest of the app. This high level Context will mostly be used within the SarocphagusProvider context

```tsx
ReactDOM.render(
  <Web3Provider>
    <BlockchainProvider>
      <App />
    </BlockchainProvider>
  </Web3Provider>
);
```
## Hooks

### useAddresses

Sets the contract address of Sarcophagus contract based on the chainId and the environmental variable.

### useCurrentBlock

Sets the current blockchain block number and subscribes to 'block' event on provider.

### useTokenAllowance

Sets the allowance of supplied token and user on given contract.

### useTokenBalance

Sets the balance of supplied token contract and account