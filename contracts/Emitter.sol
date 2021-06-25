pragma solidity ^0.8.0;

contract Emitter{
    event DonationReceived(address from, string token, uint256 amount,uint32 index,address publisher,uint timeStamp);
    event UserAdded(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares);
    event UserRemoved(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares);
    event UserModified(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares);
    event Distribution(uint256 amountDistributed,uint32 index,address publisher,uint timeStamp,string token);
    event TotalShares(uint128 totalShares,uint32 index,address publisher,uint timeStamp);
    
    function DonationReceived2(address from, string memory token, uint256 amount,uint32 index,address publisher,uint timeStamp) external {
        emit DonationReceived(from, token, amount,index,publisher,timeStamp);
    }
    function UserAdded2(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares) external {
        emit UserAdded(userAddress,shares,index,publisher,timeStamp,totalShares);
    }
    function UserRemoved2(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares) external {
        emit UserRemoved(userAddress,shares,index,publisher,timeStamp,totalShares);
    }
    function UserModified2(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares) external {
        emit UserModified(userAddress,shares,index,publisher,timeStamp,totalShares);
    }
    function Distribution2(uint256 amountDistributed,uint32 index,address publisher,uint timeStamp,string memory token) external {
        emit Distribution(amountDistributed,index,publisher,timeStamp,token);
    }
    function TotalShares2(uint128 totalShares,uint32 index,address publisher,uint timeStamp) external {
        emit TotalShares(totalShares,index,publisher,timeStamp);
    }
    
}