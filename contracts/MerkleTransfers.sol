// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 *Bob (owner) has to pay bonuses to his employees. These are going to be paid in an ERC20 he decides.
 *The problem is that Bob doesn't want to send those transactions manually, instead is hiring executor to do that.
 * Since Bob doesn't trust executor,Bob plans to commit a merkle proof to a smart contract consisting of all the
 * 100 transactions he needs to send. Bob will also pre-fund the smart contract with enough tokens to pay
 * all those transactions. executor has to be able to execute those transactions using the merkle proof committed by Bob.
 */

//todo emit Events
contract MerkleTransfers {
    error InvalidProof();
    error Unauthorized();
    error ArrayLengthMismatch();
    error AlreadyExecutedTransfer(address recipient);

    IERC20 internal token;
    address internal immutable owner;
    address internal executor;
    bytes32 public merkleRoot;

    mapping(bytes32 merkleRoot => mapping(address recipient => bool paid)) public executedTransfers;

    constructor(address _executor, address _token) {
        owner = msg.sender;
        executor = _executor;
        token = IERC20(_token);
    }

    function _onlyOwner() internal view {
        if (msg.sender != owner) revert Unauthorized();
    }

    /* ------------------------ OWNER ----------------------- */

    function changeMerkleRoot(bytes32 _merkleRoot) external {
        _onlyOwner();
        merkleRoot = _merkleRoot;
    }

    function changeExecutor(address _newExecutor) external {
        _onlyOwner();
        executor = _newExecutor;
    }

    function changeToken(address _newToken) external {
        _onlyOwner();
        token = IERC20(_newToken);
    }

    /* ---------------------- EXECUTOR ---------------------- */

    function singleTransfer(address recipient, uint256 amount, bytes32[] memory proof) external {
        if (msg.sender != executor) revert Unauthorized();
        if (executedTransfers[merkleRoot][recipient]) revert AlreadyExecutedTransfer(recipient);
        bytes32 leaf = keccak256(abi.encodePacked(recipient, amount));
        if (!MerkleProof.verify(proof, merkleRoot, leaf)) revert InvalidProof();
        executedTransfers[merkleRoot][recipient] = true;
        token.transfer(recipient, amount);
    }

    /**
     * Alternative:
     * use multiProofVerify from MerkleProof library
     */
    function multiProofTransfer(
        address[] memory recipients,
        uint256[] memory amounts,
        bytes32[][] memory proofs
    ) external {
        if (msg.sender != executor) revert Unauthorized();
        if (recipients.length != amounts.length || amounts.length != proofs.length) revert ArrayLengthMismatch();

        unchecked {
            for (uint256 i; i < recipients.length; ++i) {
                bytes32 leaf = keccak256(abi.encodePacked(recipients[i], amounts[i]));
                if (!MerkleProof.verify(proofs[i], merkleRoot, leaf)) revert InvalidProof();
                if (executedTransfers[merkleRoot][recipients[i]]) revert AlreadyExecutedTransfer(recipients[i]);
                executedTransfers[merkleRoot][recipients[i]] = true;
                token.transfer(recipients[i], amounts[i]);
            }
        }
    }

    /* ---------------------- VIEW ONLY --------------------- */

    function makeLeaf(address recipient, uint256 amount) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(recipient, amount));
    }

    function verifyWithLeaf(bytes32[] memory proof, bytes32 leaf) external view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function verifyProof(address recipient, uint256 amount, bytes32[] memory proof) external view returns (bool) {
        bytes32 leaf = makeLeaf(recipient, amount);
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}
