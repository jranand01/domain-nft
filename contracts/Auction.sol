// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract Auction{
    mapping (address => uint) biddersData;
    uint highestBidAmount;
    address highestBidder;
    uint startTime = block.timestamp;
    uint endTime;

    function putBid() public payable {
        uint calculateAmount = biddersData[msg.sender] + msg.value;

        require(block.timestamp<=endTime, "Ujan shrestha Auction is Endded");
        require(msg.value>0,"Bid Amount cannot be zero");

        require(calculateAmount>highestBidAmount, "Highest Bid Already Present");
        biddersData[msg.sender] = calculateAmount;
        highestBidAmount = calculateAmount;
        highestBidder = msg.sender;
    }

    function getContractBalance(address _address) public view returns(uint){
        return biddersData[_address];
    }

    function HighestBid() public view returns(uint){
        return highestBidAmount;
    }

    function HighestBidder() public view returns(address){
        return highestBidder;
    }

    function putEndTime(uint _endTime) public {
        endTime = _endTime;
    }

    function withdrawBid(address payable _address) public {

        require(biddersData[_address]>0,"Your address not found");
        if(biddersData[_address]>0){
            _address.transfer(biddersData[_address]);
            delete biddersData[_address];
        }
    }
}