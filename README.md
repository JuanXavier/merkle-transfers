## Objective

To complete this work test, you should implement a smart contract in Solidity that satisfies the following requirements:

1. The contract should allow an owner to submit a Merkle proof of token amounts assigned to different addresses.

2. The contract should allow an executor to call the contract to transfer those amounts to each address, validating the proof.

3. The contract should support multiple transfers in a single execution.

Example of use case:

Bob (owner) has to pay bonuses to his employees. These are going to be paid in an ERC20 he decides. The problem is that Bob doesn't want to send those transactions manually, instead is hiring executor to do that. Since Bob doesn't trust executor,Bob plans to commit a merkle proof to a smart contract consisting of all the 100 transactions he needs to send. Bob will also pre-fund the smart contract with enough tokens to pay all those transactions. executor has to be able to execute those transactions using the merkle proof committed by Bob.

## Steps

1. Admin fills the `transferData.ts` file with all the addresses and amounts to transfer.

2. Generate the MerkleTree via script with the following command:

```
npx hardhat run .\scripts\merkleTree.ts
```

This will create three files inside the `data` folder, an `admin.json` and `executor.json`, each one for the data that each individual requires for the following steps, and a `tree.json` containing the whole merkle tree.

3. Run the following command to "deploy" locally and make sure everything works.

```
npx hardhat run .\scripts\deploy.ts
```

This will read from the newly created files `admin.json` and `executor.json`.
