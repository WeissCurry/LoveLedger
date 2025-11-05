// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoveNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("LoveProofNFT", "LOVE") Ownable(msg.sender) {}

    function mint(address _to) external onlyOwner {
        tokenCounter++;
        _safeMint(_to, tokenCounter);
    }

    function _beforeTokenTransfer(
    address from,
    address to,
    uint256 
) internal pure {  
    require(from == address(0) || to == address(0), "Soulbound: non-transferable");
}

}