// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/*
 * 1 ) Allow the owner to create a Merkle proof using the JS library, declaring: [tokens, recipients, amounts]
 * 2 ) The owner submits it to the contract and its public
 * 3 ) An executor calls the transfer function with a proof. If it

 * Approvals
 * Batch transfers
 * Roles
 */

contract MerkleTransfers {
    error InvalidProof();

    bytes32 public merkleRoot;

    address public tokenAddress;
    uint256 public totalTransfers;

    mapping(uint256 => bool) public executedTransfers;

    event TransferExecuted(uint256 index);

    constructor(bytes32 _merkleRoot, address _tokenAddress, uint256 _totalTransfers) {
        merkleRoot = _merkleRoot;
        tokenAddress = _tokenAddress;
        totalTransfers = _totalTransfers;
    }

    // allow an owner to submit a Merkle proof of token amounts assigned to different addresses.
    function sumbitMerkleProof(bytes32 _proof) external {}

    function executeTransfers(
        uint256 index,
        address recipient,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external {
        // require(!executedTransfers[index], "Transfer already executed");

        // Verify the Merkle proof.
        bytes32 node = keccak256(abi.encodePacked(index, recipient, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid proof");

        // Transfer the tokens.
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(recipient, amount), "Transfer failed");

        // Mark the transfer as executed.
        executedTransfers[index] = true;

        // Emit event
        emit TransferExecuted(index);
    }
}
