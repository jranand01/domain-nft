// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';


contract NFTAuctionEndless is ERC721URIStorage, ReentrancyGuard {

    uint256 public tokenCounter;
    uint256 public listingCounter;

    uint8 public constant STATUS_OPEN = 1;
    uint8 public constant STATUS_DONE = 2;

    uint256 public minAuctionIncrement = 5; // minimum 5 percent increament on biding
    uint256 public sellFeePercentage = 15; // Set the initial sell fee percentage to 15%
    address private marketOwner = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    struct Listing {
        address seller;//Owner or seller
        uint256 tokenId; //token ID
        uint256 price; // display latest price
        uint256 netPrice; // actual bid listing price
        uint256 startAt; //bid start time
        uint256 endAt; //bid end time
        uint8 status; //bid open or close
        uint256 countBidders;
    }

    event Minted(address indexed minter, uint256 nftID, string uri);
    event AuctionCreated(uint256 listingId, address indexed seller, uint256 price, uint256 tokenId, uint256 startAt, uint256 endAt);
    event BidCreated(uint256 listingId, address indexed bidder, uint256 bid);
    event AuctionCompleted(uint256 listingId, address indexed seller, address indexed bidder, uint256 bid);
    event WithdrawBid(uint256 listingId, address indexed bidder, uint256 bid);

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => mapping(address => uint256)) public bids;
    mapping(uint256 => address) public highestBidder; // highest bidder
    mapping(uint256 => uint256) public highestBid; //highest bid amount

    constructor() ERC721("Endless-Domain-Auction", "ERC721") {
        tokenCounter = 0;
        listingCounter = 0;
    }


    function mint(string memory tokenURI, address minterAddress) public returns (uint256) {
        tokenCounter++;
        uint256 tokenId = tokenCounter;

        _safeMint(minterAddress, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit Minted(minterAddress, tokenId, tokenURI);

        return tokenId;
    }

    function StartAuctionListing (uint256 price, uint256 tokenId, uint256 durationInSeconds) public returns (uint256) {
        listingCounter++;
        uint256 listingId = listingCounter;

        uint256 startAt = block.timestamp;
        uint256 endAt = startAt + durationInSeconds;

        listings[listingId] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            netPrice: price,
            status: STATUS_OPEN,
            startAt: startAt,
            endAt: endAt,
            countBidders: 0
        });

        _transfer(msg.sender, address(this), tokenId);

        emit AuctionCreated(listingId, msg.sender, price, tokenId, startAt, endAt);

        return listingId;
    }

    function makeBid(uint256 listingId) public payable nonReentrant {
        require(isAuctionOpen(listingId), 'This auction has ended or finished');
        Listing storage listing = listings[listingId];
        require(msg.sender != listing.seller, "You Can't  create Biding on what you have !");

        uint256 newBid = bids[listingId][msg.sender] + msg.value;
        require(newBid >= listing.price, "You Can't bid less then latest bidding price value !!");
        highestBid[listingId] = newBid;
        bids[listingId][msg.sender] += msg.value;
        highestBidder[listingId] = msg.sender;
        // uint256 incentive = listing.price / minAuctionIncrement;
        // listing.price = listing.price + incentive;
        listing.price = newBid;
        listing.countBidders+=1;
        emit BidCreated(listingId, msg.sender, newBid);
    }


    function totalbidderCount(uint256 listingId)public view returns(uint256){
        require(isAuctionOpen(listingId), 'This auction has ended or finished');
        Listing storage listing = listings[listingId];
        return  listing.countBidders;
    }

    // Function to calculate the sell fee
    function calculateSellFee(uint amount) public view returns (uint) {
        return amount * sellFeePercentage / 100;
    }
    function completeAuctionClose(uint256 listingId) public payable nonReentrant {
        require(!isAuctionOpen(listingId), 'Hi, Your auction is still open, not closed !');

        Listing storage listing = listings[listingId];
        address winner = highestBidder[listingId];
        require(
            msg.sender == listing.seller || msg.sender == winner,
            'Only seller(owner) or bid winner can close auction'
        );

        if(winner != address(0)) {

            _transfer(address(this), winner, listing.tokenId);

            uint256 amount = bids[listingId][winner];
            // Calculate and minus the market sell fee % rest amount send to owner
            uint256 sellFee = calculateSellFee(amount);
            bids[listingId][winner] = 0;
            _transferFund(payable(listing.seller), sellFee);

        } else {
            _transfer(address(this), listing.seller, listing.tokenId);
        }

        listing.status = STATUS_DONE;

        emit AuctionCompleted(listingId, listing.seller, winner, bids[listingId][winner]);
    }



    function isAuctionOpen(uint256 id) public view returns (bool) {
        return
        listings[id].status == STATUS_OPEN &&
        listings[id].endAt > block.timestamp;
    }
    function withdrawYourBid(uint256 listingId) public payable nonReentrant {
        require(isAuctionExpired(listingId), 'Recent Auction must be ended or closed');
        require(highestBidder[listingId] != msg.sender, 'Highest bidder cannot withdraw bid');

        uint256 balance = bids[listingId][msg.sender];
        bids[listingId][msg.sender] = 0;
        _transferFund(payable(msg.sender), balance);
        emit WithdrawBid(listingId, msg.sender, balance);

    }


    function OrginalListingPrice(uint256 listingId) public view returns(uint){
        Listing storage listing = listings[listingId];
        return listing.netPrice;
    }
    function isAuctionExpired(uint256 id) public view returns (bool) {
        return listings[id].endAt <= block.timestamp;
    }



    function _transferFund(address payable to, uint256 amount) internal {
        if (amount == 0) {
            return;
        }
        require(to != address(0), 'Error, You cannot transfer to address(0)');
        (bool transferSent, ) = to.call{value: amount}("");
        require(transferSent, "Error, Failed to send Ether or do Transection");
    }

}