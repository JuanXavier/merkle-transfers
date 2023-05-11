// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

/**
 *Bob (owner) has to pay bonuses to his employees. These are going to be paid in an ERC20 he decides.
 *The problem is that Bob doesn't want to send those transactions manually, instead is hiring executor to do that. 
 * Since Bob doesn't trust executor,Bob plans to commit a merkle proof to a smart contract consisting of all the 
 * 100 transactions he needs to send. Bob will also pre-fund the smart contract with enough tokens to pay
 * all those transactions. executor has to be able to execute those transactions using the merkle proof committed by Bob.
 *   question:
 *  What data does Bob gives to alice?/ What data does alice need ?
    // must generate a proof for every address and every amount?
 */
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleTransfers {
    error InvalidProof();
    error Unauthorized();

    address internal immutable owner;
    address internal immutable executor;
    IERC20 internal token;

    bytes32 public merkleRoot;
    mapping(uint256 => bool) public executedTransfers;

    constructor(address _executor, address _token) {
        owner = msg.sender;
        executor = _executor;
        token = IERC20(_token);
    }

    function submitMerkleRoot(bytes32 _merkleRoot) external {
        if (msg.sender != owner) revert Unauthorized();
        merkleRoot = _merkleRoot;
    }

    /**
["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
[10,25]
[["0xc541a6bdd55352497fe5adde464069ae25ede524a2ac975d3897b077b7931231"],["0xb86ca9aba3f0da76df0f4f1bfc7833b7b24d425b086935475871ff2b4fc57c08"]]
 */
    // I get the invalidProof error
    function executeTransfers(
        address[] memory recipients,
        uint256[] memory amounts,
        bytes32[][] memory proofs
    ) external {
        if (msg.sender != executor) revert Unauthorized();

        unchecked {
            for (uint256 i; i < recipients.length; ++i) {
                bytes32 leaf = keccak256(abi.encodePacked(recipients[i], amounts[i]));
                if (!MerkleProof.verify(proofs[i], merkleRoot, leaf)) revert InvalidProof();
                token.transfer(recipients[i], amounts[i]);
            }
        }
    }
}
