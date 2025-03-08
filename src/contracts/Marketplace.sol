// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HederaMart is ReentrancyGuard, Pausable, Ownable {
    // Structs
    struct Listing {
        string id;
        address seller;
        string name;
        string description;
        uint256 price;
        string imageFileId;
        string category;
        bool isActive;
        uint256 createdAt;
    }

    struct EscrowTransaction {
        string listingId;
        address buyer;
        address seller;
        uint256 amount;
        bool isCompleted;
        bool isRefunded;
        uint256 createdAt;
    }

    // State variables
    mapping(string => Listing) public listings;
    mapping(string => EscrowTransaction) public escrowTransactions;
    string[] public activeListingIds;
    uint256 public escrowPeriod = 3 days;
    uint256 public platformFee = 25; // 2.5% fee (in basis points)

    // Events
    event ListingCreated(string indexed listingId, address indexed seller, uint256 price);
    event ListingUpdated(string indexed listingId, uint256 newPrice);
    event ListingDeactivated(string indexed listingId);
    event EscrowCreated(string indexed transactionId, string indexed listingId, address indexed buyer);
    event EscrowCompleted(string indexed transactionId);
    event EscrowRefunded(string indexed transactionId);
    event FundsReleased(string indexed transactionId, address indexed seller, uint256 amount);

    constructor() {
        _pause(); // Start paused for safety
    }

    // Modifiers
    modifier onlyListingSeller(string memory listingId) {
        require(listings[listingId].seller == msg.sender, "Not the seller");
        _;
    }

    modifier listingExists(string memory listingId) {
        require(listings[listingId].seller != address(0), "Listing not found");
        _;
    }

    modifier listingActive(string memory listingId) {
        require(listings[listingId].isActive, "Listing not active");
        _;
    }

    // Main functions
    function createListing(
        string memory listingId,
        string memory name,
        string memory description,
        uint256 price,
        string memory imageFileId,
        string memory category
    ) external whenNotPaused {
        require(price > 0, "Price must be greater than 0");
        require(listings[listingId].seller == address(0), "Listing ID already exists");

        Listing memory newListing = Listing({
            id: listingId,
            seller: msg.sender,
            name: name,
            description: description,
            price: price,
            imageFileId: imageFileId,
            category: category,
            isActive: true,
            createdAt: block.timestamp
        });

        listings[listingId] = newListing;
        activeListingIds.push(listingId);

        emit ListingCreated(listingId, msg.sender, price);
    }

    function purchaseItem(string memory listingId, string memory transactionId) 
        external 
        payable
        nonReentrant
        whenNotPaused
        listingExists(listingId)
        listingActive(listingId)
    {
        Listing storage listing = listings[listingId];
        require(msg.value == listing.price, "Incorrect payment amount");
        require(msg.sender != listing.seller, "Seller cannot buy own item");

        // Create escrow transaction
        EscrowTransaction memory transaction = EscrowTransaction({
            listingId: listingId,
            buyer: msg.sender,
            seller: listing.seller,
            amount: msg.value,
            isCompleted: false,
            isRefunded: false,
            createdAt: block.timestamp
        });

        escrowTransactions[transactionId] = transaction;
        listing.isActive = false;

        emit EscrowCreated(transactionId, listingId, msg.sender);
    }

    function completeTransaction(string memory transactionId) 
        external 
        nonReentrant 
        whenNotPaused
    {
        EscrowTransaction storage transaction = escrowTransactions[transactionId];
        require(msg.sender == transaction.buyer, "Only buyer can complete");
        require(!transaction.isCompleted && !transaction.isRefunded, "Transaction already finished");
        require(block.timestamp <= transaction.createdAt + escrowPeriod, "Escrow period expired");

        transaction.isCompleted = true;

        // Calculate platform fee
        uint256 feeAmount = (transaction.amount * platformFee) / 1000;
        uint256 sellerAmount = transaction.amount - feeAmount;

        // Transfer funds
        (bool feeSuccess, ) = owner().call{value: feeAmount}("");
        require(feeSuccess, "Fee transfer failed");

        (bool sellerSuccess, ) = transaction.seller.call{value: sellerAmount}("");
        require(sellerSuccess, "Seller transfer failed");

        emit EscrowCompleted(transactionId);
        emit FundsReleased(transactionId, transaction.seller, sellerAmount);
    }

    function refundTransaction(string memory transactionId) 
        external 
        nonReentrant 
        whenNotPaused
    {
        EscrowTransaction storage transaction = escrowTransactions[transactionId];
        require(
            msg.sender == transaction.buyer || 
            msg.sender == transaction.seller || 
            msg.sender == owner(),
            "Unauthorized"
        );
        require(!transaction.isCompleted && !transaction.isRefunded, "Transaction already finished");
        require(block.timestamp > transaction.createdAt + escrowPeriod, "Escrow period not expired");

        transaction.isRefunded = true;

        // Reactivate listing
        listings[transaction.listingId].isActive = true;

        // Refund buyer
        (bool success, ) = transaction.buyer.call{value: transaction.amount}("");
        require(success, "Refund failed");

        emit EscrowRefunded(transactionId);
    }

    // Admin functions
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 50, "Fee too high"); // Max 5%
        platformFee = newFee;
    }

    function updateEscrowPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod >= 1 days && newPeriod <= 7 days, "Invalid period");
        escrowPeriod = newPeriod;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getActiveListing(uint256 index) external view returns (Listing memory) {
        require(index < activeListingIds.length, "Index out of bounds");
        return listings[activeListingIds[index]];
    }

    function getActiveListingsCount() external view returns (uint256) {
        return activeListingIds.length;
    }

    function getTransaction(string memory transactionId) 
        external 
        view 
        returns (EscrowTransaction memory) 
    {
        return escrowTransactions[transactionId];
    }

    // Receive function
    receive() external payable {
        revert("Direct payments not accepted");
    }
} 