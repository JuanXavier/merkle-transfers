// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20("MyToken", "MTK") {
    constructor() {
        _mint(msg.sender, 1_000_000 ether);
    }

    //root 0x9dc88cc9da1e433a8903455f6d32b1440ef39a63ad26b6178c956d99256b511b
    
}
