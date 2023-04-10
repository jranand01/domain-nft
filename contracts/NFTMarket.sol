// Marketplace-License-Identifier: Anand Blockchain
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTMarket is ReentrancyGuard,ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _tokensCanceled;


    address public  marketOwner;
    address payable owner;
    uint public sellFeePercentage; // Sell fee percentage

    uint256 listingPrice = 0.025 ether;

    constructor() ERC721("Endless", "NFTS") {
        owner = payable(msg.sender);
        sellFeePercentage = 15; // Set the initial sell fee percentage to 15%
        marketOwner = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    }
//-------------------------------- market item stock
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool canceled;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        bool canceled
    );


    /* ---------------------------Returns the market listing price of the nft contract */

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
        require(owner == msg.sender, "Only marketplace owner can update listing price.");
        listingPrice = _listingPrice;
    }
    // Function to set the sell fee percentage
//    function setSellFeePercentage(uint percentage) public {
//        require(msg.sender == marketOwner, "Only the owner can set the sell fee percentage");
//        sellFeePercentage = percentage;
//    }


    // Function to calculate the sell fee
    function calculateSellFee(uint amount) public view returns (uint) {
        return amount * sellFeePercentage / 100;
    }




    /* put places an item for sale on the nft marketplace */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Sell Price must be at least 1 wei");
        require(msg.value == listingPrice, "Sell Price must be equal to your listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        //------------------------------------------market item
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
        //-------------------------address 0 will not get owner anything like commision after sale so, need to keep owner address
            payable(address(0)),
            price,
            false,
            false
        );
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false,
            false
        );
    }

    //=========@anand_code allows someone to resell a token they have purchased
    function resellToken(address nftContract, uint256 marketItemId, uint256 price) public payable nonReentrant {
        uint256 itemId = idToMarketItem[marketItemId].tokenId;
        uint256 tokenId = itemId;
        require(tokenId > 0, "Market item has to exist");
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can resell NFTs");

        IERC721(nftContract).approve(owner, tokenId);
        /* allows someone to resell a token they have purchased */
        setApprovalForAll(owner, true);
        //------------------------------------------resell market item
        idToMarketItem[itemId].itemId = itemId;
        idToMarketItem[tokenId].tokenId = tokenId;
        idToMarketItem[tokenId].canceled = false;

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        _tokensCanceled.decrement();
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(this),
            price,
            false,
            false
        );

    }

    /* remove your nft from sale of a marketplace item */
    /*    function cancelSellOrder(uint256 tokenId) external {
            // Cancel the sell order
    //        require(idToMarketItem[tokenId].sold == true, "Sell order does not exist");
            *//*require(idToMarketItem[tokenId].seller == msg.sender, "Only seller can cancel sell order");
        delete idToMarketItem[tokenId];*//*
        setApprovalForAll(contractAddress, false);
    }*/

    //=====================@anand_code Cancel a market item
    function cancelSellOrder(address nftContract, uint256 marketItemId) public payable nonReentrant {
        uint256 tokenId = idToMarketItem[marketItemId].tokenId;
        require(tokenId > 0, "Market item has to exist");

        require(idToMarketItem[marketItemId].seller == msg.sender, "You are not the seller");
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[marketItemId].owner = payable(msg.sender);
        idToMarketItem[marketItemId].canceled = true;
        _tokensCanceled.increment();
    }
    /* -------------sending nft to buyer and ransfer matic to seller  */

    /* buy Created the sale of a marketplace item purchase it */
    /* Transfers ownership of the nft item, as well as funds between parties token address  to buyer??*/
    /* -------------sending nft to buyer and ransfer matic to seller  */
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        // Calculate the sell fee
        uint sellFee = calculateSellFee(idToMarketItem[itemId].price);
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        // Send the sell fee to the marketplace owner
        payable(marketOwner).transfer(sellFee);
        idToMarketItem[itemId].seller.transfer(msg.value-sellFee);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }



    /* ---------------- this  function to return all unsold market nfts */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint256 canceledItemsCount = _tokensCanceled.current();
        uint256 soldItemsCount = _itemsSold.current();
        uint unsoldItemCount = _itemIds.current() - soldItemsCount - canceledItemsCount;
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0) || idToMarketItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /*--------------- This function Returns only nfts that a user has purchased  */
    /*--------------- owner left nft= owner MarketItem[]  */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    /* personal address This function Returns (return total nft by owner listed) only nfts a owner (user) has created in his matic chain */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
