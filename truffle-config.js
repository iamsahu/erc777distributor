const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();
module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	contracts_build_directory: path.join(__dirname, "client/src/contracts"),
	networks: {
		develop: {
			host: "localhost",
			network_id: "5777",
			port: 7545,
		},
		ganache: {
			port: 8545,
			network_id: 1337,
		},
		rinkeby: {
			provider: () =>
				new HDWalletProvider(
					process.env.WALLET_KEY,
					`https://rinkeby.infura.io/v3/54f53cd1a12849f68a59cf47944054ec`
				),
			network_id: 4, // Rinkeby's id
			gas: 5500000, // Rinkeby has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider(
					process.env.WALLET_KEY,
					`https://ropsten.infura.io/v3/54f53cd1a12849f68a59cf47944054ec`
				),
			network_id: 3, // Ropsten's id
			gas: 5500000, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		goerli: {
			provider: () =>
				new HDWalletProvider(
					process.env.WALLET_KEY,
					`https://goerli.infura.io/v3/54f53cd1a12849f68a59cf47944054ec`
				),
			network_id: 5, // Ropsten's id
			gas: 5500000, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
	},
	compilers: {
		solc: {
			version: "0.8.0",
		},
	},
};
