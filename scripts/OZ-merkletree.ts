import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const data = [
  ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10"],
  ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "25"],
];
/* --------------------- CREATE TREE -------------------- */

// const tree = StandardMerkleTree.of(data, ["address", "uint256"]);
const tree = StandardMerkleTree.of(
  [
    ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10"],
    ["0x78731d3ca6b7e34ac0f824c42a7cc18a495cabab", "25"],
  ],
  ["address", "uint256"]
);

console.log("Tree:", tree.render());

// var proofs: string[] = [];
// for (const [i, v] of tree.entries()) {
//   proofs = proofs.concat(tree.getProof(i));
// }

// const leaf = tree.leafHash(["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10"]);

fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
