// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VerifierBytes {
    bytes32 public root;

    constructor(bytes32 _root) {
        root = _root;
    }

    function verify(bytes32[] memory proof, bytes32 leaf) public view {
        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
    }
}
