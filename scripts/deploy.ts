import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  let [deployer, executor] = await ethers.getSigners();

  /* --------------------- CONTRACTS -------------------- */

  const Token = await ethers.getContractFactory("MyToken");
  const token = await (await Token.deploy()).deployed();
  const MerkleTransfers = await ethers.getContractFactory("MerkleTransfers");
  const merkleTransfers = await (await MerkleTransfers.deploy(executor.address, token.address)).deployed();
  console.log(`Merkle deployed to ${merkleTransfers.address}`);

  /* --------------------- PREPARATION -------------------- */

  await token.connect(deployer).transfer(merkleTransfers.address, 10000000);
  console.log("");
  console.log("Merkle contract balance before transfers:", String(await token.balanceOf(merkleTransfers.address)));

  /* ----------------------- ADMIN ---------------------- */

  const adminData = fs.readFileSync("data/admin.json").toString();
  const { root } = JSON.parse(adminData);
  await merkleTransfers.changeMerkleRoot(root);

  /* --------------------- EXECUTOR --------------------- */

  const executorData = fs.readFileSync("data/executor.json").toString();
  const { addresses, amounts, proofs } = JSON.parse(executorData);
  await merkleTransfers.connect(executor).multiProofTransfer(addresses, amounts, proofs);
  console.log("");
  console.log("Merkle contract balance after transfers:", String(await token.balanceOf(merkleTransfers.address)));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
