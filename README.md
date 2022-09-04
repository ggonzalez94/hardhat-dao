# How to DAO
> This repo es based on [Patrick Collins amazing course](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-17-hardhat-daos) and is all about DAOs.

## What does it do?
> 🤝It allows you to create your own DAO and leverages on chain voting and [OpenZeppelin governance contracts](https://docs.openzeppelin.com/contracts/4.x/governance) to create, deploy and even run a proposal(which would usually be done with [Tally](https://www.withtally.com/) or other frontend for DAOs).

## 🛠 Quick Start - Deploy to local network
    This steps allow you to deploy to a local hardhat node.  

> Clone the repo  
``` bash 
git clone 
```

> Install packages
``` bash 
yarn install
```

> Run a hardhat node and deploy the smart contracts
```bash
yarn hardhat node
```

> Create a proposal to store a new value in the Box contract
```bash
yarn hardhat run scripts/propose.ts --network localhost
```

> Vote in the proposal
```bash
yarn hardhat run scripts/vote.ts --network localhost
```

> Now its time to execute it!  But first we need to queue the proposal and let the TimeLock do its job(don't worry its all on the same file 😉)
```bash
yarn hardhat run scripts/queue-and-execute.ts --network localhost
```
---

## Breakdown
Here's a small breakdown of what the steps above accomplish:

1. We deploy owr own ERC20 token for governance(GovernanceToken.sol).
2. We deploy a Timelock contract which is a best practice for governance(it gives time between when a proposal get queued and executed - so that people that don't like the result of the proposal can decide what to do).
3. We deploy our Governence contract  
    1. Note: **The Governance contract is in charge of proposals and such, but the Timelock executes!**
4. We deploy the Box contract, which is a very simple smart contract that will have its value changed only by governance.
5. We table a proposal to change the value to the Box contract and now all token holders can vote(probably not a very exciting proposal, but you get the idea).
6. We single handed vote in favor of the proposal(talk about democracy...).
7. And now its time to queue and execute the proposal 🤓