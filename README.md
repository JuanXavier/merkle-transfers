Call this in terminal

```
npx hardhat run .\scripts\normal-merkletree.ts
```

And it will generate two files inside the data folder, an `admin.json` and `executor.json`, each one for the data that each individual requires

For deploying and testing that everything works, run:

```
npx hardhat run .\scripts\deploy.ts
```
