1. Admin fills the `transferData.ts` file with all the addresses and amounts to transfer.

2. Generate the MerkleTree via script with the following command:

```
npx hardhat run .\scripts\merkleTree.ts
```

This will create two files inside the `data` folder, an `admin.json` and `executor.json`, each one for the data that each individual requires for the following steps.

3. Run the following command to "deploy" locally and make sure everything works.

```
npx hardhat run .\scripts\deploy.ts
```
