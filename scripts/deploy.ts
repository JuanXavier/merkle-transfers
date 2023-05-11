import { ethers } from "hardhat";

async function main() {
  const WETH9 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  let executor;
  [, executor] = await ethers.getSigners();

  const MerkleTransfers = await ethers.getContractFactory("MerkleTransfers");
  const merkleTransfers = await (await MerkleTransfers.deploy(executor.address, WETH9)).deployed();

  console.log(`Merkle deployed to ${merkleTransfers.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
