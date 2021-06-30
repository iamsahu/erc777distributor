const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();
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
				new HDWalletProvider(process.env.WALLET_KEY, process.env.RINKEBY),
			network_id: 4, // Rinkeby's id
			gas: 5500000, // Rinkeby has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
			networkCheckTimeout: 50000,
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider(process.env.WALLET_KEY, process.env.ROPSTEN),
			network_id: 3, // Ropsten's id
			gas: 5500000, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		goerli: {
			provider: () =>
				new HDWalletProvider(process.env.WALLET_KEY, process.env.GOERLI),
			network_id: 5, // Ropsten's id
			gas: 5500000, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		kovan: {
			provider: () =>
				new HDWalletProvider(process.env.WALLET_KEY_K, process.env.KOVAN),
			network_id: 42, // Ropsten's id
			gas: 5500000, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		matic: {
			provider: () =>
				new HDWalletProvider(process.env.WALLET_KEY, process.env.MUMBAI),
			network_id: 80001,
			confirmations: 2,
			timeoutBlocks: 200,
			skipDryRun: true,
		},
	},
	compilers: {
		solc: {
			version: ">=0.6.0 <=0.8.0",
		},
	},
};
