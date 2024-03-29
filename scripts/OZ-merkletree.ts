import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const data = [
  ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10"],
  ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "20"],
  ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "30"],
  ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "40"],
  ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "50"],
  ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", "60"],
  ["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", "70"],
  ["0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", "80"],
];
/* --------------------- CREATE TREE -------------------- */

const tree = StandardMerkleTree.of(data, ["address", "uint256"]);

console.log("Tree:", tree.render());

// var proofs: string[] = [];
// for (const [i, v] of tree.entries()) {
//   proofs = proofs.concat(tree.getProof(i));
// }

// const leaf = tree.leafHash(["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "10"]);

fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
