// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LoveFundVault is ReentrancyGuard {
    mapping(uint256 => uint256) public vaultBalance;

    receive() external payable {}

    function deposit(uint256 _id) external payable {
        vaultBalance[_id] += msg.value;
    }

    function releaseFunds(address _creator, address _partner, uint256 _amount) external nonReentrant {
        uint256 half = _amount / 2;
        payable(_creator).transfer(half);
        payable(_partner).transfer(half);
        vaultBalance[_amount] = 0;
    }

    function refund(address _receiver, uint256 _amount) external nonReentrant {
        payable(_receiver).transfer(_amount);
    }

    function burnFunds(uint256 _amount, address _burnAddress) external nonReentrant {
        payable(_burnAddress).transfer(_amount);
    }
}
