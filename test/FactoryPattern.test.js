const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-helpers");
const deployERC1820 = require("@superfluid-finance/ethereum-contracts/scripts/deploy-erc1820");
const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const Emitter = artifacts.require("Emitter");
const BaseDistributor = artifacts.require("BaseDistributor");
const DistributorFactory = artifacts.require("DistributorFactory");
const truffleAssert = require("truffle-assertions");

contract("DistributorFactory", (accounts) => {
	const errorHandler = (err) => {
		console.log(err.message);
		if (err) throw err;
	};

	const names = ["Admin", "Alice", "Bob", "Carol", "Dan", "Emma", "Frank"];
	accounts = accounts.slice(0, names.length);
	console.log(accounts);
	let sf;
	let dai;
	let daix;
	let app;

	let _emitter;
	let _baseDistributor;
	let _distributorFactory;
	const u = {}; // object with all users
	const aliases = {};

	before(async function () {
		// process.env.RESET_SUPERFLUID_FRAMEWORK = 1;
		// process.env.RELEASE_VERSION = "v1";
		// await deployERC1820(errorHandler, {
		// 	web3,
		// 	from: accounts[0],
		// });
		// await deployFramework(errorHandler, {
		// 	web3,
		// 	from: accounts[0],
		// });

		_emitter = await Emitter.deployed();
		_baseDistributor = await BaseDistributor.deployed();
		_distributorFactory = await DistributorFactory.deployed();

		sf = new SuperfluidSDK.Framework({
			web3,
			version: "test",
			tokens: ["fDAIx", "fTUSDx", "fUSDCx"],
		});
		await sf.initialize();
	});

	// beforeEach(async function () {
	// 	await deployTestToken(errorHandler, [":", "fDAI"], {
	// 		web3,
	// 		from: accounts[0],
	// 	});
	// 	await deploySuperToken(errorHandler, [":", "fDAI"], {
	// 		web3,
	// 		from: accounts[0],
	// 	});

	// 	sf = new SuperfluidSDK.Framework({
	// 		web3,
	// 		version: "test",
	// 		tokens: ["fDAI"],
	// 	});
	// 	await sf.initialize();
	// 	daix = sf.tokens.fDAIx;
	// 	dai = await sf.contracts.TestToken.at(await sf.tokens.fDAI.address);
	// });
	// 	for (var i = 0; i < names.length; i++) {
	// 		u[names[i].toLowerCase()] = sf.user({
	// 			address: accounts[i],
	// 			token: daix.address,
	// 		});
	// 		u[names[i].toLowerCase()].alias = names[i];
	// 		aliases[u[names[i].toLowerCase()].address] = names[i];
	// 	}
	// 	for (const [, user] of Object.entries(u)) {
	// 		if (user.alias === "App") return;
	// 		await web3tx(dai.mint, `${user.alias} mints many dai`)(
	// 			user.address,
	// 			toWad(100000000),
	// 			{
	// 				from: user.address,
	// 			}
	// 		);
	// 		await web3tx(dai.approve, `${user.alias} approves daix`)(
	// 			daix.address,
	// 			toWad(100000000),
	// 			{
	// 				from: user.address,
	// 			}
	// 		);
	// 	}
	// 	//u.zero = { address: ZERO_ADDRESS, alias: "0x0" };
	// 	console.log(u.admin.address);
	// 	console.log(sf.host.address);
	// 	console.log(sf.agreements.cfa.address);
	// 	console.log(daix.address);
	// 	// app = await TradeableCashflow.new(
	// 	// 	u.admin.address,
	// 	// 	"TradeableCashflow",
	// 	// 	"TCF",
	// 	// 	sf.host.address,
	// 	// 	sf.agreements.cfa.address,
	// 	// 	daix.address
	// 	// );

	// 	// u.app = sf.user({ address: app.address, token: daix.address });
	// 	// u.app.alias = "App";
	// 	// await checkBalance(u.app);
	// });

	describe("Fuzzy testing", async function () {
		it("Case #6 - Random testing", async () => {
			const { alice, bob, carol, dan, admin } = u;
			// const appInitialBalance = await daix.balanceOf(app.address);
			// console.log(appInitialBalance);
			await _distributorFactory.EmitterAddress(_emitter.address);
			await _distributorFactory.setDistributorAddress(_baseDistributor.address);
			let temp = await _distributorFactory.createThing(
				sf.host.address,
				sf.agreements.ida.address,
				sf.tokens.fDAIx.address,
				sf.tokens.fUSDCx.address,
				sf.tokens.fTUSDx.address,
				process.env.TEMP_1820
			);
			const events = await _distributorFactory.getPastEvents("ThingCreated");
			let newAdd;
			try {
				newAdd = events[0]["args"]["newThingAddress"];
			} catch (error) {
				console("First");
			}
			console.log(newAdd);
			var contractInstance = await BaseDistributor.at(newAdd);
			console.log(typeof contractInstance);
			try {
				let te = await contractInstance.initalize2();
				// console.log(te);
			} catch (error) {
				console.log(error.message);
			}

			// truffleAssert.eventEmitted(temp, "ThingCreated", (ev) => {
			// 	console.log(ev.newThingAddress);
			// return ev.player === bettingAccount && !ev.betNumber.eq(ev.winningNumber);
			// });
			// console.log(temp);
			// await temp.initialize2();
		});
	});
});
