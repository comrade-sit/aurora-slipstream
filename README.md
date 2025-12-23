# Aurora Slipstream (Built for Base)

Aurora Slipstream is a lightweight, browser-based Base utility focused on inspecting live onchain state through strictly read-only operations. It is designed to help developers quickly verify Base connectivity, network identity, and public blockchain data using official Coinbase and Base tooling.

---

## Base network context

Aurora Slipstream explicitly targets Base networks and validates expected chain identifiers before performing any reads.

Base Mainnet  
chainId (decimal): 8453  
Explorer: https://basescan.org  

Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

All RPC interactions rely on official Base endpoints.

---

## Repository layout

- app/aurora-slipstream.ts  
  Browser entry point responsible for wallet connection, chain validation, and RPC reads.

- config/networks.json  
  Static configuration describing supported Base networks, RPC URLs, and explorers.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - contract.sol — minimal contract used to confirm deployment and verification flow  
  - arrays.sol — simple stateful contract for interaction testing    

- package.json  
  Dependency manifest referencing Coinbase SDKs and multiple Base and Coinbase repositories.

- README.md  
  Technical documentation and deployment references.

---

## Capabilities overview

Aurora Slipstream provides a compact diagnostic surface for Base:

- Coinbase Wallet connection via EIP-1193  
- ChainId validation for Base Mainnet and Base Sepolia  
- ETH balance inspection for arbitrary addresses  
- Latest block snapshot with timestamp and gas metrics  
- ERC-20 metadata and balance reads using standard view methods  
- Direct Basescan links for external verification  

No transactions are signed or broadcast at any stage.

---

## Tooling and dependencies

This repository integrates tooling from both the Base and Coinbase open-source ecosystems:

- Coinbase Wallet SDK for wallet access  
- OnchainKit references for Base-aligned primitives and account abstraction context  
- viem for typed, efficient, read-only RPC communication  
- Multiple Base and Coinbase GitHub repositories included as direct dependencies  

---

## Usage summary

After installing dependencies and serving the project in a browser:

- Connect a Coinbase Wallet  
- Confirm the active Base network  
- Inspect ETH balances and recent blocks  
- Read ERC-20 token metadata and balances  
- Follow Basescan links for independent verification  

The application remains fully read-only throughout.

---

## License

MIT License

Copyright (c) 2025 comrade-sit

---

## Author

GitHub: https://github.com/comrade-sit  
Email: comrade-sit.0b@icloud.com 
Discord: thunderseeker4128  

---

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network to confirm correct behavior and tooling compatibility.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract #1 address:  
0x73d6ba23d01b04160af0672800a7929dc378da34

Deployment and verification:
- https://sepolia.basescan.org/address/0x73d6ba23d01b04160af0672800a7929dc378da34
- https://sepolia.basescan.org/0x73d6ba23d01b04160af0672800a7929dc378da34/0#code  

Contract #2 address:  
0x58376311be0d126b6c0e9be92b82cd653e16bf3b

Deployment and verification:
- https://sepolia.basescan.org/address/0x58376311be0d126b6c0e9be92b82cd653e16bf3b
- https://sepolia.basescan.org/0x58376311be0d126b6c0e9be92b82cd653e16bf3b  


These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage.
