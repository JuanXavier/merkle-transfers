import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

// (1)
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json")));

// (2)
for (const [i, v] of tree.entries()) {
  if (v[0] === "0x2222222222222222222222222222222222222222") {
    // (3)
    const proof = tree.getProof(i);
    console.log("Value:", v);
    console.log("Proof:", proof);
    console.log("Merkle Root:", tree.root);
    // console.log("Merkle Dump:", tree.dump());
    // console.log("Merkle Render:", tree.render());
    console.log("Merkle Render:", tree.getProof(1));
  }
}
