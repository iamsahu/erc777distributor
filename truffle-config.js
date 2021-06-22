const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
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
					`b3ae65f191aac33f3e3f662b8411cabf14f91f2b48cf338151d6021ea1c08541`,
					`https://rinkeby.infura.io/v3/54f53cd1a12849f68a59cf47944054ec`
				),
			network_id: 4, // Ropsten's id
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
