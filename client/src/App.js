import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./helpers/connector";
import getWeb3 from "./getWeb3";
import Web3 from "web3";
import Dashboard from "./pages/Dashboard";
import ManageSubscribers from "./pages/ManageSubscribers";
import TimeLine from "./pages/TimeLine";
import Web3Context from "./context/Web3Context";
import ManageAddresses from "./pages/ManageAddresses";
import ERC777Distributor from "./contracts/ERC777Distributor.json";
import ApproveSubscription from "./pages/ApproveSubscription";
import "./App.css";

import { Layout, Menu, Button } from "antd";
import {
	AreaChartOutlined,
	DatabaseOutlined,
	FieldTimeOutlined,
	UnorderedListOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

const { Link, Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
	const web3React = useWeb3React();
	const [collapsed, setCollapsed] = useState(true);
	const [currentUI, setcurrentUI] = useState(<Dashboard />);
	// console.log(web3React);

	const [metaMask, setMetaMask] = useState("");
	const details = useRef({
		web3: null,
		accounts: [],
		ethereum: null,
		chainid: 0,
	});

	const onError = (err) => {
		console.error(err);
		// debugger;
	};

	const activateWeb3 = () => {
		web3React.activate(injected, onError, true).catch((err) => {
			console.error(err);

			// debugger;
		});
	};

	useEffect(() => {
		if (typeof web3React.connector != "undefined")
			web3React.connector.getProvider().then((provider) => {
				// Instantiate web3.js
				// console.log(provider);
				const web3 = new Web3(provider);
				// console.log("web3 found");
				// console.log(web3);
				// const networkId = await web3.eth.net.getId();
				details.current.web3 = web3;
				details.current.chainid = web3React.chainId;
				// details.current.networkId = networkId;
				setMetaMask("GotWeb3");
				provider.on("chainChanged", handleChainChanged);
				provider.on("accountsChanged", handleAccountsChanged);
				provider.on("close", handleClose);
				provider.on("networkChanged", handleNetworkChanged);
			});
	}, [web3React.active, web3React.connector]);

	useEffect(() => {
		if (details.current.web3 === null) {
			return;
		}
		const networkId = details.current.chainid;
		// console.log(networkId);
		const cc = ERC777Distributor.networks[web3React.chainId];
		// console.log(cc);
		const local1nstance = new details.current.web3.eth.Contract(
			ERC777Distributor.abi,
			cc.address
		);
		// const con = new Contract(
		// 	ERC777Distributor.networks[web3React.chainId].address,
		// 	ERC777Distributor.abi,
		// 	web3React.library.getSigner()
		// );
		details.current.mainContract = local1nstance;
		details.current.web3.eth.getAccounts((err, accounts) => {
			if (err) {
				debugger;
				console.error(err);
			} else {
				if (accounts.length > 0) {
					details.current.accounts = accounts[0];
					setMetaMask("Set");
				}
			}
		});
	}, [details.current.web3]);

	// useEffect(() => {
	// 	async function setup() {
	// 		const web3 = await getWeb3();
	// 		console.log("web3 found");
	// 		details.current.web3 = web3;
	// 		details.current.chainid = parseInt(await web3.eth.getChainId());
	// 		setMetaMask("GotWeb3");
	// 		await web3.eth.getAccounts((error, accounts) => {
	// 			details.current.accounts = accounts;
	// 			console.log(accounts);
	// 			if (accounts.length > 0) {
	// 				setMetaMask("Set");
	// 				console.log("Set in accounts");
	// 				web3React.activate(injected, onError, true).catch((err) => {
	// 					console.error(err);
	// 					debugger;
	// 				});
	// 			}
	// 		});
	// 	}
	// 	setup();
	// }, []);

	//TO DO: Handling the following

	function handleChainChanged(chainId) {
		details.current.chainid = chainId;
		window.location.reload();
		activateWeb3();
	}
	function handleAccountsChanged(accounts) {
		if (accounts.length > 0) {
			details.current.accounts = accounts;
		} else {
			details.current.accounts = accounts;
			setMetaMask("");
		}
	}
	function handleClose() {
		setMetaMask("");
	}
	function handleNetworkChanged() {}

	async function ConnectWallet() {
		activateWeb3();
		// try {
		// 	details.current.ethereum
		// 		.request({ method: "eth_requestAccounts" })
		// 		.then((accounts) => {
		// 			details.current.accounts = accounts;
		// 			setMetaMask("Set");
		// 		})
		// 		.catch((error) => console.log("Error"));
		// } catch (error) {
		// 	console.log(error);
		// }
	}

	async function loadContract(contract) {
		// Load a deployed contract instance into a web3 contract object

		// Get the address of the most recent deployment from the deployment map
		const deployedNetwork = contract.networks[details.current.chainid];

		return new details.current.web3.eth.Contract(
			contract.abi,
			deployedNetwork.address
		);
	}

	function onCollapse(collapse) {
		setCollapsed(collapse);
	}

	function onItemClick(item) {
		// console.log(item);
		switch (item.key) {
			case "1":
				setcurrentUI(<Dashboard />);
				break;
			case "2":
				setcurrentUI(<ManageSubscribers />);
				break;
			case "3":
				setcurrentUI(<TimeLine />);
				break;
			case "4":
				setcurrentUI(<ManageAddresses />);
				// setcurrentUI(<Borrow />);
				break;
			case "5":
				//Set Aave
				// setcurrentUI(<Aave />);
				break;
			default:
				break;
		}
	}
	// async function GetBalance() {
	// 	const advisory = await loadContract("dev", "AdvisoryToken");
	// 	const val = await advisory.methods.totalSupply().call();
	// 	console.log(details.current.web3.utils.fromWei(val));
	// }

	// async function MintExtra() {
	// 	const advisory = await loadContract("dev", "AdvisoryToken");
	// 	const val = await advisory.methods
	// 		.mint()
	// 		.send({ from: details.current.accounts[0], gasLimit: 210000 });
	// 	console.log(val);
	// }

	return (
		<Layout>
			<Header
				className="header"
				style={{ position: "fixed", zIndex: 1, width: "100%" }}
			>
				{metaMask !== "Set" && (
					<Button type="primary" onClick={ConnectWallet}>
						Connect Wallet
					</Button>
				)}
			</Header>
			<Content className="site-layout" style={{ marginTop: 64 }}>
				<Web3Context.Provider value={details}>
					<Layout style={{ minHeight: "92vh" }}>
						<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
							<div className="logo" />
							<Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
								<Menu.Item
									key="1"
									icon={<AreaChartOutlined />}
									onClick={onItemClick}
								>
									Dashboard
								</Menu.Item>
								<Menu.Item
									key="4"
									icon={<UnorderedListOutlined />}
									onClick={onItemClick}
								>
									Manage Accounts
								</Menu.Item>
								<Menu.Item
									key="2"
									icon={<DatabaseOutlined />}
									onClick={onItemClick}
								>
									Manage Receivers
								</Menu.Item>
								<Menu.Item
									key="3"
									icon={<FieldTimeOutlined />}
									onClick={onItemClick}
								>
									Timeline
								</Menu.Item>
							</Menu>
						</Sider>
						<Layout className="site-layout">
							<Content>
								<div
									className="site-layout-background"
									style={{ padding: 24, minHeight: 360 }}
								>
									{currentUI}
								</div>
							</Content>
							<Footer style={{ textAlign: "center" }}>
								ERC777 Funds Distributor ©2021 Created by{" "}
								<Link href="https://twitter.com/themystery" target="_blank">
									Prafful Sahu
								</Link>
							</Footer>
						</Layout>
					</Layout>
				</Web3Context.Provider>
			</Content>
		</Layout>
		// <div>
		// 	{!web3React.active && (
		// 		<button onClick={ConnectWallet}>Connect Wallet!</button>
		// 	)}
		// 	{metaMask === "Set" && "Metamask is available"}
		// </div>
	);
}

export default App;
