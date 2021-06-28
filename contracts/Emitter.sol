// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Emitter{
    event DonationReceived(address from, string token, uint256 amount,uint32 index,address publisher,uint timeStamp,address owner);
    event UserAdded(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares,address owner);
    event UserRemoved(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares,address owner);
    event UserModified(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares,address owner);
    event Distribution(uint256 amountDistributed,uint32 index,address publisher,uint timeStamp,string token,address owner);
    event TotalShares(uint128 totalShares,uint32 index,address publisher,uint timeStamp,address owner);
    event AddressCreated(address _address,address owner,uint timeStamp);
    
    function DonationReceived2(address from, string memory token, uint256 amount,uint32 index,address publisher,uint timeStamp,address owner) external {
        emit DonationReceived(from, token, amount,index,publisher,timeStamp, owner);
    }
    function UserAdded2(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares,address owner) external {
        emit UserAdded(userAddress,shares,index,publisher,timeStamp,totalShares,owner);
    }
    function UserRemoved2(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares,address owner) external {
        emit UserRemoved(userAddress,shares,index,publisher,timeStamp,totalShares, owner);
    }
    function UserModified2(address userAddress,uint128 shares,uint32 index,address publisher,uint timeStamp,uint128 totalShares,address owner) external {
        emit UserModified(userAddress,shares,index,publisher,timeStamp,totalShares, owner);
    }
    function Distribution2(uint256 amountDistributed,uint32 index,address publisher,uint timeStamp,string memory token,address owner) external {
        emit Distribution(amountDistributed,index,publisher,timeStamp,token, owner);
    }
    function TotalShares2(uint128 totalShares,uint32 index,address publisher,uint timeStamp,address owner) external {
        emit TotalShares(totalShares,index,publisher,timeStamp, owner);
    }

    function AddressCreated2(address _address,address owner,uint timeStamp) external{
        emit AddressCreated(_address, owner,timeStamp);
    }
    
}