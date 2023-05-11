import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import fs from "fs";

const Data: { [key: string]: string } = {
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

function hashData(recipient: string, amount: string): Buffer {
  return Buffer.from(ethers.utils.solidityKeccak256(["address", "uint256"], [recipient, amount]).slice(2), "hex");
}

const buf2hex = (x: Buffer): string => "0x" + x.toString("hex");

/* ------------------------ TREE ------------------------ */

const tree = new MerkleTree(
  Object.entries(Data).map((data) => hashData(...data)),
  keccak256,
  { sortPairs: true }
);

/* ****************************************************** */
/*                         TESTING                        */
/* ****************************************************** */

const leaf1 = hashData("0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10");
const leaf7 = hashData("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", "70");
const proof1 = tree.getProof(leaf1).map((x) => buf2hex(x.data));
const proof7 = tree.getProof(leaf7).map((x) => buf2hex(x.data));
console.log("PROOF", proof1);
console.log("PROOF7", proof7);

const proofs = tree.getProofs();
const hexProofs = proofs.map((proof) => proof.map(({ data }: { data: Buffer }) => ({ data: data.toString("hex") })));
const flattenedHexProofs = hexProofs.flat().map((proof) => proof.data);
const flattenedHexProofs2 = hexProofs.flat().map((proof) => "0x" + proof.data);

// console.log(flattenedHexProofs);
// console.log(flattenedHexProofs2);
console.log("ROOT", tree.getHexRoot()); //0x4a18eb16adf32526a60d4005da07de5ded3871a80fc45aa24ce3e073f1c79959
console.log("");
// console.log("TREE: ", tree.toString());
console.log("");
const leaves = tree.getLeaves().map(buf2hex);
// console.log("ALL LEAVES", leaves);

// fs.writeFileSync("tree.json", JSON.stringify(tree));
// PROOF1 [["0xacd17ebf695e728fb4a56d2cc35a3138fde7af36e2086773b49473ac1a4a1a71","0xa45c5e3c4ad84d306a7ec9b21036288802f331e83ff3679c6324094df51ecf1f","0x7d4178bd4b94ee8d7fcefb69b295308ec445b849727f2f693c55718ab97baa0b"],["0x41bab02df5edcdfd19ab69ffd022bfe87f02535b30eded5b8be8a5bdc2021f69","0x1402717123951e7cb738b0f5a219be3dda979c628405cfb064b2db5c5b554d14","0x5996231f2802ed0415aca5ddf5e9b5c11042f2434d03b878b260cd4312335c40"]]

/* ------------------- THIS SHOULD BE ------------------- */
const proofLeaves = Object.entries(Data)
  .map(([recipient, amount]) => hashData(recipient, amount))
  .sort(Buffer.compare);

// const proof = tree.getMultiProof(proofLeaves);
// console.log("PROOF", proof);
