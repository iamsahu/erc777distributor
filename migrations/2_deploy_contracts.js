// const { web3tx } = require("@decentral.ee/web3-helpers");
// // const { setWeb3Provider } = require("@decentral.ee/web3-helpers/src/config");
// const {
// 	getWeb3,
// 	setWeb3Provider,
// } = require("@openzeppelin/test-helpers/src/config/web3");
// const SuperfluidSDK = require("@superfluid-finance/js-sdk");
// const ERC777Distributor = artifacts.require("ERC777Distributor");

// module.exports = async function (callback) {
// 	try {
// 		const version = "v1"; //process.env.RELEASE_VERSION || "test"; //"v1"
// 		console.log("release version:", version);

// 		// make sure that we are using the same web3 provider in the helpers
// 		setWeb3Provider(web3.currentProvider);

// 		const sf = new SuperfluidSDK.Framework({
// 			web3,
// 			version: version,
// 			tokens: ["fDAI"],
// 		});
// 		await sf.initialize();

// 		const app = await web3tx(ERC777Distributor.new, "Deploy ERC777Distributor")(
// 			sf.tokens.fDAIx.address,
// 			sf.host.address,
// 			sf.agreements.ida.address
// 		);
// 		console.log("App deployed at", app.address);
// 		// console.log(callback);
// 	} catch (err) {
// 		// console.log(err);
// 		callback(err);
// 	}
// };

var Migrations = artifacts.require("./ERC777Distributor.sol");
const Emitter = artifacts.require("Emitter");
const BaseDistributor = artifacts.require("BaseDistributor");
const DistributorFactory = artifacts.require("DistributorFactory");

module.exports = function (deployer, network, accounts) {
	deployer.deploy(Emitter);
	deployer.deploy(BaseDistributor);
	deployer.deploy(DistributorFactory);
	if (network == "develop") return;
	deployer.deploy(
		Migrations,
		// "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90",//Comment For Multitoken
		"0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6",
		"0x32E0ecb72C1dDD92B007405F8102c1556624264D"
		// "0xBF6201a6c48B56d8577eDD079b84716BB4918E8A", //Ropsten
		// "0xF2B4E81ba39F5215Db2e05B2F66f482BB8e87FD2",
		// "0xAD1e87F0C74341ecAFc1d27349dD6e650f5bAdD7"
	);
};
