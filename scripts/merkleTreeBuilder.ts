import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

/**
 * 
 * Merkle trees are usually used in a way where the admin sends a Merkle root, 
 * which includes all the "whitelisted" addresses, to the smart contract.
 *  When the user later wants to trigger a whitelisted mint, the project's 
 * webpage generates proof for the user's address, which is then sent as a parameter in the transaction.

Verify method in Openzeppelin's MerkleProof looks like this:

`verify(bytes32[] proof, bytes32 root, bytes32 leaf)`

where

Proof is generated on the page
Root is supplied from the smart contract itself
Leaf is msg.sender (sender's address)
So to answer your question it will trigger ERC20 smart contract's mint function.
 */

// (1)
const values = [
  ["0x1111111111111111111111111111111111111111", "0x1111111111111111111111111111111111111111", "5000000000000000000"],
  ["0x2222222222222222222222222222222222222222", "0x1111111111111111111111111111111111111111", "2500000000000000000"],
];

// [token address, recipient address, amount]
const tree = StandardMerkleTree.of(values, ["address", "address", "uint256"]);

// (3)
console.log("Merkle Root:", tree.root);

// (4)
fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
