const { web3tx } = require("@decentral.ee/web3-helpers");
// const { setWeb3Provider } = require("@decentral.ee/web3-helpers/src/config");
const {
	getWeb3,
	setWeb3Provider,
} = require("@openzeppelin/test-helpers/src/config/web3");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const ERC777Distributor = artifacts.require("ERC777Distributor");

module.exports = async function (callback) {
	try {
		const version = process.env.RELEASE_VERSION || "test";
		console.log("release version:", version);

		// make sure that we are using the same web3 provider in the helpers
		setWeb3Provider(web3.currentProvider);

		const sf = new SuperfluidSDK.Framework({
			web3,
			version: version,
			tokens: ["fDAI"],
		});
		await sf.initialize();

		const app = await web3tx(ERC777Distributor.new, "Deploy ERC777Distributor")(
			sf.tokens.fDAIx.address,
			sf.host.address,
			sf.agreements.ida.address
		);
		console.log("App deployed at", app.address);
		// console.log(callback);
	} catch (err) {
		// console.log(err);
		callback(err);
	}
};
