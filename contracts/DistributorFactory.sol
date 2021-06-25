pragma solidity ^0.8.0;
import './CloneFactory.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './BaseDistributor.sol';


contract DistributorFactory is CloneFactory,Ownable{
    address emitter;
    address distributorContract;
    address[] public distributors;
    event ThingCreated(address newThingAddress);

  function EmitterAddress(address _libraryAddress) public onlyOwner{
    emitter = _libraryAddress;
  }

  function setDistributorAddress(address _libraryAddress) public onlyOwner {
    distributorContract = _libraryAddress;
  }

  function createThing(ISuperfluid host,
        IInstantDistributionAgreementV1 ida) public onlyOwner {
    address clone = createClone(distributorContract);
    BaseDistributor(clone).initialize(host,ida,emitter,msg.sender);
    distributors.push(clone);
    emit ThingCreated(clone);
  }
}