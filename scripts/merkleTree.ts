import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import fs from "fs";
import { TransferData } from "./transferData";

/* ---------------------- HELPERS ---------------------- */

function hashData(recipient: string, amount: string): Buffer {
  return Buffer.from(ethers.utils.solidityKeccak256(["address", "uint256"], [recipient, amount]).slice(2), "hex");
}

function bufferToHex(x: Buffer): string {
  return "0x" + x.toString("hex");
}

/* ------------------------ TREE ------------------------ */

const tree = new MerkleTree(
  Object.entries(TransferData).map((data) => hashData(...data)),
  keccak256,
  { sortPairs: true }
);

/* -------------------- OUTPUT DATA -------------------- */

const proofs = Object.entries(TransferData).map(([address, amount]) => {
  const leaf = hashData(address, amount);
  return tree.getProof(leaf).map((x) => bufferToHex(x.data));
});

const amounts = Object.values(TransferData).map(Number);
const addresses = Object.keys(TransferData).map((address) => address);

const admin = {
  root: tree.getHexRoot(),
};

const executor = {
  proofs: proofs,
  addresses: addresses,
  amounts: amounts,
};
fs.writeFileSync("data/admin.json", JSON.stringify(admin));
fs.writeFileSync("data/executor.json", JSON.stringify(executor));
fs.writeFileSync("data/tree.json", JSON.stringify(tree));

/* ----------------------- LOGGING ---------------------- */

console.log("ROOT:\n", tree.getHexRoot(), `\n`);
console.log(`PROOFS:\n`, JSON.stringify(proofs).replace(/\s+/g, ""));
console.log(`ADDRESSES:\n [${addresses.join(",")}]`);
console.log(`AMOUNTS:\n`, amounts);
