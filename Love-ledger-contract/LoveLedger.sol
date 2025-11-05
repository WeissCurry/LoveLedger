// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoveFundVault.sol";
import "./LoveNFT.sol";

contract LoveLedger {
    struct LoveContract {
        address creator;
        address partner;
        uint256 amount;
        bool refundOption; // true = refund, false = burn
        bool verifiedCreator;
        bool verifiedPartner;
        bool active;
        bool terminated;
        uint256 createdAt;
    }

    address payable public constant VAULT_ADDRESS = payable(0x089AF4D3Ff5ec4275cbdFcaf9a56DAdae8842691);
    address public constant NFT_ADDRESS   = 0xECB41F6403B96e315708e5e7757f0d9330157D33;

    LoveFundVault public vault;
    LoveNFT public nft;

    address public burnAddress = address(0xdead);
    uint256 public contractCount;

    mapping(uint256 => LoveContract) public loveContracts;

    event ContractCreated(uint256 contractId, address creator, address partner, uint256 amount);
    event WalletPaired(uint256 contractId);
    event MarriageVerified(uint256 contractId);
    event ContractTerminated(uint256 contractId, address terminatedBy);

    constructor() {
        vault = LoveFundVault(VAULT_ADDRESS);
        nft = LoveNFT(NFT_ADDRESS);
    }

    // 🔹 Create contract
    function createLoveContract(address _partner, bool _refundOption) external payable {
        require(msg.value > 0, "No ETH sent");
        require(_partner != address(0), "Invalid partner");

        contractCount++;
        loveContracts[contractCount] = LoveContract({
            creator: msg.sender,
            partner: _partner,
            amount: msg.value,
            refundOption: _refundOption,
            verifiedCreator: false,
            verifiedPartner: false,
            active: false,
            terminated: false,
            createdAt: block.timestamp
        });

        vault.deposit{value: msg.value}(contractCount);
        emit ContractCreated(contractCount, msg.sender, _partner, msg.value);
    }

    // 🔹 Pair partner
    function pairWallet(uint256 _id) external {
        LoveContract storage c = loveContracts[_id];
        require(msg.sender == c.partner, "Not partner");
        require(!c.active, "Already active");
        require(!c.terminated, "Contract terminated");

        c.active = true;
        emit WalletPaired(_id);
    }

    // 🔹 Verify marriage
    function verifyMarriage(uint256 _id) external {
        LoveContract storage c = loveContracts[_id];
        require(c.active, "Inactive");
        require(!c.terminated, "Terminated");

        if (msg.sender == c.creator) c.verifiedCreator = true;
        if (msg.sender == c.partner) c.verifiedPartner = true;

        if (c.verifiedCreator && c.verifiedPartner) {
            _finalizeMarriage(_id);
        }
    }

    function _finalizeMarriage(uint256 _id) internal {
        LoveContract storage c = loveContracts[_id];
        vault.releaseFunds(c.creator, c.partner, c.amount);
        nft.mint(c.creator);
        nft.mint(c.partner);
        c.active = false;
        emit MarriageVerified(_id);
    }

    // 🔹 Unpair / terminate
    function unpair(uint256 _id) external {
        LoveContract storage c = loveContracts[_id];
        require(c.active, "Inactive");
        require(!c.terminated, "Already terminated");
        require(msg.sender == c.creator || msg.sender == c.partner, "Not participant");

        c.terminated = true;
        c.active = false;

        if (c.refundOption) {
            // Refund all to remaining partner
            address receiver = msg.sender == c.creator ? c.partner : c.creator;
            vault.refund(receiver, c.amount);
        } else {
            // Burn funds
            vault.burnFunds(c.amount, burnAddress);
        }

        emit ContractTerminated(_id, msg.sender);
    }
}
