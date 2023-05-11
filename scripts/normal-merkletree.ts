import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import fs from "fs";

const TransferData: { [key: string]: string } = {
  "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db": "10",
  "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB": "20",
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "30",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": "40",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": "50",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906": "60",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": "70",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720": "80",
};

/* ---------------------- HELPERS ---------------------- */

function addToData(recipient: string, amount: string): void {
  TransferData[recipient] = amount;
}

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

/****************************************** */

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

/* ----------------------- LOGGING ---------------------- */

// console.log("ROOT:\n", tree.getHexRoot(), `\n`);
// console.log(`PROOFS:\n`, JSON.stringify(proofs).replace(/\s+/g, ""));
// console.log(`ADDRESSES:\n [${addresses.join(",")}]`);
// console.log(`AMOUNTS:\n`, amounts);
