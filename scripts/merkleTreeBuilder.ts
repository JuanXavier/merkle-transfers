import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const values = [
  //Remix 2nd and 3rd address
  ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10"],
  ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "25"],
];

const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

var proofs: string[] = [];

for (const [i, v] of tree.entries()) {
  proofs = proofs.concat(tree.getProof(i));
}

console.log("Merkle Root:", tree.root);
console.log("Proofs:", proofs);

// npx hardhat run .\scripts\merkleTreeBuilder.ts
