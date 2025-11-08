// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract LoveLedger is ERC721, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status { Dating, BrokeUp, Married }

    struct Deposit {
        address depositor;      // who funded the deposit
        address token;          // address(0) = ETH, else ERC20 token address
        uint256 amount;         // amount deposited
        bool withdrawn;         // whether deposit was withdrawn
    }

    struct Relationship {
        address partnerA;       // minter
        address partnerB;       // invited partner
        Status status;          // current relationship status
        uint64  startedAt;      // timestamp
        bool    locked;         // hard lock once broke up to prevent status flip-flops
    }

    // address => partner address (0 if single / not in active relationship)
    mapping(address => address) public partnerOf;

    // tokenId => relationship data
    mapping(uint256 => Relationship) public relationships;

    // tokenId => deposit data (single deposit by minter at start)
    mapping(uint256 => Deposit) public deposits;

    // Optional: per-token(min currency) minimums; default 0 means no minimum
    mapping(address => uint256) public minDeposit; // key: token (address(0) for ETH)

    uint256 private _nextId = 1;

    event RelationshipStarted(
        uint256 indexed tokenId,
        address indexed partnerA,
        address indexed partnerB,
        address depositToken,
        uint256 depositAmount
    );

    event StatusUpdated(uint256 indexed tokenId, Status status);
    event DepositWithdrawn(uint256 indexed tokenId, address to, address token, uint256 amount);

    constructor() ERC721("LoveLedger", "LOVE") Ownable(msg.sender) {}

    // Admin can set minimum required deposit for a given currency (ETH=address(0))
    function setMinDeposit(address token, uint256 amount) external onlyOwner {
        minDeposit[token] = amount;
    }

    /// @notice Start a relationship and mint the LOVE NFT to msg.sender.
    /// @param partner The partner address to pair with.
    /// @param depositToken address(0) for ETH, or ERC20 address for token deposits.
    /// @param depositAmount For ERC20 deposits, the amount to transferFrom. Ignored for ETH.
    function startRelationship(
        address partner,
        address depositToken,
        uint256 depositAmount
    ) external payable nonReentrant returns (uint256 tokenId) {
        require(partner != address(0), "Partner required");
        require(partner != msg.sender, "Can't date yourself :)");
        require(partnerOf[msg.sender] == address(0), "You are already in a relationship");
        require(partnerOf[partner] == address(0), "Partner is already in a relationship");

        // Handle deposit logic
        if (depositToken == address(0)) {
            // ETH path
            require(msg.value >= minDeposit[address(0)], "ETH below minimum");
            depositAmount = msg.value;
        } else {
            // ERC20 path
            require(msg.value == 0, "Don't send ETH with ERC20");
            require(depositAmount >= minDeposit[depositToken], "ERC20 below minimum");
            IERC20(depositToken).safeTransferFrom(msg.sender, address(this), depositAmount);
        }

        tokenId = _nextId++;
        _safeMint(msg.sender, tokenId);

        relationships[tokenId] = Relationship({
            partnerA: msg.sender,
            partnerB: partner,
            status: Status.Dating,
            startedAt: uint64(block.timestamp),
            locked: false
        });

        deposits[tokenId] = Deposit({
            depositor: msg.sender,
            token: depositToken,
            amount: depositAmount,
            withdrawn: false
        });

        // set partner mapping (both directions)
        partnerOf[msg.sender] = partner;
        partnerOf[partner] = msg.sender;

        emit RelationshipStarted(tokenId, msg.sender, partner, depositToken, depositAmount);
        emit StatusUpdated(tokenId, Status.Dating);
    }

    /// @notice Mark relationship as Married (only one of the partners can call).
    function setMarried(uint256 tokenId) external {
        Relationship storage rel = relationships[tokenId];
        _requireIsPartner(tokenId, msg.sender);
        require(!rel.locked, "Relationship locked");
        require(rel.status == Status.Dating, "Not in Dating state");
        rel.status = Status.Married;
        emit StatusUpdated(tokenId, Status.Married);
        // mapping remains since still partners
    }

    /// @notice Mark relationship as BrokeUp (only one of the partners can call).
    /// Irreversible; also clears partner mapping.
    function setBrokeUp(uint256 tokenId) external {
        Relationship storage rel = relationships[tokenId];
        _requireIsPartner(tokenId, msg.sender);
        require(rel.status != Status.BrokeUp, "Already BrokeUp");
        // Once broke up, lock to prevent toggling back to Married
        rel.status = Status.BrokeUp;
        rel.locked = true;
        emit StatusUpdated(tokenId, Status.BrokeUp);

        // clear partner mapping for both if still pointing to each other
        if (partnerOf[rel.partnerA] == rel.partnerB) partnerOf[rel.partnerA] = address(0);
        if (partnerOf[rel.partnerB] == rel.partnerA) partnerOf[rel.partnerB] = address(0);
    }

    /// @notice Withdraw initial deposit if and only if status is Married.
    /// Only the original depositor may withdraw, and only once.
    function withdrawDeposit(uint256 tokenId, address to) external nonReentrant {
        Relationship storage rel = relationships[tokenId];
        Deposit storage dep = deposits[tokenId];

        require(dep.depositor == msg.sender, "Only depositor");
        require(!dep.withdrawn, "Already withdrawn");
        require(rel.status == Status.Married, "Not allowed unless Married");
        require(to != address(0), "Bad recipient");

        dep.withdrawn = true;

        if (dep.token == address(0)) {
            (bool ok, ) = to.call{value: dep.amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(dep.token).safeTransfer(to, dep.amount);
        }

        emit DepositWithdrawn(tokenId, to, dep.token, dep.amount);
    }

    /// ----- View helpers -----
    function isPartner(address a, address b) external view returns (bool) {
        return partnerOf[a] == b && partnerOf[b] == a;
    }

    function getStatus(uint256 tokenId) external view returns (Status) {
        return relationships[tokenId].status;
    }

    function partnersOfToken(uint256 tokenId) external view returns (address, address) {
        Relationship storage r = relationships[tokenId];
        return (r.partnerA, r.partnerB);
    }

    /// ----- Internal helpers -----
    function _requireIsPartner(uint256 tokenId, address caller) internal view {
        Relationship storage r = relationships[tokenId];
        require(
            caller == r.partnerA || caller == r.partnerB,
            "Not a relationship partner"
        );
    }

    /// @notice Optional: baseURI for token metadata
    string private _baseTokenURI;

    function setBaseURI(string memory newBase) external onlyOwner {
        _baseTokenURI = newBase;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
